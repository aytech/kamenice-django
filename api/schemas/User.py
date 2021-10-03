import random

import graphql_jwt
from django.core.exceptions import ObjectDoesNotExist
from graphene import Field, ObjectType
from graphene_django import DjangoObjectType
from django.utils.translation import gettext_lazy as _

from api.models.User import User as UserModel


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


class User(DjangoObjectType):
    class Meta:
        model = UserModel
        fields = ('id', 'color', 'name', 'surname', 'username')


class UserQuery(ObjectType):
    user = Field(User)

    @classmethod
    def resolve_user(cls, _root, info):
        if info.context.user.is_authenticated:
            try:
                return UserModel.objects.get(username=info.context.user.username)
            except ObjectDoesNotExist:
                raise Exception(_('User not found'))
        else:
            return None


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = Field(User)

    @classmethod
    def resolve(cls, _root, info, **kwargs):
        try:
            user = UserModel.objects.get(username=info.context.user)
            return cls(user=user)
        except ObjectDoesNotExist:
            new_user = UserModel(
                color=Color.get_color(),
                username=info.context.user.username
            )
            new_user.save()
            return cls(user=new_user)
