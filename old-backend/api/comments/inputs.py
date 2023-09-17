import graphene


class CommentInput(graphene.InputObjectType):
    text = graphene.String(required=True)
    commented_object_id = graphene.Int(required=False)
    parent_id = graphene.Int(required=False)
