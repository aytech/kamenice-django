from graphene import ObjectType, List, Int, InputObjectType, ID, String
from graphene_django import DjangoObjectType

from api.models.Discount import Discount as DiscountModel


class Discount(DjangoObjectType):
    class Meta:
        model = DiscountModel
        fields = ('id', 'suite', 'type', 'value',)


class DiscountQuery(ObjectType):
    discounts = List(Discount, suite_id=Int())

    def resolve_discounts(self, _info, suite_id):
        return DiscountModel.objects.filter(deleted=False, suite=suite_id)


class DiscountInput(InputObjectType):
    id = ID()
    suite = Int()
    type = String()
    value = String()
