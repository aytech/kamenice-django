import graphene
import graphql_jwt
from django.contrib.auth import get_user_model
from graphene import ObjectType, Field
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = ('username',)


class UserQuery(ObjectType):
    whoami = Field(UserType)

    @classmethod
    def resolve_whoami(cls, _query, info):
        user = info.context.user
        if user.is_anonymous:
            return None
        return user


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = Field(UserType)

    @classmethod
    def resolve(cls, _root, info, **kwargs):
        return cls(user=info.context.user)
