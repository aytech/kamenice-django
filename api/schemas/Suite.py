from django.core.exceptions import ObjectDoesNotExist
from graphene import ObjectType, List, Field, Int, Mutation, String, InputObjectType, ID
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.Suite import Suite as SuiteModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.exceptions.Unauthorized import Unauthorized


class Suite(DjangoObjectType):
    class Meta:
        model = SuiteModel
        fields = ('id', 'number', 'title',)


class SuitesQuery(ObjectType):
    suites = List(Suite)
    suite = Field(Suite, suite_id=Int())

    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    @user_passes_test(lambda user: user.has_perm('view_suite'), exc=PermissionDenied)
    def resolve_suites(self, _info):
        return SuiteModel.objects.filter(deleted=False)

    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def resolve_suite(self, _info, suite_id):
        try:
            return SuiteModel.objects.get(pk=suite_id, deleted=False)
        except ObjectDoesNotExist:
            return None


class SuiteInput(InputObjectType):
    id = ID()
    number = Int()
    title = String()


class CreateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def mutate(cls, _root, _info, data=None):
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

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def mutate(cls, _root, _info, data=None):
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

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def mutate(cls, _root, _info, suite_id):
        try:
            instance = SuiteModel.objects.get(pk=suite_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteSuite(suite=instance)
        except ObjectDoesNotExist:
            return DeleteSuite(suite=None)
