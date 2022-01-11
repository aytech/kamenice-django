from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from api.schemas.helpers.PriceHelper import PriceHelper
from api.models.Price import Price
from api.models.Reservation import Reservation


class ReservationHelper:
    @staticmethod
    def add_price_calculation(data, reservation, guests, suite, settings, extra=False):
        price = PriceHelper(data=data, guests=guests, suite=suite, settings=settings,
                            discounts=suite.discount_suite_set.all()).calculate()
        if extra:
            accommodation = price.accommodation
            meal = price.meal
            municipality = price.municipality
            total = price.total
        else:
            accommodation = data.price_accommodation if data.price_accommodation is not None else price.accommodation
            meal = data.price_meal if data.price_meal is not None else price.meal
            municipality = data.price_municipality if data.price_municipality is not None else price.municipality
            total = data.price_total if data.price_total is not None else price.total
        try:
            model = Price(accommodation=accommodation, days=data.number_days, meal=meal, municipality=municipality,
                          reservation=reservation, suite=suite, total=total)
            model.full_clean()
            model.save()
        except ValidationError:
            pass

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
