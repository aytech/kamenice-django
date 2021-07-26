from django.core.exceptions import ObjectDoesNotExist
from graphene import ObjectType, List, Field, Int, resolve_only_args, Mutation, String, InputObjectType, ID
from graphene_django import DjangoObjectType

from api.models.Guest import Guest as GuestModel
from api.models.Reservation import Reservation as ReservationModel
from api.models.Suite import Suite as SuiteModel
from api.schemas.Guest import Guest
from api.schemas.Reservation import Reservation


class Suite(DjangoObjectType):
    class Meta:
        model = SuiteModel
        fields = '__all__'


class SuitesWithReservations(ObjectType):
    guests = List(Guest)
    suites = List(Suite)
    reservations = List(Reservation)


class SuitesQuery(ObjectType):
    suites = List(Suite)
    suite = Field(Suite, suite_id=Int())
    suites_with_reservations = Field(SuitesWithReservations)

    @resolve_only_args
    def resolve_suites(self):
        return SuiteModel.objects.filter(deleted=False)

    @resolve_only_args
    def resolve_suite(self, suite_id):
        try:
            return SuiteModel.objects.get(pk=suite_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @resolve_only_args
    def resolve_suites_with_reservations(self):
        return SuitesWithReservations(
            guests=GuestModel.objects.filter(deleted=False),
            suites=SuiteModel.objects.filter(deleted=False),
            reservations=ReservationModel.objects.filter(deleted=False)
        )


class SuiteInput(InputObjectType):
    id = ID()
    number = Int()
    title = String()


class CreateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @staticmethod
    def mutate(_root, _info, data=None):
        instance = SuiteModel(
            title=data.title,
            number=data.number,
        )
        instance.full_clean()
        instance.save()
        return CreateSuite(suite=instance)


class UpdateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @staticmethod
    def mutate(_root, _info, data=None):
        try:
            instance = SuiteModel.objects.get(pk=data.id)
            if instance:
                instance.title = data.title if data.title is not None else instance.title
                instance.number = data.number if data.number is not None else instance.number
                instance.full_clean()
                instance.save()
            return UpdateSuite(suite=instance)
        except ObjectDoesNotExist:
            return UpdateSuite(suite=None)


class DeleteSuite(Mutation):
    class Arguments:
        suite_id = ID()

    suite = Field(Suite)

    @staticmethod
    def mutate(_root, _info, suite_id):
        try:
            instance = SuiteModel.objects.get(pk=suite_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteSuite(suite=instance)
        except ObjectDoesNotExist:
            return DeleteSuite(suite=None)
