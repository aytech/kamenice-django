from django.core.exceptions import ObjectDoesNotExist
from graphene import ObjectType, List, Field, Int, resolve_only_args, Mutation, String, InputObjectType, ID
from graphene_django import DjangoObjectType
from api.models.Suite import Suite as SuiteModel


class Suite(DjangoObjectType):
    class Meta:
        model = SuiteModel
        fields = '__all__'


class SuitesQuery(ObjectType):
    suites = List(Suite)
    suite = Field(Suite, suite_id=Int())

    @classmethod
    def resolve_suites(cls, _query, info):
        if info.context.user.is_authenticated:
            return SuiteModel.objects.filter(deleted=False)
        raise Exception('Unauthorized')

    @classmethod
    def resolve_suite(cls, _query, info, suite_id):
        if info.context.user.is_authenticated:
            try:
                return SuiteModel.objects.get(pk=suite_id, deleted=False)
            except ObjectDoesNotExist:
                return None
        raise Exception('Unauthorized')


class SuiteInput(InputObjectType):
    id = ID()
    number = Int()
    title = String()


class CreateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @staticmethod
    def mutate(_root, info, data=None):
        if info.context.user.is_authenticated:
            instance = SuiteModel(
                title=data.title,
                number=data.number,
            )
            instance.full_clean()
            instance.save()
            return CreateSuite(suite=instance)
        raise Exception('Unauthorized')


class UpdateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @staticmethod
    def mutate(_root, info, data=None):
        if info.context.user.is_authenticated:
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
        raise Exception('Unauthorized')


class DeleteSuite(Mutation):
    class Arguments:
        suite_id = ID()

    suite = Field(Suite)

    @staticmethod
    def mutate(_root, info, suite_id):
        if info.context.user.is_authenticated:
            try:
                instance = SuiteModel.objects.get(pk=suite_id)
                if instance:
                    instance.deleted = True
                    instance.save()
                return DeleteSuite(suite=instance)
            except ObjectDoesNotExist:
                return DeleteSuite(suite=None)
        raise Exception('Unauthorized')
