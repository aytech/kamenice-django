from django.contrib.auth import get_user_model
from graphene import ObjectType, Field
from graphene_django import DjangoObjectType


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
