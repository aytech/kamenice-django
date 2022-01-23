import logging

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from api.schemas.helpers.PriceHelper import PriceHelper
from api.models.Price import Price
from api.models.Reservation import Reservation


class ReservationHelper:
    @staticmethod
    def add_price_calculation(data, reservation, guests, suite, settings, model=None, extra=False):
        price = PriceHelper(data=data, guests=guests, suite=suite, settings=settings,
                            discounts=suite.discount_suite_set.all()).calculate()

        if extra:
            accommodation = price.accommodation
            meal = price.meal
            municipality = price.municipality
            total = price.total
        else:
            accommodation = data.price.accommodation if data.price.accommodation is not None else price.accommodation
            meal = data.price.meal if data.price.meal is not None else price.meal
            municipality = data.price.municipality if data.price.municipality is not None else price.municipality
            total = data.price.total if data.price.total is not None else price.total

        if model is not None:
            model.accommodation = accommodation
            model.meal = meal
            model.municipality = municipality
            model.total = total
        else:
            model = Price(accommodation=accommodation, days=data.number_days, meal=meal, municipality=municipality,
                          reservation=reservation, suite=suite, total=total)
        try:
            model.full_clean()
            model.save()
        except ValidationError as e:
            logging.getLogger('kamenice').error('Failed to add price for suite {}, error: {}'.format(suite.id, e))

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
            if reservation.suite.id == suite_id:
                raise Exception(_('The room is already reserved for this period of time'))
            if extra_suites_ids is not None and reservation.suite.id in extra_suites_ids:
                raise Exception(
                    _('The room "%(room)s" is already reserved for this period of time') % {
                        'room': reservation.suite.title})
            for extra in reservation.extra_suites.all():
                if extra.id in extra_suites_ids:
                    raise Exception(
                        _('The room "%(room)s" is already reserved for this period of time') % {'room': extra.title})
