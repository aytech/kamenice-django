from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.testcases import JSONWebTokenTestCase

from api.constants import DISCOUNT_CHOICE_THREE_NIGHTS, DISCOUNT_CHOICE_EXTRA_BED, DISCOUNT_CHOICE_CHILD
from api.models.Discount import Discount
from api.models.Guest import Guest
from api.models.Suite import Suite


# Tests are not run in order, only test for specific
# discount on each run
class DiscountsTestCase(JSONWebTokenTestCase, GraphQLTestCase):
    GRAPHQL_URL = '/api'

    def setUp(self):
        self.price_base = 1400
        self.three_days_discount = 12
        self.extra_bed_discount = 40
        self.child_discount = 50
        self.number_days = 2
        self.guests = [
            Guest.objects.create(name='Adult 1', surname='Surname', age='ADULT').id,
            Guest.objects.create(name='Adult 2', surname='Surname', age='ADULT').id,
            Guest.objects.create(name='Adult 3', surname='Surname', age='ADULT').id,
            Guest.objects.create(name='Child 1', surname='Surname', age='CHILD').id,
        ]
        self.suite = Suite.objects.create(
            number=1,
            number_beds=2,
            number_beds_extra=2,
            price_base=self.price_base,
            title='Test suite',
        )
        self.query_string = '''
            query CalculateReservationPrice($data: PriceInput!) {
                price(data: $data) {
                    accommodation
                    meal
                    municipality
                    total
                }
            }
        '''
        user = get_user_model().objects.create(username="test")
        user.user_permissions.add(Permission.objects.get(name='Can change reservation'))
        self.client.authenticate(user)

    def test_price_without_discounts(self):
        variables = {'data': {'suiteId': self.suite.id, 'numberDays': self.number_days, 'guests': self.guests}}
        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        accommodation_price = (self.price_base * self.number_days) + (self.price_base / 2 * self.number_days) + (
                self.price_base / 2 * self.number_days)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_three_nights_discount(self):
        self.number_days = 3
        variables = {'data': {'suiteId': self.suite.id, 'numberDays': self.number_days, 'guests': self.guests}}
        Discount.objects.create(suite=self.suite, type=DISCOUNT_CHOICE_THREE_NIGHTS, value=self.three_days_discount)
        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        base_price_total = self.price_base * self.number_days
        # Base price for accommodation + price for extra bed + price for child
        accommodation_price = (base_price_total - ((base_price_total / 100) * self.three_days_discount)) + (
                self.price_base / 2 * self.number_days) + (self.price_base / 2 * self.number_days)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_extra_bed_discount(self):
        self.number_days = 3
        variables = {'data': {'suiteId': self.suite.id, 'numberDays': self.number_days, 'guests': self.guests}}
        Discount.objects.create(suite=self.suite, type=DISCOUNT_CHOICE_EXTRA_BED, value=self.extra_bed_discount)
        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        base_price_total = self.price_base * self.number_days
        price_extra_discounted = (self.price_base - ((self.price_base / 100) * self.extra_bed_discount)) / 2
        # Base price for accommodation + price for extra bed + price for child
        accommodation_price = base_price_total + (price_extra_discounted * self.number_days) + (
                self.price_base / 2 * self.number_days)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_child_discount(self):
        self.number_days = 3
        variables = {'data': {'suiteId': self.suite.id, 'numberDays': self.number_days, 'guests': self.guests}}
        Discount.objects.create(suite=self.suite, type=DISCOUNT_CHOICE_CHILD, value=self.child_discount)

        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        base_price_total = self.price_base * self.number_days
        price_child = (self.price_base - ((self.price_base / 100) * self.child_discount)) / 2
        # Base price for accommodation + price for extra bed + price for child
        accommodation_price = base_price_total + (price_child * self.number_days) + (
                self.price_base / 2 * self.number_days)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)
