from graphene import ObjectType, String, InputObjectType, List, Int, ID, Decimal
from graphene_django import DjangoObjectType
from api.models.Reservation import Reservation as ReservationModel


class Reservation(DjangoObjectType):
    class Meta:
        model = ReservationModel
        fields = (
            'expired', 'extra_suites', 'from_date', 'guest', 'id', 'meal', 'notes', 'paying_guest', 'price_set',
            'purpose', 'roommates', 'suite', 'to_date', 'type')


class ReservationTypeOption(ObjectType):
    label = String(required=True)
    value = String(required=True)


class ReservationInput(InputObjectType):
    expired = String()
    extra_suites_ids = List(Int)
    from_date = String()
    guest_id = Int()
    id = ID()
    meal = String()
    notes = String()
    number_days = Int()
    paying_guest_id = Int()
    price_accommodation = Decimal()
    price_meal = Decimal()
    price_municipality = Decimal()
    price_total = Decimal()
    purpose = String()
    roommate_ids = List(Int)
    suite_id = Int()
    to_date = String()
    type = String()


class ReservationDragInput(InputObjectType):
    extra_suites_ids = List(Int)
    from_date = String()
    id = ID()
    suite_id = Int()
    to_date = String()


class ConfirmationInput(InputObjectType):
    note = String()
    reservation_id = ID()
