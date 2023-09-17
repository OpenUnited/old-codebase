import graphene


class InfoStatusMutation(graphene.ObjectType):
    """Mutation with status and message"""
    success = graphene.Boolean(description="Operation status")
    message = graphene.String(description="Operation description message")


class ObjectExistsMutation(graphene.ObjectType):
    """Mutation show if searched object is exists"""
    is_exists = graphene.Boolean(description="Object exists")


class StatusMessageMutation(graphene.ObjectType):
    """Mutation with status and message"""
    status = graphene.Boolean(description="Operation status")
    message = graphene.String(description="Operation description message")