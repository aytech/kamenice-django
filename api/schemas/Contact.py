from graphene import Mutation, InputObjectType, String, Field
from graphene_django import DjangoObjectType

from api.models.Contact import Contact as ContactModel


class Contact(DjangoObjectType):
    class Meta:
        model = ContactModel
        fields = ("message",)


class ContactInput(InputObjectType):
    message = String()


class CreateContactMessage(Mutation):
    class Arguments:
        data = ContactInput(required=True)

    contact = Field(Contact)

    @classmethod
    def mutate(cls, _root, _info, data=None):
        instance = ContactModel(
            message=data.message
        )
        instance.save()
        return CreateContactMessage(contact=instance)
