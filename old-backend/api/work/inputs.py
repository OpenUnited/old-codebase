import graphene


class TaskListInput(graphene.InputObjectType):
    sorted_by = graphene.String(required=False)
    statuses = graphene.List(graphene.Int, required=False)
    tags = graphene.List(graphene.String, required=False)
    priority = graphene.List(graphene.String, required=False)
    categories = graphene.List(graphene.Int, required=False)
    assignee = graphene.List(graphene.String, required=False)
    task_creator = graphene.List(graphene.String, required=False)


class InitiativeListInput(graphene.InputObjectType):
    statuses = graphene.List(graphene.Int, required=False)
    tags = graphene.List(graphene.Int, required=False)
    categories = graphene.List(graphene.Int, required=False)
