from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import Field, ObjectType, InputObjectType, String, ID, Decimal, Mutation
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.Settings import Settings as SettingsModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied


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
        try:
            return SettingsModel.objects.get(username=info.context.user.username)
        except ObjectDoesNotExist:
            return None


class SettingsInput(InputObjectType):
    id = ID()
    municipality_fee = Decimal()
    price_breakfast = Decimal()
    price_breakfast_child = Decimal()
    price_halfboard = Decimal()
    price_halfboard_child = Decimal()
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
                instance.price_breakfast_child = data.price_breakfast_child if data.price_breakfast_child is not None \
                    else instance.price_breakfast_child
                instance.price_halfboard = data.price_halfboard if data.price_halfboard is not None else \
                    instance.price_halfboard
                instance.price_halfboard_child = data.price_halfboard_child if data.price_halfboard_child is not None \
                    else instance.price_halfboard
                instance.user_avatar = data.user_avatar if data.user_avatar is not None else instance.user_avatar
                instance.user_color = data.user_color if data.user_color is not None else instance.user_color
                instance.user_name = data.user_name if data.user_name is not None else instance.user_name

                try:
                    instance.full_clean()
                except ValidationError as errors:
                    raise Exception(errors.messages[0])

                instance.save()

            return UpdateSettings(settings=instance)
        except ObjectDoesNotExist:
            return UpdateSettings(settings=None)
