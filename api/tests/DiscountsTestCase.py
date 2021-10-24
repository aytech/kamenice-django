from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.testcases import JSONWebTokenTestCase

from api.constants import DISCOUNT_CHOICE_CHILD, DISCOUNT_CHOICE_EXTRA_BED, DISCOUNT_CHOICE_THREE_NIGHTS, \
    MEAL_CHOICE_BREAKFAST, MEAL_PRICE_BREAKFAST, MEAL_PRICE_HALFBOARD, MEAL_CHOICE_HALFBOARD, \
    DISCOUNT_CHOICE_CHILD_BREAKFAST, DISCOUNT_CHOICE_HALFBOARD
from api.models.DiscountSettings import DiscountSettings
from api.models.DiscountSuite import DiscountSuite
from api.models.Guest import Guest
from api.models.Settings import Settings
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
        self.settings = Settings.objects.create(
            municipality_fee=21,
            price_breakfast=80,
            price_halfboard=200,
            username='test'
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
        user = get_user_model().objects.create(username='test')
        user.user_permissions.add(Permission.objects.get(name='Can change reservation'))
        self.client.authenticate(user)

    def test_price_without_discounts(self):
        self.number_days = 2
        variables = {
            'data': {
                'guests': self.guests,
                'numberDays': self.number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        content = self.client.execute(self.query_string, variables)

        # Base price plus 1x base price for extra bed and 1x base price for child
        accommodation_price = (self.price_base * 3) * self.number_days
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_three_nights_discount(self):
        self.number_days = 3
        variables = {
            'data': {
                'guests': self.guests,
                'numberDays': self.number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        DiscountSuite.objects.create(suite=self.suite, type=DISCOUNT_CHOICE_THREE_NIGHTS,
                                     value=self.three_days_discount)
        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        base_price = self.price_base * self.number_days
        base_price_discounted = base_price - ((base_price / 100) * self.three_days_discount)
        # Base price for accommodation + price for extra bed + price for child
        accommodation_price = base_price_discounted + (base_price * 2)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_extra_bed_discount(self):
        self.number_days = 3
        variables = {
            'data': {
                'guests': self.guests,
                'numberDays': self.number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        DiscountSuite.objects.create(suite=self.suite, type=DISCOUNT_CHOICE_EXTRA_BED, value=self.extra_bed_discount)
        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        base_price_total = self.price_base * self.number_days
        price_extra_discounted = base_price_total - ((base_price_total / 100) * self.extra_bed_discount)
        # Base price for accommodation + price for extra bed + price for child
        accommodation_price = (base_price_total * 2) + price_extra_discounted
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_child_discount(self):
        self.number_days = 3
        variables = {
            'data': {
                'guests': self.guests,
                'numberDays': self.number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        DiscountSuite.objects.create(suite=self.suite, type=DISCOUNT_CHOICE_CHILD, value=self.child_discount)

        content = self.client.execute(self.query_string, variables)

        # 2x adults, 1 extra bed, 1 child, times number of days
        base_price_total = self.price_base * self.number_days
        price_child = base_price_total - ((base_price_total / 100) * self.child_discount)
        # Base price for accommodation + price for extra bed + price for child
        accommodation_price = base_price_total + price_child * self.number_days
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], 0)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + municipality_fee)

    def test_price_with_breakfast(self):
        self.number_days = 3
        variables = {
            'data': {
                'guests': self.guests,
                'meal': MEAL_CHOICE_BREAKFAST,
                'numberDays': self.number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        content = self.client.execute(self.query_string, variables)

        # Base price plus 1x base price for extra bed and 1x base price for child
        accommodation_price = (self.price_base * 3) * self.number_days
        meal_price = (MEAL_PRICE_BREAKFAST * self.number_days) * len(self.guests)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], meal_price)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + meal_price + municipality_fee)

    def test_price_with_halfboard(self):
        self.number_days = 3
        variables = {
            'data': {
                'guests': self.guests,
                'meal': MEAL_CHOICE_HALFBOARD,
                'numberDays': self.number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        content = self.client.execute(self.query_string, variables)

        # Base price plus 1x base price for extra bed and 1x base price for child
        accommodation_price = (self.price_base * 3) * self.number_days
        meal_price = (MEAL_PRICE_HALFBOARD * self.number_days) * len(self.guests)
        municipality_fee = 21 * 3 * self.number_days

        self.assertEquals(content.data['price']['accommodation'], accommodation_price)
        self.assertEquals(content.data['price']['meal'], meal_price)
        self.assertEquals(content.data['price']['municipality'], municipality_fee)
        self.assertEquals(content.data['price']['total'], accommodation_price + meal_price + municipality_fee)

    def test_child_breakfast_discount(self):
        number_days = 2
        discount_value = 40
        DiscountSettings.objects.create(
            settings=self.settings,
            type=DISCOUNT_CHOICE_CHILD_BREAKFAST,
            value=discount_value
        )
        variables = {
            'data': {
                'guests': self.guests,
                'meal': MEAL_CHOICE_BREAKFAST,
                'numberDays': number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        content = self.client.execute(self.query_string, variables)

        meal_price_adults = (self.settings.price_breakfast * 3) * number_days
        meal_price_child = (self.settings.price_breakfast - (
                (self.settings.price_breakfast / 100) * discount_value)) * number_days

        self.assertEquals(content.data['price']['meal'], meal_price_adults + meal_price_child)

    def test_child_halfboard_discount(self):
        number_days = 2
        discount_value = 40
        DiscountSettings.objects.create(
            settings=self.settings,
            type=DISCOUNT_CHOICE_HALFBOARD,
            value=discount_value
        )
        variables = {
            'data': {
                'guests': self.guests,
                'meal': MEAL_CHOICE_HALFBOARD,
                'numberDays': number_days,
                'settingsId': self.settings.id,
                'suiteId': self.suite.id
            }
        }
        content = self.client.execute(self.query_string, variables)

        meal_price_adults = (self.settings.price_halfboard * 3) * number_days
        meal_price_child = (self.settings.price_halfboard - (
                (self.settings.price_halfboard / 100) * discount_value)) * number_days

        self.assertEquals(content.data['price']['meal'], meal_price_adults + meal_price_child)
