from decimal import Decimal, getcontext
from math import floor

from api.constants import DISCOUNT_CHOICE_EXTRA_BED, AGE_CHOICE_ADULT, AGE_CHOICE_CHILD, DISCOUNT_CHOICE_THREE_NIGHTS, \
    DISCOUNT_CHOICE_CHILD, MEAL_CHOICE_BREAKFAST, MEAL_CHOICE_HALFBOARD, AGE_CHOICE_YOUNG, \
    DISCOUNT_CHOICE_THIRD_FOURTH_BED, DISCOUNT_CHOICE_FIFTH_MORE_BED
from api.models.Guest import Guest
from api.models.Settings import Settings
from api.models.Suite import Suite


class PriceHelper:
    GUESTS_BASE_NUMBER = 2

    def __init__(self, data):
        # model data
        self.accommodation = 0
        self.meal = 0
        self.municipality = 0
        self.total = 0

        self.days = data.number_days
        self.meal_option = data.meal

        self.guests = Guest.objects.filter(pk__in=data.guests)
        self.suite = Suite.objects.get(pk=data.suite_id)
        self.settings = Settings.objects.get(pk=data.settings_id)
        self.discounts = self.suite.discount_suite_set.all()

    def calculate(self, model):
        # Order is important, first calculate base price
        self.calculate_accommodation()
        # Calculate price for three or more nights, if applicable.
        # This should be calculated before price for children, as
        # children have already a discounted rate. Only exception
        # is when adults + children do not use extra beds, see method
        self.discount_three_nights()
        # Calculate price for 3rd, 4th and 5th bed, if applicable. If not,
        # calculate price for extra bed(s), if applicable. This
        # should be calculated after three night discount, as extra
        # beds will calculate their own discount
        self.calculate_beds_discounts()
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

    def get_settings_discount(self, discount_type):
        for discount in self.settings.discount_settings_set.all():
            if discount.type == discount_type:
                return discount
        return None

    def calculate_accommodation(self):
        self.accommodation = self.suite.price_base * self.days

    def calculate_extra_beds(self, number_guests):
        # Extra bed can have discount percentage from base price
        extra_bed_price = self.suite.price_base * self.days
        discount = self.get_suite_discount(DISCOUNT_CHOICE_EXTRA_BED)
        if discount is not None and number_guests > 0:
            extra_bed_price -= (extra_bed_price / 100) * discount.value
            self.accommodation += (extra_bed_price * number_guests)
        if discount is None and number_guests > 0:
            self.accommodation += (extra_bed_price / self.GUESTS_BASE_NUMBER) * number_guests

    def calculate_third_fourth_discount(self):
        bed_price = self.suite.price_base
        discount = self.get_suite_discount(DISCOUNT_CHOICE_THIRD_FOURTH_BED)
        if discount is not None:
            bed_price -= (bed_price / 100) * discount.value
        self.accommodation += floor(bed_price) * self.days

    def calculate_beds_discounts(self):
        bed_price = self.suite.price_base * self.days
        third_fourth_discount = self.get_suite_discount(DISCOUNT_CHOICE_THIRD_FOURTH_BED)
        fifth_discount = self.get_suite_discount(DISCOUNT_CHOICE_FIFTH_MORE_BED)
        number_guests = len(self.get_adults() + self.get_young())
        additional_beds_number = number_guests
        if third_fourth_discount is not None:
            if number_guests > 2:
                self.calculate_third_fourth_discount()
                additional_beds_number -= 1
            if number_guests > 3:
                self.calculate_third_fourth_discount()
                additional_beds_number -= 1
        if fifth_discount is not None:
            if number_guests > 4:
                price_per_guest = bed_price - ((bed_price / 100) * fifth_discount.value)
                self.accommodation += price_per_guest * (number_guests - 4)
                # Do not calculate extra beds for the rest of the guests
                additional_beds_number = 0
        self.calculate_extra_beds(additional_beds_number - self.GUESTS_BASE_NUMBER)

    def discount_three_nights(self):
        discount = self.get_suite_discount(DISCOUNT_CHOICE_THREE_NIGHTS)
        if discount is not None and self.days > 2:
            self.accommodation -= (self.accommodation / 100) * discount.value

    def calculate_child_price(self):
        # Add price for child only if the child exceeds the capacity, i.e.
        # when the room is occupied by adults and child is on extra bed.
        number_adults = len(self.get_adults() + self.get_young())
        number_children = len(self.get_children())
        # Process if children are found and number of children is greater than room base
        # calculation number (otherwise the child is calculated as part of the room price)
        if number_children > 0 and (number_adults + number_children) > self.GUESTS_BASE_NUMBER:
            price_child = self.suite.price_base * self.days
            discount = self.get_suite_discount(DISCOUNT_CHOICE_CHILD)
            if discount is not None:
                price_child -= (price_child / 100) * discount.value
            self.accommodation += price_child * number_children

    def calculate_municipality_fee(self):
        # Municipality fee is paid only for 18+ guests
        # todo: pull municipality fee from user settings
        self.municipality = (self.settings.municipality_fee * self.days) * len(self.get_adults())

    def calculate_meal(self):
        meal_price = 0
        meal_price_child = 0

        if self.meal_option == MEAL_CHOICE_BREAKFAST:
            meal_price = self.settings.price_breakfast
            meal_price_child = self.settings.price_breakfast_child
        elif self.meal_option == MEAL_CHOICE_HALFBOARD:
            meal_price = self.settings.price_halfboard
            meal_price_child = self.settings.price_halfboard_child

        if meal_price > 0:
            meal_adults = floor((meal_price * self.days) * len(self.get_adults()))
            meal_young = floor((meal_price * self.days) * len(self.get_young()))
            meal_children = floor((meal_price_child * self.days) * len(self.get_children()))
            self.meal = meal_adults + meal_young + meal_children

    def calculate_total(self):
        self.total = floor(self.accommodation) + floor(self.meal) + floor(self.municipality)

    def get_adults(self):
        return list(
            filter(
                lambda guest: guest.age == AGE_CHOICE_ADULT or guest.age is None, self.guests
            )
        )

    def get_young(self):
        return list(
            filter(
                lambda guest: guest.age == AGE_CHOICE_YOUNG, self.guests
            )
        )

    def get_children(self):
        return list(
            filter(
                lambda guest: guest.age == AGE_CHOICE_CHILD, self.guests
            )
        )
