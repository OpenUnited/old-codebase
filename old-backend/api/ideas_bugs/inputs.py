import graphene


class IdeaInput(graphene.InputObjectType):
    product_id = graphene.Int(required=True, description="Product ID")
    headline = graphene.String(required=True, description="Please give your idea a name")
    # idea_type = graphene.Int(required=False, description="Which of the following best matches your idea?")
    related_capability_id = graphene.Int(description="Related capability ID")
    description = graphene.String(required=True)


class BugInput(graphene.InputObjectType):
    product_id = graphene.Int(required=True, description="Product ID")
    headline = graphene.String(required=True, description="Please give your bug a name")
    bug_type = graphene.Boolean(required=True, description="Which of the following best matches your idea?")
    related_capability_id = graphene.Int(description="Related capability ID")
    description = graphene.String(required=True)


class VoteInput(graphene.InputObjectType):
    object_id = graphene.Int(required=True, description="Object ID")
    vote_type = graphene.Int(required=True)


class ChangeStatusInput(graphene.InputObjectType):
    object_id = graphene.Int(required=True, description="Object ID")
    status = graphene.Int(required=True)
    description = graphene.String(required=False)
