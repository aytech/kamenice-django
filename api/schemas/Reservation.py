from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db.models import Q
from graphene import ObjectType, List, Field, Int, resolve_only_args, Mutation, InputObjectType, ID, String
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.models.Guest import Guest
from api.models.Reservation import Reservation as ReservationModel
from api.models.Suite import Suite


class Reservation(DjangoObjectType):
    class Meta:
        model = ReservationModel
        fields = '__all__'


class ReservationQuery(ObjectType):
    suite_reservations = List(Reservation, suite_id=Int())
    reservation = Field(Reservation, reservation_id=Int())
    reservations = List(Reservation)

    @resolve_only_args
    def resolve_suite_reservations(self, suite_id):
        return ReservationModel.objects.filter(suite_id=suite_id, deleted=False)

    @resolve_only_args
    def resolve_reservation(self, reservation_id):
        try:
            return ReservationModel.objects.get(pk=reservation_id)
        except ObjectDoesNotExist:
            return None

    @resolve_only_args
    def resolve_reservations(self):
        return ReservationModel.objects.filter(deleted=False)


class ReservationInput(InputObjectType):
    from_date = String()
    guest = Int()
    id = ID()
    meal = String()
    notes = String()
    purpose = String()
    roommates = List(Int)
    suite = Int()
    to_date = String()
    type = String()


class ReservationUtility:
    @staticmethod
    def get_duplicate(suite_id, instance):
        return ReservationModel.objects.filter(
            # Match range that is surrounding the new reservation
            Q(
                deleted=False,
                from_date__lte=instance.from_date,
                suite_id=suite_id,
                to_date__gte=instance.to_date
            )
            |  # Match range with start date within the range of the new reservation
            Q(
                deleted=False,
                from_date__gt=instance.from_date,
                suite_id=suite_id,
                from_date__lt=instance.to_date
            )
            |  # Match range with end date within the range of the new reservation
            Q(
                deleted=False,
                to_date__gt=instance.from_date,
                suite_id=suite_id,
                to_date__lt=instance.to_date
            )
        )


class CreateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @staticmethod
    def mutate(_root, _info, data=None):
        instance = ReservationModel(
            from_date=data.from_date,
            meal=data.meal,
            notes=data.notes,
            purpose=data.purpose,
            to_date=data.to_date,
            type=data.type,
        )

        if ReservationUtility.get_duplicate(data.suite, instance=instance).count() > 0:
            raise GraphQLError('Apartmá je rezervováno pro tuto dobu')

        try:
            instance.guest = Guest.objects.get(pk=data.guest)
        except ObjectDoesNotExist:
            raise GraphQLError('Prosím vyberte hosta ze seznamu')

        try:
            instance.suite = Suite.objects.get(pk=data.suite)
        except ObjectDoesNotExist:
            raise GraphQLError('Apartmá nebylo nalezeno')

        try:
            instance.full_clean()
        except ValidationError as errors:
            raise GraphQLError(errors.messages[0])

        instance.save()

        try:
            for roommate_id in data.roommates:
                instance.roommates.add(Guest.objects.get(pk=roommate_id))
        except ObjectDoesNotExist as ex:
            print('Failed to add roommate', ex)

        instance.save()

        return CreateReservation(reservation=instance)


class UpdateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @staticmethod
    def mutate(_root, _info, data=None):

        try:
            instance = ReservationModel.objects.get(pk=data.id)
            if instance:
                instance.from_date = data.from_date if data.from_date is not None else instance.from_date
                instance.to_date = data.to_date if data.to_date is not None else instance.to_date

                duplicate = ReservationUtility.get_duplicate(data.suite, instance=instance)

                if duplicate.count() > 1 or str(duplicate.get().id) != data.id:
                    raise GraphQLError('Apartmá je rezervováno pro tuto dobu')

            instance.meal = data.meal if data.meal is not None else instance.meal
            instance.notes = data.notes if data.notes is not None else instance.notes
            instance.purpose = data.purpose if data.purpose is not None else instance.purpose
            instance.type = data.type if data.type is not None else instance.type

            try:
                instance.guest = Guest.objects.get(pk=data.guest)
            except ObjectDoesNotExist:
                raise GraphQLError('Prosím vyberte hosta ze seznamu')

            try:
                instance.suite = Suite.objects.get(pk=data.suite)
            except ObjectDoesNotExist:
                raise GraphQLError('Apartmá nebylo nalezeno')

            try:
                instance.full_clean()
            except ValidationError as errors:
                raise GraphQLError(errors.messages[0])

            instance.save()

            try:
                for roommate_id in data.roommates:
                    instance.roommates.add(Guest.objects.get(pk=roommate_id))
            except ObjectDoesNotExist as ex:
                print('Failed to add roommate', ex)

            instance.save()

            return UpdateReservation(reservation=instance)
        except ObjectDoesNotExist:
            raise GraphQLError('Rezervace nebyla nalezena')


class DeleteReservation(Mutation):
    class Arguments:
        reservation_id = ID()

    reservation = Field(Reservation)

    @staticmethod
    def mutate(_root, _info, reservation_id):
        try:
            instance = ReservationModel.objects.get(pk=reservation_id)
            if instance:
                instance.deleted = True
                instance.save()
            return DeleteReservation(reservation=instance)
        except ObjectDoesNotExist:
            return DeleteReservation(reservation=None)
