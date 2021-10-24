from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import Field, ObjectType, InputObjectType, List, String, Int, ID, Decimal, Mutation
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _

from api.models.Settings import Settings as SettingsModel
from api.models.DiscountSettings import DiscountSettings as DiscountSettingsModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied


class Settings(DjangoObjectType):
    class Meta:
        model = SettingsModel
        fields = (
            'discount_settings_set', 'id', 'municipality_fee', 'price_breakfast', 'price_halfboard', 'user_avatar',
            'user_color', 'user_name',)


class SettingsQuery(ObjectType):
    settings = Field(Settings)

    @classmethod
    def resolve_settings(cls, _root, info):
        try:
            return SettingsModel.objects.get(username=info.context.user.username)
        except ObjectDoesNotExist:
            return None


class SettingsDiscountInput(InputObjectType):
    type = String(required=True)
    value = Int(required=True)


class SettingsInput(InputObjectType):
    discounts = List(SettingsDiscountInput)
    id = ID()
    municipality_fee = Decimal()
    price_breakfast = Decimal()
    price_halfboard = Decimal()
    user_avatar = String()
    user_color = String()
    user_name = String()


class UpdateSettings(Mutation):
    class Arguments:
        data = SettingsInput(required=True)

    settings = Field(Settings)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_settings'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = SettingsModel.objects.get(pk=data.id)
            if instance:
                instance.municipality_fee = data.municipality_fee if data.municipality_fee is not None else \
                    instance.municipality_fee
                instance.price_breakfast = data.price_breakfast if data.price_breakfast is not None else \
                    instance.price_breakfast
                instance.price_halfboard = data.price_halfboard if data.price_halfboard is not None else \
                    instance.price_halfboard
                instance.user_avatar = data.user_avatar if data.user_avatar is not None else instance.user_avatar
                instance.user_color = data.user_color if data.user_color is not None else instance.user_color
                instance.user_name = data.user_name if data.user_name is not None else instance.user_name

                # Recreate discounts
                instance.discount_settings_set.all().delete()
                added_discounts = []

                for discount in data.discounts:
                    # Settings cannot have duplicate discounts
                    if discount.type in added_discounts:
                        raise Exception(_('Discount %(type)s is already applied') % {
                            'type': DiscountSettingsModel.get_discount_choice(choice=discount.type)})
                    added_discounts.append(discount.type)
                    new_discount = DiscountSettingsModel(
                        settings=instance,
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

            return UpdateSettings(settings=instance)
        except ObjectDoesNotExist:
            return UpdateSettings(settings=None)
