import logging

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from api.models.Guest import Guest
from api.models.Price import Price
from api.models.Reservation import Reservation
from api.models.Roommate import Roommate
from api.models.Suite import Suite
from api.schemas.helpers.FormHelper import FormHelper


class ReservationHelper:
    @staticmethod
    def add_price_calculation(helper, model, price_data):
        price = helper.calculate()
        model.accommodation = FormHelper.get_numeric(price_data.accommodation, price.accommodation)
        model.meal = FormHelper.get_numeric(price_data.meal, price.meal)
        model.municipality = FormHelper.get_numeric(price_data.municipality, price.municipality)
        model.total = FormHelper.get_numeric(price_data.total, price.total)
        model.save()

    @staticmethod
    def add_extra_price_calculation(helper, model):
        price = helper.calculate()
        model.accommodation = price.accommodation
        model.meal = price.meal
        model.municipality = price.municipality
        model.total = price.total
        model.save()

    @staticmethod
    def update_or_create_extra_suite_price(reservation_id, suite_id, price_helper):
        try:
            suite = Suite.objects.get(pk=suite_id, deleted=False)
        except ObjectDoesNotExist:
            return
        price = price_helper.calculate()
        try:
            price_model = Price.objects.get(reservation_id=reservation_id, suite_id=suite.id)
        except ObjectDoesNotExist:  # Price calculation not found, create new
            price_model = Price(accommodation=price.accommodation, days=price.days, meal=price.meal,
                                municipality=price.municipality, reservation_id=reservation_id, suite_id=suite.id,
                                total=price.total)
        price_model.save()

    @staticmethod
    def check_duplicates(suite_id, extra_suites_ids, from_date, to_date, instance_id=None):
        # Match range with start date within the range of the new reservation
        inner_query = Q(
            from_date__gte=from_date,
            to_date__lte=to_date,
        )
        # Match range that is surrounding the new reservation
        outer_query = Q(
            from_date__lte=from_date,
            to_date__gte=to_date,
        )
        # Match range with start date within the range of the new reservation
        start_date_query = Q(
            from_date__lte=from_date,
            to_date__gte=from_date,
        )
        # Match range with end date within the range of the new reservation
        end_date_query = Q(
            from_date__lte=to_date,
            to_date__gte=to_date,
        )
        result = Reservation.objects.filter(inner_query | outer_query | start_date_query | end_date_query).exclude(
            deleted=True)
        for reservation in result.all():
            if reservation.id == instance_id:
                continue
            if reservation.suite.id == int(suite_id):
                raise Exception(_('The room is already reserved for this period of time'))
            if extra_suites_ids is not None and reservation.suite.id in extra_suites_ids:
                raise Exception(
                    _('The room "%(room)s" is already reserved for this period of time') % {
                        'room': reservation.suite.title})
            for extra in reservation.extra_suites.all():
                if extra.id in extra_suites_ids:
                    raise Exception(
                        _('The room "%(room)s" is already reserved for this period of time') % {'room': extra.title})

    @staticmethod
    def update_reservation_roommates(reservation, roommates=None):
        if roommates is not None:
            try:
                for roommate in roommates:
                    entity_model = Guest.objects.get(pk=roommate.id)
                    roommate_model = ReservationHelper.get_roommate(reservation=reservation, guest=entity_model)
                    from_date = FormHelper.get_attribute_value(roommate, 'from_date')
                    to_date = FormHelper.get_attribute_value(roommate, 'to_date')
                    if roommate_model is None:
                        Roommate(
                            entity=entity_model,
                            from_date=from_date if from_date is not None else reservation.from_date,
                            reservation=reservation,
                            to_date=to_date if to_date is not None else reservation.to_date
                        ).save()
                    else:
                        roommate_model.from_date = from_date if from_date is not None else reservation.from_date
                        roommate_model.to_date = to_date if to_date is not None else reservation.to_date
                        roommate_model.save()
            except ObjectDoesNotExist as ex:
                logging.getLogger('kamenice').error('Failed to add roommate {}'.format(ex))

    @staticmethod
    def get_roommate(reservation, guest):
        try:
            return Roommate.objects.get(reservation=reservation, entity=guest)
        except ObjectDoesNotExist:
            return None
