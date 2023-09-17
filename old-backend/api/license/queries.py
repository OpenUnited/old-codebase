import graphene
from graphene import ObjectType
from api.license.types import LicenseType, ContributorGuideType
from contribution_management.models import ContributorAgreement, ContributorGuide


class LicenseQuery(ObjectType):
    license = graphene.Field(LicenseType, product_slug=graphene.String())
    contributor_guides = graphene.List(ContributorGuideType, product_slug=graphene.String())

    def resolve_license(self, info, product_slug):
        try:
            return ContributorAgreement.objects.filter(product__slug=product_slug).last()
        except ContributorAgreement.DoesNotExist:
            return None

    def resolve_contributor_guides(self, info, product_slug):
        return ContributorGuide.objects.filter(product__slug=product_slug).all()
