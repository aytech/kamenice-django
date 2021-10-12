from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import ObjectType, List, Field, Int, Mutation, String, InputObjectType, ID, Decimal
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.Suite import Suite as SuiteModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.exceptions.Unauthorized import Unauthorized


class Suite(DjangoObjectType):
    class Meta:
        model = SuiteModel
        fields = ('discount_set', 'id', 'number', 'number_beds', 'price_base', 'title',)


class SuitesQuery(ObjectType):
    suites = List(Suite)
    suite = Field(Suite, suite_id=Int())

    @user_passes_test(lambda user: user.has_perm('api.view_suite'), exc=PermissionDenied)
    def resolve_suites(self, _info):
        return SuiteModel.objects.filter(deleted=False)

    @user_passes_test(lambda user: user.has_perm('api.view_suite'), exc=PermissionDenied)
    def resolve_suite(self, _info, suite_id):
        try:
            return SuiteModel.objects.get(pk=suite_id, deleted=False)
        except ObjectDoesNotExist:
            return None


class SuiteInput(InputObjectType):
    id = ID()
    number = Int()
    number_beds = Int()
    price_base = Decimal()
    title = String()


class CreateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        instance = SuiteModel(
            number=data.number,
            number_beds=data.number_beds,
            price_base=data.price_base,
            price_child=data.price_child,
            price_extra=data.price_extra,
            price_infant=data.price_infant,
            title=data.title,
        )

        try:
            instance.full_clean()
        except ValidationError as errors:
            raise Exception(errors.messages[0])

        instance.save()

        return CreateSuite(suite=instance)


class UpdateSuite(Mutation):
    class Arguments:
        data = SuiteInput(required=True)

    suite = Field(Suite)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = SuiteModel.objects.get(pk=data.id)
            if instance:
                instance.number = data.number if data.number is not None else instance.number
                instance.number_beds = data.number_beds if data.number_beds is not None else instance.number_beds
                instance.price_base = data.price_base if data.price_base is not None else instance.price_base
                instance.price_child = data.price_child if data.price_child is not None else instance.price_child
                instance.price_extra = data.price_extra if data.price_extra is not None else instance.price_extra
                instance.price_infant = data.price_infant if data.price_infant is not None else instance.price_infant
                instance.title = data.title if data.title is not None else instance.title
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
    @user_passes_test(lambda user: user.has_perm('api.delete_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, suite_id):
        try:
            instance = SuiteModel.objects.get(pk=suite_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteSuite(suite=instance)
        except ObjectDoesNotExist:
            return DeleteSuite(suite=None)
