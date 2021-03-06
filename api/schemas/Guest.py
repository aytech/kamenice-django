import traceback

from django.core.exceptions import ObjectDoesNotExist, ValidationError, MultipleObjectsReturned
from graphene import ObjectType, List, Field, InputObjectType, ID, String, Mutation, Int
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _

from api.models.Guest import Guest as GuestModel
from api.models.Roommate import Roommate as RoommateModel
from api.models.Reservation import Reservation
from api.schemas.Authentication import Color
from api.schemas.Roommate import Roommate
from api.schemas.Suite import Suite
from api.schemas.exceptions.PermissionDenied import PermissionDenied


class Guest(DjangoObjectType):
    class Meta:
        model = GuestModel
        fields = ('address_municipality', 'address_psc', 'address_street', 'age', 'citizenship', 'color', 'email',
                  'gender', 'id', 'identity', 'name', 'phone_number', 'surname', 'visa_number')


class ReservationGuests(ObjectType):
    guest = Field(Guest)
    roommates = List(Guest)
    suite = Field(Suite)


class GuestsQuery(ObjectType):
    guests = List(Guest)
    guest = Field(Guest, guest_id=Int())
    reservation_guests = Field(ReservationGuests, reservation_hash=String())

    @user_passes_test(lambda user: user.has_perm('api.view_guest'), exc=PermissionDenied)
    def resolve_guests(self, _info):
        return GuestModel.objects.filter(deleted=False).order_by('surname')

    @user_passes_test(lambda user: user.has_perm('api.view_guest'), exc=PermissionDenied)
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
                roommates=map(lambda roommate: roommate.entity, reservation.roommate_set.all()),
                suite=reservation.suite
            )
        except (MultipleObjectsReturned, ObjectDoesNotExist):
            raise Exception(_('Reservation not found'))


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
    @user_passes_test(lambda user: user.has_perm('api.add_guest'), exc=PermissionDenied)
    def mutate(cls, _root, _info, data=None):
        try:
            GuestModel.objects.get(
                name=data.name,
                surname=data.surname,
                email=data.email,
                deleted=False
            )
            raise Exception(_('Guest already exists'))
        except ObjectDoesNotExist:
            pass

        instance = GuestModel(
            age=data.age,
            address_municipality=data.address_municipality,
            address_psc=data.address_psc,
            address_street=data.address_street,
            citizenship=data.citizenship,
            color=Color.get_color(),
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


class CreateReservationRoommate(Mutation):
    class Arguments:
        data = ReservationGuestInput(required=True)

    roommate = Field(Guest)

    @classmethod
    def mutate(cls, _root, _info, data=None):
        try:
            reservation_instance = Reservation.objects.get(hash=data.hash, deleted=False)

            room_capacity = reservation_instance.suite.number_beds + reservation_instance.suite.number_beds_extra
            if room_capacity <= (reservation_instance.roommate_set.count() + 1):  # +1 for main host
                raise Exception(_('Accommodation capacity exceeded'))

            guest_instance = GuestModel(
                age=data.age,
                address_municipality=data.address_municipality,
                address_psc=data.address_psc,
                address_street=data.address_street,
                citizenship=data.citizenship,
                color=Color.get_color(),
                email=data.email,
                gender=data.gender,
                identity=data.identity,
                name=data.name,
                phone_number=data.phone_number,
                surname=data.surname,
                visa_number=data.visa_number
            )

            try:
                guest_instance.full_clean()
            except ValidationError as errors:
                raise Exception(errors.messages[0])

            guest_instance.save()
            roommate_instance = RoommateModel(
                entity=guest_instance,
                from_date=reservation_instance.from_date,
                reservation=reservation_instance,
                to_date=reservation_instance.to_date
            )
            roommate_instance.save()
            reservation_instance.roommate_set.add(roommate_instance)

            return CreateReservationRoommate(roommate=guest_instance)

        except ObjectDoesNotExist:
            raise Exception(_('Guest cannot be created'))


class UpdateGuest(Mutation):
    class Arguments:
        data = GuestInput(required=True)

    guest = Field(Guest)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.change_guest'), exc=PermissionDenied)
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
            raise Exception(_('Guest not found'))


class UpdateReservationRoommate(Mutation):
    class Arguments:
        data = ReservationGuestInput(required=True)

    roommate = Field(Guest)

    @staticmethod
    def update_instance(instance, data):
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

        return instance

    @classmethod
    def mutate(cls, _root, _info, data=None):
        try:
            reservation = Reservation.objects.get(hash=data.hash, deleted=False)
            guest = reservation.guest
            roommates = reservation.roommate_set.all()
            if guest.id == int(data.id):
                return UpdateReservationRoommate(roommate=UpdateReservationRoommate.update_instance(guest, data))
            else:
                for roommate in roommates:
                    if roommate.entity.id == int(data.id):
                        return UpdateReservationRoommate(
                            roommate=UpdateReservationRoommate.update_instance(roommate.entity, data))
            return UpdateReservationRoommate(roommate=None)
        except ObjectDoesNotExist:
            raise Exception(_('Guest cannot be updated'))


class DeleteGuest(Mutation):
    class Arguments:
        guest_id = ID()

    guest = Field(Guest)

    @staticmethod
    @user_passes_test(lambda user: user.has_perm('api.delete_guest'), exc=PermissionDenied)
    def mutate(_root, _info, guest_id):
        try:
            instance = GuestModel.objects.get(pk=guest_id)
            if instance is None:
                return DeleteGuest(guest=None)
            # Do not remove if guest is a main guest
            if Reservation.objects.filter(guest_id=instance.id, deleted=False).count() > 0:
                raise Exception(_('Guest is a main guest in one or more reservations, and cannot be deleted'))
            # If guest is a roommate, remove from reservation(s)
            for reservation in Reservation.objects.filter(roommates__in=[instance.id], deleted=False).all():
                for roommate in reservation.roommates.all():
                    if roommate.id == instance.id:
                        reservation.roommates.remove(roommate.id)
                        reservation.save()
            instance.deleted = True
            instance.save()
            return DeleteGuest(guest=instance)
        except ObjectDoesNotExist:
            return DeleteGuest(guest=None)


class DeleteReservationRoommate(Mutation):
    class Arguments:
        data = ReservationGuestInput(required=True)

    roommate = Field(Guest)

    @classmethod
    def mutate(cls, _root, _info, data=None):
        try:
            reservation = Reservation.objects.get(hash=data.hash, deleted=False)
            if reservation is not None:
                reservation.roommate_set.filter(entity_id=data.id).delete()
            return DeleteReservationRoommate(roommate=None)
        except ObjectDoesNotExist:
            raise Exception(_('Guest cannot be deleted'))
