from graphene_django import DjangoObjectType
from api.models.Roommate import Roommate as RoommateModel


class Roommate(DjangoObjectType):
    class Meta:
        model = RoommateModel
        fields = ('entity', 'from_date', 'to_date')
