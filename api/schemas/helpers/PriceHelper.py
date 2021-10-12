from api.constants import DISCOUNT_CHOICE_EXTRA_BED, AGE_CHOICE_ADULT
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

        self.guests = Guest.objects.filter(pk__in=data.guests)
        self.suite = Suite.objects.get(pk=data.suite_id)

    def calculate(self, model):
        self.calculate_accommodation()
        self.calculate_discount_prices()
        return model(
            accommodation=self.accommodation,
            meal=self.meal,
            municipality=self.municipality,
            total=self.total
        )

    def calculate_accommodation(self):
        self.accommodation = self.suite.price_base * self.days

    def calculate_discount_prices(self):
        for discount in self.suite.discount_set.all():
            if discount.type == DISCOUNT_CHOICE_EXTRA_BED:
                self.calculate_extra_beds()

    def calculate_extra_beds(self):
        adults = self.get_adults()
        # Assume main guest is an adult
        if len(adults) + 1 > self.suite.number_beds:
            bed_price = self.suite.price_base / self.suite.number_beds
            # Extra bed is percentage from the bed price
            extra_bed_price = bed_price - (bed_price / 100 * 40)
            # Multiply extra price by the number of extra guests and days of stay
            extra_total = (extra_bed_price * (len(adults) - self.suite.number_beds)) * self.days
            # Add extra bed price to the accommodation total
            self.accommodation += extra_total

    def get_adults(self):
        return list(
            filter(
                lambda guest: guest.age == AGE_CHOICE_ADULT or guest.age is None, self.guests
            )
        )
