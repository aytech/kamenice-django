from django.core.exceptions import ObjectDoesNotExist
from graphene import resolve_only_args, ObjectType, List, Field, InputObjectType, ID, String, Mutation, Boolean, Int
from graphene_django import DjangoObjectType
from api.models import Guest as GuestModel


class Guest(DjangoObjectType):
    class Meta:
        model = GuestModel
        fields = "__all__"


class Query(ObjectType):
    guests = List(Guest)
    guest = Field(Guest, guest_id=Int())

    @resolve_only_args
    def resolve_guests(self):
        return GuestModel.objects.all()

    @resolve_only_args
    def resolve_guest(self, guest_id):
        return GuestModel.objects.get(pk=guest_id)


class GuestInput(InputObjectType):
    address_municipality = String()
    address_psc = Int()
    address_street = String()
    citizenship = String()
    email = String()
    gender = String()
    id = ID()
    identity = String()
    name = String()
    phone_number = String()
    surname = String()
    visa_number = String()


class CreateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @staticmethod
    def mutate(_root, _info, data=None):
        instance = GuestModel(
            address_municipality=data.address_municipality,
            address_psc=data.address_psc,
            address_street=data.address_street,
            citizenship=data.citizenship,
            email=data.email,
            gender=data.gender,
            identity=data.identity,
            name=data.name,
            phone_number=data.phone_number,
            surname=data.surname,
            visa_number=data.visa_number
        )
        instance.clean_fields()
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
