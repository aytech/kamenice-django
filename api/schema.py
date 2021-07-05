import graphene as graphene
from api.schemas.Guest import CreateGuest, DeleteGuest, Query, UpdateGuest


class Mutation(graphene.ObjectType):
    create_guest = CreateGuest.Field()
    delete_guest = DeleteGuest.Field()
    update_guest = UpdateGuest.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
