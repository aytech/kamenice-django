from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import Field, ObjectType, InputObjectType, String, ID, Decimal, Mutation
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.Settings import Settings as SettingsModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.helpers.FormHelper import FormHelper


class Settings(DjangoObjectType):
    class Meta:
        model = SettingsModel
        fields = (
            'id', 'municipality_fee', 'price_breakfast', 'price_breakfast_child',
            'price_halfboard', 'price_halfboard_child', 'user_avatar', 'user_color', 'user_name',)


class SettingsQuery(ObjectType):
    settings = Field(Settings)

    @classmethod
    def resolve_settings(cls, _root, info):
        if info.context.user.is_anonymous is True:
            return None
        try:
            return SettingsModel.objects.get(username=info.context.user.username)
        except ObjectDoesNotExist:
            return None


class SettingsInput(InputObjectType):
    id = ID()
    municipality_fee = String()
    price_breakfast = String()
    price_breakfast_child = String()
    price_halfboard = String()
    price_halfboard_child = String()
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
                instance.municipality_fee = FormHelper.get_value(data.municipality_fee, 0.00)
                instance.price_breakfast = FormHelper.get_value(data.price_breakfast, 0.00)
                instance.price_breakfast_child = FormHelper.get_value(data.price_breakfast_child, 0.00)
                instance.price_halfboard = FormHelper.get_value(data.price_halfboard, 0.00)
                instance.price_halfboard_child = FormHelper.get_value(data.price_halfboard_child, 0.00)
                instance.user_avatar = FormHelper.get_value(data.user_avatar, instance.user_avatar)
                instance.user_color = FormHelper.get_value(data.user_color, instance.user_color)
                instance.user_name = FormHelper.get_value(data.user_name, instance.user_name)

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                instance.save()

            return UpdateSettings(settings=instance)
        except ObjectDoesNotExist:
            return UpdateSettings(settings=None)
