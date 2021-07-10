from django.core.exceptions import ObjectDoesNotExist
from graphene import ObjectType, List, Field, Int, resolve_only_args, Mutation, InputObjectType, ID, String
from graphene_django import DjangoObjectType
from api.models.Reservation import Reservation as ReservationModel


class Reservation(DjangoObjectType):
    class Meta:
        model = ReservationModel
        fields = '__all__'


class ReservationQuery(ObjectType):
    reservations = List(Reservation)
    reservation = Field(Reservation, reservation_id=Int())

    @resolve_only_args
    def resolve_reservations(self):
        return ReservationModel.objects.all()

    @resolve_only_args
    def resolve_reservation(self, reservation_id):
        try:
            return ReservationModel.objects.get(pk=reservation_id)
        except ObjectDoesNotExist:
            return None


class ReservationInput(InputObjectType):
    from_day = Int()
    from_hour = Int()
    from_minute = Int()
    from_month = Int()
    from_year = Int()
    id = ID()
    to_day = Int()
    to_hour = Int()
    to_minute = Int()
    to_month = Int()
    to_year = Int()
    type = String()


class CreateReservation(Mutation):
    class Arguments:
        data = ReservationInput(required=True)

    reservation = Field(Reservation)

    @staticmethod
    def mutate(_root, _info, data=None):
        instance = ReservationModel(
            from_day=data.from_day,
            from_hour=data.from_hour,
            from_minute=data.from_minute,
            from_month=data.from_month,
            from_year=data.from_year,
            to_day=data.to_day,
            to_hour=data.to_hour,
            to_minute=data.to_minute,
            to_month=data.to_month,
            to_year=data.to_year,
            type=data.type,
        )
        instance.full_clean()
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
                instance.type = data.type if data.type is not None else instance.type
                instance.from_year = data.from_year if data.from_year is not None else instance.from_year
                instance.from_month = data.from_month if data.from_month is not None else instance.from_month
                instance.from_day = data.from_day if data.from_day is not None else instance.from_day
                instance.from_hour = data.from_hour if data.from_hour is not None else instance.from_hour
                instance.from_minute = data.from_minute if data.from_minute is not None else instance.from_minute
                instance.to_year = data.to_year if data.to_year is not None else instance.to_year
                instance.to_month = data.to_month if data.to_month is not None else instance.to_month
                instance.to_day = data.to_day if data.to_day is not None else instance.to_day
                instance.to_hour = data.to_hour if data.to_hour is not None else instance.to_hour
                instance.to_minute = data.to_minute if data.to_minute is not None else instance.to_minute
                instance.full_clean()
                instance.save()
            return UpdateReservation(reservation=instance)
        except ObjectDoesNotExist:
            return UpdateReservation(reservation=None)


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
