import logging

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.utils.translation import gettext_lazy as _
from graphene import ObjectType, Field, Mutation, ID, Argument
from graphql_jwt.decorators import user_passes_test

from api.constants import RESERVATION_TYPE_INQUIRY
from api.models.Guest import Guest as GuestModel
from api.models.Reservation import Reservation as ReservationModel
from api.models.Settings import Settings as SettingsModel
from api.models.Suite import Suite as SuiteModel
from api.schemas.Price import PriceOutput, PriceInput
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.exceptions.Unauthorized import Unauthorized
from api.schemas.helpers.EmailHelper import EmailHelper
from api.schemas.helpers.PriceHelper import PriceHelper
from api.schemas.helpers.ReservationHelper import ReservationHelper
from api.schemas.models.Reservation import ReservationInput, Reservation, ReservationDragInput, ConfirmationInput


class CalculateReservationPriceQuery(ObjectType):
    price = Field(PriceOutput, data=Argument(PriceInput))

    @user_passes_test(lambda user: user.has_perm('api.change_reservation'), exc=PermissionDenied)
    def resolve_price(self, info, data=None):
        try:
            guests = GuestModel.objects.filter(pk__in=data.guests)
            suite = SuiteModel.objects.get(pk=data.suite_id)
            settings = SettingsModel.objects.get(username=info.context.user)
            helper = PriceHelper(data=data, guests=guests, suite=suite, settings=settings,
                                 discounts=suite.discount_suite_set.all())
            return helper.calculate()
        except ObjectDoesNotExist:
            return None


class CreateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    @user_passes_test(lambda user: user.has_perm('api.add_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, info, data=None):
        # Try to find conflicting reservations first
        ReservationHelper.check_duplicates(suite_id=data.suite_id, extra_suites_ids=data.extra_suites_ids,
                                           from_date=data.from_date, to_date=data.to_date)
        # Collect all guests for price calculation
        all_guests = []
        # To be used in price calculations
        settings = SettingsModel.objects.get(username=info.context.user)
        # Basic model
        instance = ReservationModel(
            from_date=data.from_date,
            meal=data.meal,
            notes=data.notes,
            purpose=data.purpose,
            to_date=data.to_date,
            type=data.type,
        )
        # Validate guest to an existing user
        try:
            guest = GuestModel.objects.get(pk=data.guest_id, deleted=False)
            instance.guest = guest
            all_guests.append(guest)
        except ObjectDoesNotExist:
            raise Exception(_('Please select guest from the list'))
        # Validate paying guest, if provided, to an existing user
        if data.paying_guest_id is not None:
            try:
                instance.paying_guest = GuestModel.objects.get(pk=data.paying_guest_id, deleted=False)
            except ObjectDoesNotExist:
                raise Exception(_('Please select paying guest from the list'))
        # Validate main suite
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
                roommate = GuestModel.objects.get(pk=roommate_id)
                instance.roommates.add(roommate)
                all_guests.append(roommate)
        except ObjectDoesNotExist as ex:
            logging.getLogger('kamenice').error('Failed to add roommate {}'.format(ex))

        if data.type == RESERVATION_TYPE_INQUIRY:
            try:
                for extra_suite_id in data.extra_suites_ids:
                    suite = SuiteModel.objects.get(pk=extra_suite_id, deleted=False)
                    instance.extra_suites.add(suite)
                    ReservationHelper.add_price_calculation(data=data, reservation=instance, guests=all_guests,
                                                            suite=suite, settings=settings, extra=True)
            except ObjectDoesNotExist as ex:
                logging.getLogger('kamenice').error('Failed to add extra suite {}'.format(ex))

        instance.save()

        ReservationHelper.add_price_calculation(data=data, reservation=instance, guests=all_guests,
                                                suite=instance.suite, settings=settings)

        return CreateReservation(reservation=instance)


class UpdateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, info, data=None):
        try:
            instance = ReservationModel.objects.get(pk=data.id, deleted=False)
            if instance:
                ReservationHelper.check_duplicates(suite_id=data.suite_id, extra_suites_ids=data.extra_suites_ids,
                                                   from_date=data.from_date, to_date=data.to_date,
                                                   instance_id=instance.id)
                # To be used in price calculations
                all_guests = [instance.guest]
                settings = SettingsModel.objects.get(username=info.context.user)

                instance.expired = data.expired
                instance.from_date = data.from_date if data.from_date is not None else instance.from_date
                instance.to_date = data.to_date if data.to_date is not None else instance.to_date

                instance.meal = data.meal if data.meal is not None else instance.meal
                instance.notes = data.notes if data.notes is not None else instance.notes
                instance.purpose = data.purpose if data.purpose is not None else instance.purpose
                instance.type = data.type if data.type is not None else instance.type

                if data.suite_id is not None and data.suite_id != instance.suite.id:
                    try:
                        suite = SuiteModel.objects.get(pk=data.suite_id, deleted=False)
                        instance.suite = suite
                    except ObjectDoesNotExist:
                        logging.getLogger('kamenice').error('Failed to change suite to {}'.format(data.suite_id))

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

                # Roommates, extra suites and prices are recreated from scratch
                for roommate_id in instance.roommates.all():
                    instance.roommates.remove(roommate_id)
                for price in instance.price_set.all():
                    price.delete()
                for suite_id in instance.extra_suites.all():
                    instance.extra_suites.remove(suite_id)

                if data.roommate_ids is not None:
                    try:
                        for roommate_id in data.roommate_ids:
                            roommate = GuestModel.objects.get(pk=roommate_id)
                            instance.roommates.add(roommate)
                            all_guests.append(roommate)
                    except ObjectDoesNotExist as ex:
                        logging.getLogger('kamenice').error('Failed to add roommate {}'.format(ex))

                if instance.type == RESERVATION_TYPE_INQUIRY:
                    try:
                        for extra_suite_id in data.extra_suites_ids:
                            extra_suite = SuiteModel.objects.get(pk=extra_suite_id, deleted=False)
                            instance.extra_suites.add(extra_suite)
                            ReservationHelper.add_price_calculation(data=data, reservation=instance, guests=all_guests,
                                                                    suite=extra_suite, settings=settings, extra=True)
                    except ObjectDoesNotExist as ex:
                        logging.getLogger('kamenice').error('Failed to add extra suite {}'.format(ex))

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                ReservationHelper.add_price_calculation(data=data, reservation=instance, guests=all_guests,
                                                        suite=instance.suite, settings=settings)

                instance.save()

                return UpdateReservation(reservation=instance)
            return UpdateReservation(reservation=None)

        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))


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
                ReservationHelper.check_duplicates(suite_id=data.suite_id, extra_suites_ids=data.extra_suites_ids,
                                                   from_date=data.from_date, to_date=data.to_date,
                                                   instance_id=instance.id)
                instance.from_date = data.from_date if data.from_date is not None else instance.from_date
                instance.to_date = data.to_date if data.to_date is not None else instance.to_date
                instance.suite = suite

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
        data = ConfirmationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data):
        try:
            instance = ReservationModel.objects.get(pk=data.reservation_id, deleted=False)
            handler = EmailHelper(instance, data)
            handler.send_mail()
            return SendConfirmationEmail(reservation=instance)
        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))
        except Exception as ex:
            logging.getLogger('kamenice').error('Reservation confirmation could not be sent: {}'.format(ex))
            raise Exception(_('Could not send confirmation email'))
