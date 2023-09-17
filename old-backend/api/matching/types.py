import graphene
from graphene_django.types import DjangoObjectType
from matching.models import BountyClaim, BountyDeliveryAttempt, BountyDeliveryAttachment


class BountyClaimType(DjangoObjectType):
    class Meta:
        model = BountyClaim
        convert_choices_to_enum = False


class BountyClaimInput(graphene.InputObjectType):
    id = graphene.Int(
        description="Product Id, which is used for product update",
        required=False
    )
    task = graphene.Int(
        description="Foreign key to Task", required=True
    )
    person = graphene.UUID(
        description="Foreign key to Person", required=True
    )
    kind = graphene.Int(
        description="match type", required=True
    )


class BountyDeliveryAttachmentType(DjangoObjectType):
    class Meta:
        model = BountyDeliveryAttachment


class BountyDeliveryAttemptType(DjangoObjectType):
    attachments = graphene.List(BountyDeliveryAttachmentType)

    class Meta:
        model = BountyDeliveryAttempt
        convert_choices_to_enum = False

    def resolve_attachments(self, info):
        attachments = BountyDeliveryAttachment.objects.filter(bounty_delivery_attempt=self.id).all()
        return attachments if len(attachments) > 0 else []
