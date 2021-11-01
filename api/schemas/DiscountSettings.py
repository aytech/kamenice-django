from graphene import ObjectType, List, Int, String
from graphene_django import DjangoObjectType

from api.models.DiscountSettings import DiscountSettings as DiscountSettingsModel


class DiscountSettings(DjangoObjectType):
    class Meta:
        model = DiscountSettingsModel
        fields = ('id', 'settings', 'type', 'value',)


class DiscountSettingsOption(ObjectType):
    label = String(required=True)
    value = String(required=True)


class DiscountSettingsQuery(ObjectType):
    discount_settings_types = List(DiscountSettingsOption)
    discounts_settings = List(DiscountSettings, settings_id=Int())

    @classmethod
    def resolve_discount_settings_types(cls, _root, _info):
        return map(lambda choice: DiscountSettingsOption(label=choice[1], value=choice[0]),
                   DiscountSettingsModel.DISCOUNT_CHOICES)

    @classmethod
    def resolve_discounts(cls, _root, _info, suite_id):
        return DiscountSettingsModel.objects.filter(deleted=False, settings_id=suite_id)
