from django.core.exceptions import ObjectDoesNotExist
from graphene import resolve_only_args, ObjectType, List, Field, InputObjectType, ID, String, Mutation, Int
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
        try:
            return GuestModel.objects.get(pk=guest_id)
        except ObjectDoesNotExist:
            return None


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
        instance.full_clean()
        instance.save()
        return CreateGuest(guest=instance)


class UpdateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @staticmethod
    def mutate(_root, _info, data=None):
        try:
            instance = GuestModel.objects.get(pk=data.id)
            if instance:
                instance.address_municipality = data.address_municipality if data.address_municipality is not None \
                    else instance.address_municipality
                instance.address_psc = data.address_psc if data.address_psc is not None else instance.address_psc
                instance.address_street = data.address_street if data.address_street is not None \
                    else instance.address_street
                instance.citizenship = data.citizenship if data.citizenship is not None else instance.citizenship
                instance.email = data.email if data.email is not None else instance.email
                instance.gender = data.gender if data.gender is not None else instance.gender
                instance.identity = data.identity if data.identity is not None else instance.identity
                instance.name = data.name if data.name is not None else instance.name
                instance.phone_number = data.phone_number if data.phone_number is not None else instance.phone_number
                instance.surname = data.surname if data.surname is not None else instance.surname
                instance.visa_number = data.visa_number if data.visa_number is not None else instance.visa_number

                instance.full_clean()
                instance.save()
            return UpdateGuest(guest=instance)
        except ObjectDoesNotExist:
            return UpdateGuest(guest=None)


class DeleteGuest(Mutation):
    class Arguments:
        guest_id = ID()

    guest = Field(Guest)

    @staticmethod
    def mutate(_root, _info, guest_id):
        try:
            instance = GuestModel.objects.get(pk=guest_id)
            instance.delete()
            return DeleteGuest(guest=instance)
        except ObjectDoesNotExist:
            return DeleteGuest(guest=None)
