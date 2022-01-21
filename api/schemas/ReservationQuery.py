from django.core.exceptions import ObjectDoesNotExist
from graphene import Int, ObjectType, Field, List, String
from graphql_jwt.decorators import user_passes_test

from api.models.Reservation import Reservation as ReservationModel
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.models.Reservation import Reservation, ReservationTypeOption


class ReservationQuery(ObjectType):
    reservation = Field(Reservation, reservation_id=Int())
    reservations = List(Reservation, start_date=String(), end_date=String())
    reservation_meals = List(ReservationTypeOption)
    reservation_types = List(ReservationTypeOption)
    suite_reservations = List(Reservation, suite_id=Int())

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_suite_reservations(self, _info, suite_id):
        try:
            return ReservationModel.objects.get(suite_id=suite_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservation(self, _query, _info, reservation_id):
        try:
            return ReservationModel.objects.get(pk=reservation_id, deleted=False)
        except ObjectDoesNotExist:
            return None

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservations(self, _info, start_date, end_date):
        try:
            return ReservationModel.objects.filter(to_date__gte=start_date).filter(from_date__lte=end_date).exclude(
                deleted=True).select_related('guest').order_by('from_date')
        except ObjectDoesNotExist:
            return None

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservation_meals(self, _info):
        return map(lambda choice: ReservationTypeOption(label=choice[1], value=choice[0]),
                   ReservationModel.MEAL_CHOICES)

    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_reservation_types(self, _info):
        return map(lambda choice: ReservationTypeOption(label=choice[1], value=choice[0]),
                   ReservationModel.TYPE_CHOICES)
