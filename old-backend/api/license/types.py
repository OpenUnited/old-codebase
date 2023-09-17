from graphene_django import DjangoObjectType
from contribution_management.models import ContributorAgreement, ContributorGuide


class LicenseType(DjangoObjectType):
    class Meta:
        model = ContributorAgreement


class ContributorGuideType(DjangoObjectType):
    class Meta:
        model = ContributorGuide
