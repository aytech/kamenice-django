from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphene import ObjectType, List, Field, ID, InputObjectType, String, Int, Mutation
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _

from api.models.Guest import Guest
from api.models.Roommate import Roommate as RoommateModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied


class Roommate(DjangoObjectType):
    class Meta:
        model = RoommateModel
        fields = (
            'address_municipality', 'address_psc', 'address_street', 'age', 'citizenship', 'email', 'gender', 'guest',
            'id', 'identity', 'name', 'phone_number', 'surname', 'visa_number',)


class RoommateQuery(ObjectType):
    roommates = List(Roommate, guest_id=ID())
    roommate = Field(Roommate, roommate_id=ID())

    @user_passes_test(lambda user: user.has_perm('api.view_guest'), exc=PermissionDenied)
    def resolve_roommates(self, _info, guest_id):
        try:
            return RoommateModel.objects.filter(guest_id=guest_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @user_passes_test(lambda user: user.has_perm('api.view_guest'), exc=PermissionDenied)
    def resolve_roommate(self, _info, roommate_id):
        try:
            return RoommateModel.objects.get(pk=roommate_id, deleted=False)
        except ObjectDoesNotExist:
            return None


class RoommateInput(InputObjectType):
    age = String()
    address_municipality = String()
    address_psc = Int()
    address_street = String()
    citizenship = String()
    email = String()
    gender = String()
    guest_id = ID()
    id = ID()
    identity = String()
    name = String()
    phone_number = String()
    surname = String()
    visa_number = String()


class CreateRoommate(Mutation):
    class Arguments:
        data = RoommateInput(required=True)

    roommate = Field(Roommate)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_guest'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            guest = Guest.objects.get(pk=data.guest_id, deleted=False)

            if guest:
                instance = RoommateModel(
                    age=data.age,
                    address_municipality=data.address_municipality,
                    address_psc=data.address_psc,
                    address_street=data.address_street,
                    citizenship=data.citizenship,
                    email=data.email,
                    gender=data.gender,
                    guest=guest,
                    identity=data.identity,
                    name=data.name,
                    phone_number=data.phone_number,
                    surname=data.surname,
                    visa_number=data.visa_number
                )

                instance.full_clean()
                instance.save()

                return CreateRoommate(roommate=instance)
        except ObjectDoesNotExist:
            raise Exception(_('Guest not found'))
        except ValidationError as errors:
            raise Exception(errors.messages[0])


class UpdateRoommate(Mutation):
    class Arguments:
        data = RoommateInput(required=True)

    roommate = Field(Roommate)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_guest'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = RoommateModel.objects.get(pk=data.id, deleted=False)

            if instance:
                instance.age = data.age if data.age is not None else instance.age
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
            return UpdateRoommate(roommate=instance)
        except ObjectDoesNotExist:
            raise Exception(_('Roommate not found'))
        except ValidationError as errors:
            raise Exception(errors.messages[0])


class DeleteRoommate(Mutation):
    class Arguments:
        roommate_id = ID()

    roommate = Field(Roommate)

    @staticmethod
    @user_passes_test(lambda user: user.has_perm('api.delete_guest'), exc=PermissionDenied)
    def mutate(_root, _info, guest_id):
        try:
            instance = RoommateModel.objects.get(pk=guest_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteRoommate(roommate=instance)
        except ObjectDoesNotExist:
            return DeleteRoommate(roommate=None)
