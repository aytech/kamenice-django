from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from graphene_django.utils import GraphQLTestCase
from graphql_jwt.testcases import JSONWebTokenTestCase

from api.models.Settings import Settings


class SettingsTestCase(JSONWebTokenTestCase, GraphQLTestCase):
    GRAPHQL_URL = '/api'

    def setUp(self):
        user = get_user_model().objects.create(username="test")
        user.user_permissions.add(Permission.objects.get(codename='change_settings'))
        self.client.authenticate(user)

    def test_get_settings(self):
        query_string = '''
            query Settings {
                settings {
                    discountSettingsSet {
                        type
                        value
                    }
                    municipalityFee,
                    priceBreakfast,
                    priceHalfboard,
                    userColor,
                    userName
                }
            }
        '''
        Settings.objects.create(
            municipality_fee=21,
            price_breakfast=80,
            price_halfboard=200,
            user_color='#f5222d',  # red
            user_name='Test User',
            username='test'
        )
        content = self.client.execute(query_string)

        self.assertListEqual([], content.data['settings']['discountSettingsSet'])
        self.assertEquals(content.data['settings']['municipalityFee'], '21.00')
        self.assertEquals(content.data['settings']['priceBreakfast'], '80.00')
        self.assertEquals(content.data['settings']['priceHalfboard'], '200.00')
        self.assertEquals(content.data['settings']['userColor'], '#f5222d')
        self.assertEquals(content.data['settings']['userName'], 'Test User')

    def test_update_settings(self):
        settings = Settings.objects.create(
            municipality_fee=21,
            price_breakfast=80,
            price_halfboard=200,
            user_color='#f5222d',  # red
            user_name='Test User',
            username='test'
        )
        query_string = '''
            mutation UpdateSettings($data: SettingsInput!) {
                updateSettings(data: $data) {
                    settings {
                        discountSettingsSet {
                            type
                            value
                        }
                        id
                        municipalityFee
                        priceBreakfast
                        priceHalfboard
                        userAvatar
                        userColor
                        userName
                    }
                }
            }
        '''
        variables = {
            'data': {
                'id': settings.id,
                'municipalityFee': '22.00',
                'priceBreakfast': '100.00',
                'priceHalfboard': '250.00',
                'userAvatar': '/some/path',
                'userColor': '#fa541c',
                'userName': 'Test User Updated',
            }
        }
        response = self.client.execute(query_string, variables)

        self.assertEquals(response.data['updateSettings']['settings']['municipalityFee'], '22.00')
        self.assertEquals(response.data['updateSettings']['settings']['priceBreakfast'], '100.00')
        self.assertEquals(response.data['updateSettings']['settings']['priceHalfboard'], '250.00')
        self.assertEquals(response.data['updateSettings']['settings']['userAvatar'], '/some/path')
        self.assertEquals(response.data['updateSettings']['settings']['userColor'], '#fa541c')
        self.assertEquals(response.data['updateSettings']['settings']['userName'], 'Test User Updated')
