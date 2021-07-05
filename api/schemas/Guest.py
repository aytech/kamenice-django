import graphene
from django.core.exceptions import ObjectDoesNotExist
from graphene import resolve_only_args, ObjectType, List, Field, InputObjectType, ID, String, Mutation, Boolean
from graphene_django import DjangoObjectType
from api.models import Guest as GuestModel


class Guest(DjangoObjectType):
    class Meta:
        model = GuestModel
        fields = "__all__"


class Query(ObjectType):
    guests = List(Guest)
    guest = Field(Guest, guest_id=graphene.Int())

    @resolve_only_args
    def resolve_guests(self):
        return GuestModel.objects.all()

    @resolve_only_args
    def resolve_guest(self, guest_id):
        return GuestModel.objects.get(pk=guest_id)


class GuestInput(InputObjectType):
    id = ID()
    name = String()
    surname = String()


class CreateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @staticmethod
    def mutate(_root, _info, data=None):
        instance = GuestModel(
            name=data.name,
            surname=data.surname
        )
        instance.save()
        return CreateGuest(guest=instance)


class UpdateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @staticmethod
    def mutate(_root, _info, data=None):

        instance = GuestModel.objects.get(pk=data.id)

        if instance:
            instance.name = data.name if data.name is not None else instance.name
            instance.surname = data.surname if data.surname is not None else instance.surname
            instance.save()

            return UpdateGuest(guest=instance)

        return UpdateGuest(guest=None)


class DeleteGuest(Mutation):
    ok = Boolean()

    class Arguments:
        guest_id = ID()

    guest = Field(Guest)

    @staticmethod
    def mutate(_root, _info, guest_id):
        try:
            instance = GuestModel.objects.get(pk=guest_id)
            instance.delete()
            return DeleteGuest(ok=True)
        except ObjectDoesNotExist:
            return DeleteGuest(ok=False)
