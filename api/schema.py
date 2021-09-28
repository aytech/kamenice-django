import graphene as graphene
import graphql_jwt

from api.schemas.Contact import CreateContactMessage
from api.schemas.Guest import CreateGuest, DeleteGuest, UpdateGuest, GuestsQuery, UpdateReservationGuest
from api.schemas.Reservation import ReservationQuery, CreateReservation, DeleteReservation, UpdateReservation, \
    SendConfirmationEmail
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
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()

    create_guest = CreateGuest.Field()
    delete_guest = DeleteGuest.Field()
    update_guest = UpdateGuest.Field()

    update_reservation_guest = UpdateReservationGuest.Field()

    create_reservation = CreateReservation.Field()
    delete_reservation = DeleteReservation.Field()
    update_reservation = UpdateReservation.Field()
    send_confirmation = SendConfirmationEmail.Field()

    create_suite = CreateSuite.Field()
    delete_suite = DeleteSuite.Field()
    update_suite = UpdateSuite.Field()
    create_contact_message = CreateContactMessage.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
