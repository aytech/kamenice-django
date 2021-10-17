from math import floor

from api.constants import DISCOUNT_CHOICE_EXTRA_BED, AGE_CHOICE_ADULT, AGE_CHOICE_CHILD, DISCOUNT_CHOICE_THREE_NIGHTS, \
    DISCOUNT_CHOICE_CHILD, MEAL_CHOICE_BREAKFAST, MEAL_CHOICE_HALFBOARD
from api.models.Guest import Guest
from api.models.Suite import Suite


class PriceHelper:

    def __init__(self, data):
        # model data
        self.accommodation = 0
        self.meal = 0
        self.municipality = 0
        self.total = 0

        self.days = data.number_days
        self.meal = data.meal

        self.guests = Guest.objects.filter(pk__in=data.guests)
        self.suite = Suite.objects.get(pk=data.suite_id)
        self.discounts = self.suite.discount_set.all()

    def calculate(self, model):
        # Order is important, first calculate base price
        self.calculate_accommodation()
        # Calculate price for three or more nights, if applicable.
        # This should be calculated before price for children, as
        # children have already a discounted rate. Only exception
        # is when adults + children do not use extra beds, see method
        self.discount_three_nights()
        # Calculate price for extra bed(s), if applicable. This
        # should be calculated after three night discount, as extra
        # beds are already at the discounted rate
        self.calculate_extra_beds()
        # Calculate price for children, if applicable
        self.calculate_child_price()
        # Next 2 should be calculated before total
        self.calculate_meal()
        self.calculate_municipality_fee()
        # Final step
        self.calculate_total()

        return model(
            accommodation=self.accommodation,
            meal=self.meal,
            municipality=self.municipality,
            total=self.total
        )

    def get_suite_discount(self, discount_type):
        for discount in self.discounts:
            if discount.type == discount_type:
                return discount
        return None

    def calculate_accommodation(self):
        self.accommodation = self.suite.price_base * self.days

    def calculate_extra_beds(self):
        suite_discount = self.get_suite_discount(DISCOUNT_CHOICE_EXTRA_BED)
        if suite_discount is not None:
            adults = self.get_adults()
            # 1. Assume main guest is an adult
            # 2. Calculate extra only when number of guests
            # (including main guest) exceeds base number of beds
            if len(adults) + 1 > self.suite.number_beds:
                bed_price = self.suite.price_base / self.suite.number_beds
                # Extra bed is percentage from the bed price
                extra_bed_price = bed_price - (bed_price / 100 * suite_discount.value)
                # Multiply extra price by the number of extra guests and days of stay
                extra_total = (extra_bed_price * (len(adults) - self.suite.number_beds)) * self.days
                # Add extra bed price to the accommodation total
                self.accommodation += extra_total

    def discount_three_nights(self):
        discount = self.get_suite_discount(DISCOUNT_CHOICE_THREE_NIGHTS)
        if discount is not None:
            self.accommodation -= (self.accommodation / 100 * discount.value)

    def calculate_child_price(self):
        discount = self.get_suite_discount(DISCOUNT_CHOICE_CHILD)
        if discount is not None:
            # Add price for child only if the child exceeds the capacity, i.e.
            # when the room is occupied by adults and child is on extra bed.
            # todo: recalculate the room price when child is within capacity:
            #   - 1x adult + 1 child is 2 beds room
            #   - 2x adults + 1 child in 4 beds room
            #   - 2x adults + 2x children in 4 beds room
            children = self.get_children()
            if len(self.get_adults()) + len(children) > self.suite.number_beds:
                price_adult = self.suite.price_base / self.suite.number_beds
                for _child in children:
                    price = price_adult - ((price_adult / 100) * discount.value)
                    self.accommodation += price * self.days

    def calculate_municipality_fee(self):
        # todo: pull municipality fee from user settings
        self.municipality = (21 * self.days) * len(self.get_adults())

    def calculate_meal(self):
        meal_price = 0

        if self.meal == MEAL_CHOICE_BREAKFAST:
            meal_price = 80  # todo: pull from user settings
        elif self.meal == MEAL_CHOICE_HALFBOARD:
            meal_price = 200  # todo: pull from user settings

        if meal_price > 0:
            self.meal = floor((meal_price * self.days) * len(self.get_adults()))
            children = self.get_children()
            if len(children) > 0:
                discount = 40  # todo: pull from user settings
                self.meal += floor(((meal_price - ((meal_price / 100) * discount)) * self.days) * len(children))

    def calculate_total(self):
        self.total = self.accommodation + self.meal + self.municipality

    def get_adults(self):
        return list(
            filter(
                lambda guest: guest.age == AGE_CHOICE_ADULT or guest.age is None, self.guests
            )
        )

    def get_children(self):
        return list(
            filter(
                lambda guest: guest.age == AGE_CHOICE_CHILD, self.guests
            )
        )
