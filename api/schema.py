import graphene as graphene
import graphql_jwt

from api.schemas.Guest import CreateGuest, DeleteGuest, UpdateGuest, GuestsQuery
from api.schemas.Reservation import ReservationQuery, CreateReservation, DeleteReservation, UpdateReservation
from api.schemas.Suite import SuitesQuery, CreateSuite, UpdateSuite, DeleteSuite
from api.schemas.User import UserQuery, ObtainJSONWebToken


class Query(
    GuestsQuery,
    ReservationQuery,
    SuitesQuery,
    UserQuery,
    graphene.ObjectType
):
    pass


class Mutation(graphene.ObjectType):
    delete_token = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    token_auth = ObtainJSONWebToken.Field()

    create_guest = CreateGuest.Field()
    delete_guest = DeleteGuest.Field()
    update_guest = UpdateGuest.Field()
    create_reservation = CreateReservation.Field()
    delete_reservation = DeleteReservation.Field()
    update_reservation = UpdateReservation.Field()
    create_suite = CreateSuite.Field()
    delete_suite = DeleteSuite.Field()
    update_suite = UpdateSuite.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
