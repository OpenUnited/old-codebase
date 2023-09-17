import graphene


class LicenseInput(graphene.InputObjectType):
    product_slug = graphene.String(required=True)
    content = graphene.String(required=False)


class ContributionGuideInput(graphene.InputObjectType):
    product_slug = graphene.String(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    category = graphene.Int(required=False)
