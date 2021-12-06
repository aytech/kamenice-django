import logging
import os

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from graphene import ObjectType, List, Field, Int, Mutation, InputObjectType, ID, String, Decimal, Argument
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from sendgrid import SendGridAPIClient, Mail

from api.constants import ENVIRON_EMAIL_CONFIRMATION_TEMPLATE, ENVIRON_EMAIL_API_KEY
from api.models.Guest import Guest as GuestModel
from api.models.Reservation import Reservation as ReservationModel
from api.models.Suite import Suite as SuiteModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.exceptions.Unauthorized import Unauthorized
from api.schemas.helpers.DateHelper import DateHelper
from api.schemas.helpers.PriceHelper import PriceHelper


class Reservation(DjangoObjectType):
    class Meta:
        model = ReservationModel
        fields = (
            'expired', 'from_date', 'guest', 'id', 'meal', 'notes', 'paying_guest', 'price_accommodation',
            'price_meal', 'price_municipality', 'price_total', 'purpose', 'roommates', 'suite', 'to_date', 'type')


class ReservationTypeOption(ObjectType):
    label = String(required=True)
    value = String(required=True)


class ReservationQuery(ObjectType):
    reservation = Field(Reservation, reservation_id=Int())
    reservations = List(Reservation)
    reservation_meals = List(ReservationTypeOption)
    reservation_types = List(ReservationTypeOption)
    suite_reservations = List(Reservation, suite_id=Int())

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

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservation_meals(self, _info):
        return map(lambda choice: ReservationTypeOption(label=choice[1], value=choice[0]),
                   ReservationModel.MEAL_CHOICES)

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservation_types(self, _info):
        return map(lambda choice: ReservationTypeOption(label=choice[1], value=choice[0]),
                   ReservationModel.TYPE_CHOICES)


class Price(ObjectType):
    accommodation = Int(required=True)
    meal = Int(required=True)
    municipality = Int(required=True)
    total = Int(required=True)


class PriceInput(InputObjectType):
    guests = List(Int, required=True)
    meal = String()
    number_days = Int(required=True)
    settings_id = Int()
    suite_id = Int(required=True)


class CalculateReservationPriceQuery(ObjectType):
    price = Field(Price, data=Argument(PriceInput))

    @user_passes_test(lambda user: user.has_perm('api.change_reservation'), exc=PermissionDenied)
    def resolve_price(self, _info, data=None):
        try:
            helper = PriceHelper(data)
            return helper.calculate(Price)
        except ObjectDoesNotExist:
            return None


class ReservationInput(InputObjectType):
    expired = String()
    from_date = String()
    guest_id = Int()
    id = ID()
    meal = String()
    notes = String()
    paying_guest_id = Int()
    price_accommodation = Decimal()
    price_meal = Decimal()
    price_municipality = Decimal()
    price_total = Decimal()
    purpose = String()
    roommate_ids = List(Int)
    suite_id = Int()
    to_date = String()
    type = String()


class ReservationUtility:

    @staticmethod
    def get_duplicate(suite_id, instance):
        # Match range with start date within the range of the new reservation
        inner_query = Q(
            from_date__gte=instance.from_date,
            to_date__lte=instance.to_date,
            suite_id=suite_id,
        )
        # Match range that is surrounding the new reservation
        outer_query = Q(
            from_date__lte=instance.from_date,
            to_date__gte=instance.to_date,
            suite_id=suite_id
        )
        # Match range with start date within the range of the new reservation
        start_date_query = Q(
            from_date__lte=instance.from_date,
            to_date__gte=instance.from_date,
            suite_id=suite_id
        )
        # Match range with end date within the range of the new reservation
        end_date_query = Q(
            from_date__lte=instance.to_date,
            to_date__gte=instance.to_date,
            suite_id=suite_id
        )
        return ReservationModel.objects.filter(inner_query | outer_query | start_date_query | end_date_query).exclude(
            deleted=True)


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
            instance.guest = GuestModel.objects.get(pk=data.guest_id, deleted=False)
        except ObjectDoesNotExist:
            raise Exception(_('Please select guest from the list'))

        if data.paying_guest_id is not None:
            try:
                instance.paying_guest = GuestModel.objects.get(pk=data.paying_guest_id, deleted=False)
            except ObjectDoesNotExist:
                raise Exception(_('Please select paying guest from the list'))

        try:
            instance.suite = SuiteModel.objects.get(pk=data.suite_id)
        except ObjectDoesNotExist:
            raise Exception(_('Room not found'))

        try:
            instance.full_clean()
        except ValidationError as errors:
            raise Exception(errors.messages[0])

        instance.save()

        try:
            for roommate_id in data.roommate_ids:
                instance.roommates.add(GuestModel.objects.get(pk=roommate_id))
        except ObjectDoesNotExist as ex:
            logging.getLogger('kamenice').error('Failed to add roommate {}'.format(ex))

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
                instance.expired = data.expired
                instance.from_date = data.from_date if data.from_date is not None else instance.from_date
                instance.to_date = data.to_date if data.to_date is not None else instance.to_date

                duplicate = ReservationUtility.get_duplicate(data.suite_id, instance=instance)
                if duplicate.count() > 0 and str(duplicate.get().id) != data.id:
                    raise Exception(_('The room is already reserved for this period of time'))

                instance.meal = data.meal if data.meal is not None else instance.meal
                instance.notes = data.notes if data.notes is not None else instance.notes
                instance.price_accommodation = data.price_accommodation \
                    if data.price_accommodation is not None else instance.price_accommodation
                instance.price_meal = data.price_meal if data.price_meal is not None else instance.price_meal
                instance.price_municipality = data.price_municipality \
                    if data.price_municipality is not None else instance.price_municipality
                instance.price_total = data.price_total if data.price_total is not None else instance.price_total
                instance.purpose = data.purpose if data.purpose is not None else instance.purpose
                instance.type = data.type if data.type is not None else instance.type

                try:
                    instance.guest = GuestModel.objects.get(pk=data.guest_id)
                except ObjectDoesNotExist:
                    raise Exception(_('Please select guest from the list'))

                if data.paying_guest_id is not None:
                    try:
                        instance.paying_guest = GuestModel.objects.get(pk=data.paying_guest_id, deleted=False)
                    except ObjectDoesNotExist:
                        raise Exception(_('Please select paying guest from the list'))
                else:
                    instance.paying_guest = None

                # Roommates are recreated from scratch
                for roommate_id in instance.roommates.all():
                    instance.roommates.remove(roommate_id)

                try:
                    for roommate_id in data.roommate_ids:
                        instance.roommates.add(GuestModel.objects.get(pk=roommate_id))
                except ObjectDoesNotExist as ex:
                    logging.getLogger('kamenice').error('Failed to add roommate {}'.format(ex))

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                instance.save()

                return UpdateReservation(reservation=instance)

        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))


class ReservationDragInput(InputObjectType):
    from_date = String()
    id = ID()
    suite_id = Int()
    to_date = String()


class DragReservation(Mutation):
    class Arguments:
        data = ReservationDragInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = ReservationModel.objects.get(pk=data.id, deleted=False)
            suite = SuiteModel.objects.get(pk=data.suite_id, deleted=False)
            if instance and suite:
                instance.from_date = data.from_date if data.from_date is not None else instance.from_date
                instance.to_date = data.to_date if data.to_date is not None else instance.to_date
                instance.suite = suite

                duplicate = ReservationUtility.get_duplicate(data.suite_id, instance=instance)
                # When dragging, new instance might have overlapping dates
                if duplicate.count() > 1:
                    raise Exception(_('The room is already reserved for this period of time'))
                if duplicate.count() == 1 and str(duplicate.get().id) != data.id:
                    raise Exception(_('The room is already reserved for this period of time'))

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                instance.save()

                return DragReservation(reservation=instance)
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
                'guests': 1 + instance.roommates.count(),
                'meal': instance.read_meal(instance.meal),
                'price': str(instance.price_total),
                'to': DateHelper.get_formatted_date(instance.to_date),
                'type': instance.read_type(instance.type),
                'url': '{}/rezervace/{}/hoste'.format(settings.APP_URL, instance.hash)
            }
            message.template_id = os.environ[ENVIRON_EMAIL_CONFIRMATION_TEMPLATE]

            SendGridAPIClient(os.environ[ENVIRON_EMAIL_API_KEY]).send(message)

            logging.getLogger('kamenice').info('Reservation confirmation sent to {}'.format(instance.guest))

            return SendConfirmationEmail(reservation=instance)
        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))
        except Exception as ex:
            logging.getLogger('kamenice').error('Reservation confirmation could not be sent: {}'.format(ex))
            raise Exception(_('Could not send confirmation email'))
