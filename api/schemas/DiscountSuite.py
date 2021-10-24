from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import ObjectType, List, Int, InputObjectType, ID, String, Mutation, Field
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.DiscountSuite import DiscountSuite as DiscountSuiteModel
from api.models.Suite import Suite
from api.schemas.exceptions.PermissionDenied import PermissionDenied


class DiscountSuite(DjangoObjectType):
    class Meta:
        model = DiscountSuiteModel
        fields = ('id', 'suite', 'type', 'value',)


class DiscountSuiteOption(ObjectType):
    name = String(required=True)
    value = String(required=True)


class DiscountSuiteQuery(ObjectType):
    discount_suite_types = List(DiscountSuiteOption)
    discounts_suite = List(DiscountSuite, suite_id=Int())

    @user_passes_test(lambda user: user.has_perm('api.view_suite'), exc=PermissionDenied)
    def resolve_discount_suite_types(self, _info):
        return map(lambda choice: DiscountSuiteOption(name=choice[0], value=choice[1]),
                   DiscountSuiteModel.DISCOUNT_CHOICES)

    @user_passes_test(lambda user: user.has_perm('api.view_suite'), exc=PermissionDenied)
    def resolve_discounts(self, _info, suite_id):
        return DiscountSuiteModel.objects.filter(deleted=False, suite=suite_id)


class DiscountSuiteInput(InputObjectType):
    suite_id = Int()
    type = String()
    value = Int()


class DiscountInputUpdate(DiscountSuiteInput):
    id = ID()


class CreateDiscount(Mutation):
    class Arguments:
        data = DiscountSuiteInput(required=True)

    discount = Field(DiscountSuite)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            suite = Suite.objects.get(pk=data.suite_id)
            instance = DiscountSuiteModel(
                suite=suite,
                type=data.type,
                value=data.value
            )

            try:
                instance.full_clean()
            except ValidationError as errors:
                raise Exception(errors.messages[0])

            instance.save()

            return CreateDiscount(discount=instance)

        except ObjectDoesNotExist:
            return CreateDiscount(discount=None)


class UpdateDiscount(Mutation):
    class Arguments:
        data = DiscountInputUpdate(required=True)

    discount = Field(DiscountSuite)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = DiscountSuiteModel.objects.get(pk=data.id)
            if instance:
                instance.type = data.type if data.type is not None else instance.type
                instance.value = data.value if data.value is not None else instance.value

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                instance.save()

                return UpdateDiscount(discount=instance)
            return UpdateDiscount(discount=None)
        except ObjectDoesNotExist:
            return UpdateDiscount(discount=None)


class DeleteDiscount(Mutation):
    class Arguments:
        discount_id = ID()

    discount = Field(DiscountSuite)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.delete_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, discount_id):
        try:
            instance = DiscountSuiteModel.objects.get(pk=discount_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteDiscount(discount=instance)
        except ObjectDoesNotExist:
            return DeleteDiscount(discount=None)
