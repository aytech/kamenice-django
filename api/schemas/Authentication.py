import random

from django.core.exceptions import ObjectDoesNotExist
from graphene import Field
from graphql_jwt import JSONWebTokenMutation

from api.schemas.Settings import Settings
from api.models.Settings import Settings as SettingsModel


class Color:
    colors = (
        "#f5222d",  # red
        "#fa541c",  # volcano
        "#fa8c16",  # orange
        "#faad14",  # gold
        "#fadb14",  # yellow
        "#a0d911",  # lime
        "#52c41a",  # green
        "#13c2c2",  # cyan
        "#1890ff",  # blue
        "#2f54eb",  # geekblue
        "#722ed1",  # purple
        "#eb2f96",  # magenta
    )

    @staticmethod
    def get_color():
        index = random.randrange(0, len(Color.colors) - 1, 1)
        return Color.colors[index]


class ObtainJSONWebToken(JSONWebTokenMutation):
    settings = Field(Settings)

    @classmethod
    def resolve(cls, _root, info, **kwargs):
        try:
            settings = SettingsModel.objects.get(username=info.context.user)
            return cls(settings=settings)
        except ObjectDoesNotExist:
            new_settings = SettingsModel(
                user_color=Color.get_color(),
                username=info.context.user.username
            )
            new_settings.save()
            return cls(settings=new_settings)
