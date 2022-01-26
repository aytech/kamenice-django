from graphene import ObjectType, Int, InputObjectType, List, String
from graphene_django import DjangoObjectType

from api.models.Price import Price as PriceModel


class Price(DjangoObjectType):
    class Meta:
        fields = ('accommodation', 'meal', 'municipality', 'reservation', 'suite', 'total')
        model = PriceModel


class PriceInput(InputObjectType):
    guests = List(Int, required=True)
    meal = String()
    number_days = Int(required=True)
    suite_id = Int()


class PriceOutput(ObjectType):
    accommodation = String(required=True)
    days = Int(required=True)
    meal = String(required=True)
    municipality = String(required=True)
    total = String(required=True)
