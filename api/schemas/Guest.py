from django.core.exceptions import ObjectDoesNotExist, ValidationError, MultipleObjectsReturned
from graphene import ObjectType, List, Field, InputObjectType, ID, String, Mutation, Int
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.Guest import Guest as GuestModel
from api.models.Reservation import Reservation
from api.schemas.exceptions.Unauthorized import Unauthorized


class Guest(DjangoObjectType):
    class Meta:
        model = GuestModel
        fields = ('address_municipality', 'address_psc', 'address_street', 'age', 'citizenship', 'email', 'gender',
                  'id', 'identity', 'name', 'phone_number', 'surname', 'visa_number')


class ReservationGuests(ObjectType):
    guest = Field(Guest)
    roommates = List(Guest)


class GuestsQuery(ObjectType):
    guests = List(Guest)
    guest = Field(Guest, guest_id=Int())
    reservation_guests = Field(ReservationGuests, reservation_hash=String())

    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def resolve_guests(self, _info):
        return GuestModel.objects.filter(deleted=False)

    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def resolve_guest(self, _info, guest_id):
        try:
            return GuestModel.objects.get(pk=guest_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @classmethod
    def resolve_reservation_guests(cls, _root, _info, reservation_hash):
        try:
            reservation = Reservation.objects.get(hash=reservation_hash, deleted=False)
            return ReservationGuests(
                guest=reservation.guest,
                roommates=reservation.roommates.all()
            )
        except (MultipleObjectsReturned, ObjectDoesNotExist):
            raise Exception('Rezervace nenalezena')


class GuestInput(InputObjectType):
    age = String()
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


class ReservationGuestInput(GuestInput):
    hash = String()


class CreateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def mutate(cls, _root, _info, data=None):
        try:
            GuestModel.objects.get(email=data.email, deleted=False)
            raise Exception('Uživatel s tímto e-mailem již existuje')
        except ObjectDoesNotExist:
            pass

        instance = GuestModel(
            age=data.age,
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

        try:
            instance.full_clean()
        except ValidationError as errors:
            raise Exception(errors.messages[0])

        instance.save()

        return CreateGuest(guest=instance)


class UpdateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @classmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def mutate(cls, _root, _info, data=None):
        try:
            instance = GuestModel.objects.get(pk=data.id, deleted=False)

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
            return UpdateGuest(guest=instance)

        except ObjectDoesNotExist:
            raise Exception('Host nebyl nalezen')


class UpdateReservationGuest(Mutation):
    class Arguments:
        data = ReservationGuestInput(required=True)

    guest = Field(Guest)

    @classmethod
    def mutate(cls, _root, _info, data=None):
        try:
            reservation = Reservation.objects.get(hash=data.hash, deleted=False)
            instance = reservation.guest if reservation.guest.id == int(data.id) \
                else reservation.roommates.get(id=data.id)
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
            return UpdateGuest(guest=instance)
        except ObjectDoesNotExist:
            raise Exception('Hosta nelze aktualizovat')


class DeleteGuest(Mutation):
    class Arguments:
        guest_id = ID()

    guest = Field(Guest)

    @staticmethod
    @user_passes_test(lambda user: user.is_authenticated, exc=Unauthorized)
    def mutate(_root, _info, guest_id):
        try:
            instance = GuestModel.objects.get(pk=guest_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteGuest(guest=instance)
        except ObjectDoesNotExist:
            return DeleteGuest(guest=None)
