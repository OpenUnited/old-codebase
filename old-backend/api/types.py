import graphene


class InfoType(graphene.ObjectType):
    status = graphene.Boolean()
    message = graphene.String()
