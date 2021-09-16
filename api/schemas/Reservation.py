import logging
import os

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db.models import Q
from graphene import ObjectType, List, Field, Int, Mutation, InputObjectType, ID, String, Decimal
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _
from sendgrid import SendGridAPIClient, Mail

from api.models.Guest import Guest
from api.models.Reservation import Reservation as ReservationModel
from api.models.Suite import Suite
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.exceptions.Unauthorized import Unauthorized
from api.schemas.helpers.DateHelper import DateHelper


class Reservation(DjangoObjectType):
    class Meta:
        model = ReservationModel
        fields = (
            'from_date', 'guest', 'id', 'meal', 'notes', 'price_accommodation', 'price_extra', 'price_meal',
            'price_municipality', 'price_total', 'purpose', 'suite', 'to_date', 'type')


class ReservationQuery(ObjectType):
    suite_reservations = List(Reservation, suite_id=Int())
    reservation = Field(Reservation, reservation_id=Int())
    reservations = List(Reservation)

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_suite_reservations(self, _info, suite_id):
        try:
            return ReservationModel.objects.get(suite_id=suite_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservation(self, _query, _info, reservation_id):
        try:
            return ReservationModel.objects.get(pk=reservation_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservations(self, _info):
        return ReservationModel.objects.filter(deleted=False)


class ReservationInput(InputObjectType):
    from_date = String()
    guest_id = Int()
    id = ID()
    meal = String()
    notes = String()
    price_accommodation = Decimal()
    price_extra = Decimal()
    price_meal = Decimal()
    price_municipality = Decimal()
    price_total = Decimal()
    purpose = String()
    roommates_ids = List(Int)
    suite_id = Int()
    to_date = String()
    type = String()


class ReservationUtility:

    @staticmethod
    def get_duplicate(suite_id, instance):
        return ReservationModel.objects.filter(
            # Match range that is surrounding the new reservation
            Q(
                deleted=False,
                from_date__lte=instance.from_date,
                suite_id=suite_id,
                to_date__gte=instance.to_date
            )
            |  # Match range with start date within the range of the new reservation
            Q(
                deleted=False,
                from_date__gt=instance.from_date,
                suite_id=suite_id,
                from_date__lt=instance.to_date
            )
            |  # Match range with end date within the range of the new reservation
            Q(
                deleted=False,
                to_date__gt=instance.from_date,
                suite_id=suite_id,
                to_date__lt=instance.to_date
            )
        )


class CreateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    @user_passes_test(lambda user: user.has_perm('api.add_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        instance = ReservationModel(
            from_date=data.from_date,
            meal=data.meal,
            notes=data.notes,
            price_accommodation=data.price_accommodation,
            price_extra=data.price_extra,
            price_meal=data.price_meal,
            price_municipality=data.price_municipality,
            price_total=data.price_total,
            purpose=data.purpose,
            to_date=data.to_date,
            type=data.type,
        )

        if ReservationUtility.get_duplicate(data.suite_id, instance=instance).count() > 0:
            raise Exception(_('The room is already reserved for this period of time'))

        try:
            instance.guest = Guest.objects.get(pk=data.guest_id)
        except ObjectDoesNotExist:
            raise Exception(_('Please select guest from the list'))

        try:
            instance.suite = Suite.objects.get(pk=data.suite_id)
        except ObjectDoesNotExist:
            raise Exception(_('Room not found'))

        try:
            instance.full_clean()
        except ValidationError as errors:
            raise Exception(errors.messages[0])

        instance.save()

        instance.save()

        return CreateReservation(reservation=instance)


class UpdateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = ReservationModel.objects.get(pk=data.id, deleted=False)

            if instance:
                instance.from_date = data.from_date if data.from_date is not None else instance.from_date
                instance.to_date = data.to_date if data.to_date is not None else instance.to_date

                duplicate = ReservationUtility.get_duplicate(data.suite_id, instance=instance)

                if duplicate.count() > 1 or str(duplicate.get().id) != data.id:
                    raise Exception(_('The room is already reserved for this period of time'))

                instance.meal = data.meal if data.meal is not None else instance.meal
                instance.notes = data.notes if data.notes is not None else instance.notes
                instance.price_accommodation = data.price_accommodation \
                    if data.price_accommodation is not None else instance.price_accommodation
                instance.price_extra = data.price_extra if data.price_extra is not None else instance.price_extra
                instance.price_meal = data.price_meal if data.price_meal is not None else instance.price_meal
                instance.price_municipality = data.price_municipality \
                    if data.price_municipality is not None else instance.price_municipality
                instance.price_total = data.price_total if data.price_total is not None else instance.price_total
                instance.purpose = data.purpose if data.purpose is not None else instance.purpose
                instance.type = data.type if data.type is not None else instance.type

                try:
                    instance.guest = Guest.objects.get(pk=data.guest_id)
                except ObjectDoesNotExist:
                    raise Exception(_('Please select guest from the list'))

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                instance.save()

                return UpdateReservation(reservation=instance)

        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))


class DeleteReservation(Mutation):
    class Arguments:
        reservation_id = ID()

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.delete_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, reservation_id):
        try:
            instance = ReservationModel.objects.get(pk=reservation_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteReservation(reservation=instance)
        except ObjectDoesNotExist:
            return DeleteReservation(reservation=None)


class SendConfirmationEmail(Mutation):
    class Arguments:
        reservation_id = ID()

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, reservation_id):
        try:
            env = os.environ['DJANGO_SETTINGS_MODULE']

            if env == 'kamenice_django.settings.development':
                from kamenice_django.settings import development as settings
            else:
                from kamenice_django.settings import production as settings

            instance = ReservationModel.objects.get(pk=reservation_id, deleted=False)

            message = Mail(
                from_email=settings.FROM_EMAIL_ADDRESS,
                to_emails=','.join([instance.guest.email]))
            message.dynamic_template_data = {
                'from': DateHelper.get_formatted_date(instance.from_date),
                'guests': 1 + instance.guest.roommate_set.count(),
                'meal': instance.read_meal(instance.meal),
                'price': str(instance.price_total),
                'to': DateHelper.get_formatted_date(instance.to_date),
                'type': instance.read_type(instance.type),
                'url': '{}/rezervace/{}/hoste'.format(settings.APP_URL, instance.hash)
            }
            message.template_id = os.environ['EMAIL_TEMPLATE_ID']

            SendGridAPIClient(os.environ['EMAIL_API_KEY']).send(message)

            logging.getLogger('kamenice').info('Reservation confirmation sent to {}'.format(instance.guest))

            return SendConfirmationEmail(reservation=instance)
        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))
        except Exception as ex:
            logging.getLogger('kamenice').error('Reservation confirmation could not be sent: {}'.format(ex))
            raise Exception(_('Could not send confirmation email'))
