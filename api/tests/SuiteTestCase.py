from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from graphene_django.utils import GraphQLTestCase
from graphql_jwt.testcases import JSONWebTokenTestCase

from api.models.DiscountSuite import DiscountSuite


class SuiteTestCase(JSONWebTokenTestCase, GraphQLTestCase):
    GRAPHQL_URL = '/api'

    def setUp(self):
        user = get_user_model().objects.create(username="test")
        user.user_permissions.add(Permission.objects.get(codename='view_suite'))
        self.client.authenticate(user)

    def test_get_discount_types(self):
        query_string = '''
            query DiscountSuiteTypes {
                discountSuiteTypes {
                    name
                    value
                }
            }
        '''
        content = self.client.execute(query_string)

        self.assertEquals(len(content.data['discountSuiteTypes']), len(DiscountSuite.DISCOUNT_CHOICES))
