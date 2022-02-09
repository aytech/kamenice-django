import logging

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.utils.translation import gettext_lazy as _
from graphene import ObjectType, Field, Mutation, ID, Argument
from graphql_jwt.decorators import user_passes_test

from api.constants import RESERVATION_TYPE_INQUIRY
from api.models.Guest import Guest as GuestModel
from api.models.Price import Price as PriceModel
from api.models.Reservation import Reservation as ReservationModel
from api.models.Settings import Settings as SettingsModel
from api.models.Suite import Suite as SuiteModel
from api.schemas.Price import PriceOutput, PriceInput
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.helpers.EmailHelper import EmailHelper
from api.schemas.helpers.FormHelper import FormHelper
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
            helper = PriceHelper(days=data.number_days, meal_option=data.meal, guests=guests, suite=suite,
                                 settings=settings, discounts=suite.discount_suite_set.all())
            return helper.calculate()
        except ObjectDoesNotExist:
            return None


class CreateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, info, data=None):
        # Validate guest to an existing user
        try:
            guest_model = GuestModel.objects.get(pk=data.guest_id, deleted=False)
        except ObjectDoesNotExist:
            raise Exception(_('Please select guest from the list'))
        # Validate main suite
        try:
            suite_model = SuiteModel.objects.get(pk=data.suite_id)
        except ObjectDoesNotExist:
            raise Exception(_('Room not found'))
        reservation_model = ReservationModel(
            from_date=data.from_date,
            guest=guest_model,
            meal=data.meal,
            notes=data.notes,
            purpose=data.purpose,
            suite=suite_model,
            to_date=data.to_date,
            type=data.type,
        )
        # Validate paying guest, if provided, to an existing user
        if data.paying_guest_id is not None:
            try:
                reservation_model.paying_guest = GuestModel.objects.get(pk=data.paying_guest_id, deleted=False)
            except ObjectDoesNotExist:
                raise Exception(_('Please select paying guest from the list'))
        # Try to find conflicting reservations
        ReservationHelper.check_duplicates(suite_id=data.suite_id, extra_suites_ids=data.extra_suites_ids,
                                           from_date=data.from_date, to_date=data.to_date)
        try:
            reservation_model.full_clean()
        except ValidationError as errors:
            raise Exception(errors.messages[0])
        reservation_model.save()
        # Collect all guests for price calculation
        all_guests = [guest_model]

        ReservationHelper.update_reservation_roommates(reservation_model, data.roommates)

        try:
            settings_model = SettingsModel.objects.get(username=info.context.user)
            price_helper = PriceHelper(days=data.number_days, meal_option=data.meal, guests=all_guests,
                                       settings=settings_model, suite=suite_model,
                                       discounts=suite_model.discount_suite_set.all())
            price_model = PriceModel(days=data.number_days, reservation=reservation_model, suite=suite_model)
            ReservationHelper.add_price_calculation(price_helper, price_model, price_data=data.price)
            # Calculate price for related suites, if necessary
            if data.type == RESERVATION_TYPE_INQUIRY:
                for extra_suite_id in data.extra_suites_ids:
                    try:
                        extra_suite = SuiteModel.objects.get(pk=extra_suite_id, deleted=False)
                        reservation_model.extra_suites.add(extra_suite)
                        price_helper = PriceHelper(days=data.number_days, meal_option=data.meal, guests=all_guests,
                                                   settings=settings_model, suite=extra_suite,
                                                   discounts=extra_suite.discount_suite_set.all())
                        price_model = PriceModel(days=data.number_days, reservation=reservation_model,
                                                 suite=extra_suite)
                        ReservationHelper.add_extra_price_calculation(price_helper, price_model)
                    except ObjectDoesNotExist:
                        logging.getLogger('kamenice').error('Failed to calculate price for {}'.format(extra_suite_id))
        except ObjectDoesNotExist:
            logging.getLogger('kamenice').error('Failed to calculate price for {}'.format(suite_model.id))
        return CreateReservation(reservation=reservation_model)


class UpdateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, info, data=None):
        try:
            reservation_model = ReservationModel.objects.get(pk=data.id, deleted=False)
        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))
        ReservationHelper.check_duplicates(suite_id=data.suite_id, extra_suites_ids=data.extra_suites_ids,
                                           from_date=data.from_date, to_date=data.to_date,
                                           instance_id=reservation_model.id)
        try:
            suite_model = SuiteModel.objects.get(pk=data.price.suite_id, deleted=False)
        except ObjectDoesNotExist:
            raise Exception(_('Suite not found'))
        try:
            reservation_model.guest = GuestModel.objects.get(pk=data.guest_id, deleted=False)
        except ObjectDoesNotExist:
            raise Exception(_('Please select guest from the list'))
        try:
            settings_model = SettingsModel.objects.get(username=info.context.user)
        except ObjectDoesNotExist:
            return UpdateReservation(reservation=None)
        if data.paying_guest_id is not None:
            try:
                reservation_model.paying_guest = GuestModel.objects.get(pk=data.paying_guest_id, deleted=False)
            except ObjectDoesNotExist:
                raise Exception(_('Please select paying guest from the list'))

        # To be used in price calculations
        all_guests = [reservation_model.guest]

        reservation_model.expired = FormHelper.get_value(data.expired)
        reservation_model.from_date = FormHelper.get_value(data.from_date, reservation_model.from_date)
        reservation_model.to_date = FormHelper.get_value(data.to_date, reservation_model.to_date)
        reservation_model.meal = FormHelper.get_value(data.meal, reservation_model.meal)
        reservation_model.notes = FormHelper.get_value(data.notes, reservation_model.notes)
        reservation_model.purpose = FormHelper.get_value(data.purpose, reservation_model.purpose)
        reservation_model.type = FormHelper.get_value(data.type, reservation_model.type)

        # Roommates and extra suites are recreated from scratch
        reservation_model.roommate_set.all().delete()
        for suite_id in reservation_model.extra_suites.all():
            reservation_model.extra_suites.remove(suite_id)

        ReservationHelper.update_reservation_roommates(reservation_model, data.roommates)

        if data.extra_suites_ids is not None:
            try:
                for extra_suite_id in data.extra_suites_ids:
                    extra_suite = SuiteModel.objects.get(pk=extra_suite_id, deleted=False)
                    reservation_model.extra_suites.add(extra_suite)
            except ObjectDoesNotExist as ex:
                logging.getLogger('kamenice').error('Failed to add extra suite {}'.format(ex))

        try:
            reservation_model.full_clean()
        except ValidationError as errors:
            raise Exception(errors.messages[0])
        # Clear residual reservation prices, if exist
        if reservation_model.type != RESERVATION_TYPE_INQUIRY:
            for price in reservation_model.price_set.all():
                if price.suite.id != reservation_model.suite.id:
                    price.delete()

        reservation_model.save()

        # Calculate price for reservation
        price_helper = PriceHelper(days=data.number_days, meal_option=data.meal, guests=all_guests,
                                   settings=settings_model, suite=suite_model,
                                   discounts=suite_model.discount_suite_set.all())
        try:
            price_model = PriceModel.objects.get(reservation_id=reservation_model.id, suite_id=suite_model.id)
        except ObjectDoesNotExist:
            price_model = PriceModel(days=data.number_days, reservation=reservation_model, suite=suite_model)
        ReservationHelper.add_price_calculation(price_helper, price_model, price_data=data.price)

        return UpdateReservation(reservation=reservation_model)


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
    def mutate(cls, _root, info, data):
        try:
            instance = ReservationModel.objects.get(pk=data.reservation_id, deleted=False)
            settings = SettingsModel.objects.get(username=info.context.user)
            handler = EmailHelper(reservation=instance, data=data, settings=settings)
            handler.send_mail()
            return SendConfirmationEmail(reservation=instance)
        except ObjectDoesNotExist:
            raise Exception(_('Reservation not found'))
        except Exception as ex:
            logging.getLogger('kamenice').error('Reservation confirmation could not be sent: {}'.format(ex))
            raise Exception(_('Could not send confirmation email'))
