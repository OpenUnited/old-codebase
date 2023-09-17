import json
import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from matching.models import BountyClaim, BountyDeliveryAttempt
from .types import BountyClaimType, BountyDeliveryAttemptType
from .mutations import BountyTaskClaimMutation


class BountyClaimQuery(ObjectType):
    matches = graphene.List(BountyClaimType)
    match = graphene.Field(BountyClaimType, id=graphene.Int())

    def resolve_match(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return BountyClaim.objects.get(pk=id)

        return None

    def resolve_matches(self, info, query=None, **kwargs):
        qs = BountyClaim.objects.all()
        return qs


class BountyDeliveryAttemptQuery(ObjectType):
    attempts = graphene.List(BountyDeliveryAttemptType)
    attempt = graphene.Field(BountyDeliveryAttemptType, id=graphene.Int())

    def resolve_attempt(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return BountyDeliveryAttempt.objects.filter(kind=0, bounty_claim__bounty_id=id).last()

        return None

    def resolve_attempts(self, info, query=None, **kwargs):
        qs = BountyDeliveryAttempt.objects.all()
        return qs


class BountyClaimMutations(graphene.ObjectType):
    create_match = BountyTaskClaimMutation.Field()

