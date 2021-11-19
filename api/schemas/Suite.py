from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import ObjectType, List, Field, Int, Mutation, String, InputObjectType, ID, Decimal
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _

from api.models.DiscountSuite import DiscountSuite as DiscountSuiteModel
from api.models.Suite import Suite as SuiteModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied


class Suite(DjangoObjectType):
    class Meta:
        model = SuiteModel
        fields = ('discount_suite_set', 'id', 'number', 'number_beds', 'number_beds_extra', 'price_base', 'title',)


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


class SuiteDiscountInput(InputObjectType):
    type = String(required=True)
    value = Int(required=True)


class SuiteInput(InputObjectType):
    discounts = List(SuiteDiscountInput)
    id = ID()
    number = Int()
    number_beds = Int()
    number_beds_extra = Int()
    price_base = String()
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
            number_beds_extra=data.number_beds_extra,
            price_base=data.price_base,
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
                price_base = 0
                try:  # handle empty and invalid values
                    price_base = int(data.price_base)
                except (TypeError, ValueError):
                    pass
                instance.number = data.number if data.number is not None else instance.number
                instance.number_beds = data.number_beds if data.number_beds is not None else instance.number_beds
                instance.number_beds_extra = data.number_beds_extra if data.number_beds_extra is not None else \
                    instance.number_beds_extra
                instance.price_base = price_base if data.price_base is not None else instance.price_base
                instance.title = data.title if data.title is not None else instance.title

                # Recreate discounts
                instance.discount_suite_set.all().delete()
                added_discounts = []
                for discount in data.discounts:
                    # Suite cannot have duplicate discounts
                    if discount.type in added_discounts:
                        raise Exception(_('Discount %(type)s is already applied') % {
                            'type': DiscountSuiteModel.get_discount_choice(choice=discount.type)})
                    added_discounts.append(discount.type)
                    new_discount = DiscountSuiteModel(
                        suite=instance,
                        type=discount.type,
                        value=discount.value
                    )
                    try:
                        new_discount.full_clean()
                        new_discount.save()
                    except ValidationError as error:
                        raise Exception(error.messages[0])

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

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
