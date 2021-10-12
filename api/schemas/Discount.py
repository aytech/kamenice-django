from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import ObjectType, List, Int, InputObjectType, ID, String, Mutation, Field
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.Discount import Discount as DiscountModel
from api.models.Suite import Suite
from api.schemas.exceptions.PermissionDenied import PermissionDenied


class Discount(DjangoObjectType):
    class Meta:
        model = DiscountModel
        fields = ('id', 'suite', 'type', 'value',)


class DiscountOption(ObjectType):
    name = String(required=True)
    value = String(required=True)


class DiscountQuery(ObjectType):
    discount_types = List(DiscountOption)
    discounts = List(Discount, suite_id=Int())

    @user_passes_test(lambda user: user.has_perm('api.view_suite'), exc=PermissionDenied)
    def resolve_discount_types(self, _info):
        return map(lambda choice: DiscountOption(name=choice[0], value=choice[1]), DiscountModel.DISCOUNT_CHOICES)

    @user_passes_test(lambda user: user.has_perm('api.view_suite'), exc=PermissionDenied)
    def resolve_discounts(self, _info, suite_id):
        return DiscountModel.objects.filter(deleted=False, suite=suite_id)


class DiscountInput(InputObjectType):
    suite_id = Int()
    type = String()
    value = Int()


class DiscountInputUpdate(DiscountInput):
    id = ID()


class CreateDiscount(Mutation):
    class Arguments:
        data = DiscountInput(required=True)

    discount = Field(Discount)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            suite = Suite.objects.get(pk=data.suite_id)
            instance = DiscountModel(
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

    discount = Field(Discount)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = DiscountModel.objects.get(pk=data.id)
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

    discount = Field(Discount)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.delete_suite'), exc=PermissionDenied)
    def mutate(cls, _root, _info, discount_id):
        try:
            instance = DiscountModel.objects.get(pk=discount_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteDiscount(discount=instance)
        except ObjectDoesNotExist:
            return DeleteDiscount(discount=None)
