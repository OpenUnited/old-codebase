from django.db.models import Q
import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from api.talent.types import PersonType
from api.matching.types import BountyClaimType
from api.utils import get_current_person
from api.work.utils import get_right_task_status, get_video_link
from matching.models import CLAIM_TYPE_IN_REVIEW, BountyClaim
from work.models import *
from talent.models import ProductPerson

class BountyType(DjangoObjectType):
    class Meta:
        model = Bounty
        convert_choices_to_enum = False

class ExpertiseType(DjangoObjectType):
    class Meta:
        model = Expertise
    
class ChallengeSkillType(DjangoObjectType):
    class Meta:
        model = Skill

class TaskType(DjangoObjectType):
    id = graphene.Int()
    product = graphene.Field(lambda: ProductType)
    priority = graphene.String()
    can_edit = graphene.Boolean(user_id=graphene.Int())
    assigned_to = graphene.Field(PersonType)
    in_review = graphene.Boolean()
    skill = graphene.List(graphene.String)
    bounty = graphene.List(BountyType)
    bounty_claim = graphene.List(BountyClaimType)
    depend_on = graphene.List(lambda: TaskType)
    relatives = graphene.List(lambda: TaskType)
    status = graphene.Int()
    link = graphene.String()
    has_active_depends = graphene.Boolean()
    preview_video_url = graphene.String()

    class Meta:
        model = Challenge
        convert_choices_to_enum = False

    def resolve_skill(self, _):
        challenge_skills = []
        for bounty in self.bounty_set.filter(is_active=True):
            if bounty.skill:
                challenge_skills.append(bounty.skill.name)
        return challenge_skills

    def resolve_bounty(self, _):
        all_bounty = []
        for bounty in self.bounty_set.filter(is_active=True):
            if bounty.skill:
                all_bounty.append(bounty)
        return all_bounty

    def resolve_bounty_claim(self, _):
        all_bounty_claim = []
        for bounty in self.bounty_set.filter(is_active=True):
            bounty_claim = bounty.bountyclaim_set.filter(kind__in=[0, 1, 3]).last()
            if bounty_claim:
                all_bounty_claim.append(bounty_claim)
        return all_bounty_claim

    def resolve_assigned_to(self, _):
        assigned_to = None
        for bounty in self.bounty_set.filter(is_active=True):
            bounty_claim = bounty.bountyclaim_set.filter(kind__in=[0, 1, 3]).last()
            if bounty_claim:
                assigned_to = bounty_claim.person
                break
        return assigned_to

    def resolve_in_review(self, _):
        is_in_review = False
        for bounty in self.bounty_set.filter(is_active=True):
            if bounty.bountyclaim_set.filter(kind=CLAIM_TYPE_IN_REVIEW).count() > 0:
                is_in_review = True
                break
        return is_in_review

    def resolve_priority(self, _):
        try:
            return Challenge.CHALLENGE_PRIORITY[self.priority][1]
        except:
            return None

    def resolve_can_edit(self, _, **kwargs):
        current_person = get_current_person(_, kwargs)
        try:
            if not current_person:
                return False

            return ProductPerson.objects.filter(
                product=ProductChallenge.objects.get(challenge_id=self.id).product,
                person=current_person,
                right__in=[1, 2, 4]
            ).exists()
        except (ProductPerson.DoesNotExist, ProductChallenge.DoesNotExist):
            return False

    def resolve_depend_on(self, _, **kwargs):
        try:
            return Challenge.objects.filter(challengedepend__challenge=self.id)
        except Challenge.DoesNotExist:
            return None

    def resolve_has_active_depends(self, info):
        return Challenge.objects.filter(challengedepend__challenge=self.id).exclude(status=Challenge.CHALLENGE_STATUS_DONE).exists()

    def resolve_relatives(self, _, **kwargs):
        try:
            relatives = list(map(lambda relative: relative.challenge_id, ChallengeDepend.objects.filter(depends_by=self.id)))

            return Challenge.objects.filter(pk__in=relatives)
        except Challenge.DoesNotExist:
            return None

    def resolve_status(self, _, **kwargs):
        return get_right_task_status(self.id, self)

    def resolve_link(self, _):
        return self.get_challenge_link(False)

    def resolve_preview_video_url(self, _):
        return get_video_link(self, "video_url")


class ProductChallengeType(DjangoObjectType):
    class Meta:
        model = ProductChallenge
        convert_choices_to_enum = False

class TaskInput(graphene.InputObjectType):
    initiative = graphene.Int(required=False)
    capability = graphene.Int(required=False)
    title = graphene.String(required=True)
    short_description = graphene.String(required=False)
    description = graphene.String(required=True)
    status = graphene.Int(required=False)
    product_slug = graphene.String(required=True)
    tags = graphene.List(graphene.String, required=False)
    skill = graphene.String()
    expertise = graphene.String()
    bounty_skills = graphene.String()
    depend_on = graphene.List(graphene.Int, required=False)
    reviewer = graphene.String(required=True)
    video_url = graphene.String(required=False)
    priority = graphene.String(required=False)
    contribution_guide = graphene.String(required=False)


class InitiativeType(DjangoObjectType):
    available_task_count = graphene.Int(source="get_available_tasks_count")
    completed_task_count = graphene.Int(source="get_completed_task_count")
    task_tags = graphene.List(lambda: TagType, source="get_task_tags")
    preview_video_url = graphene.String()
    status = graphene.String()

    class Meta:
        model = Initiative
        convert_choices_to_enum = False

    def resolve_preview_video_url(self, _):
        return get_video_link(self, "video_url")

    def resolve_status(self, _):
        return "%s"%self.status


class InitiativeTaskType(graphene.ObjectType):
    initiative = graphene.Field(InitiativeType)
    tasks = graphene.List("api.work.types.TaskListingType")


class InitiativeInput(graphene.InputObjectType):
    name = graphene.String(
        description="Name of the initiative", required=True
    )
    product_slug = graphene.String(required=False)
    description = graphene.String(
        description="Description of the initiative", required=False
    )
    status = graphene.Int(
        description="Status of the initiative", required=False
    )
    video_url = graphene.String(required=False)


class ProductType(DjangoObjectType):
    available_task_num = graphene.Int()
    total_task_num = graphene.Int()
    initiative_set = graphene.List(InitiativeType)
    owner = graphene.String()

    class Meta:
        model = Product

    def resolve_available_task_num(self, _):
        return Challenge.objects.filter(initiative__product=self, status=2).count()

    def resolve_total_task_num(self, _):
        if self is not None:
            return Challenge.objects.filter(
                Q(capability__product=self) | Q(initiative__product=self)
            ).count()
        return None

    def resolve_initiative_set(self,_):
        return Initiative.objects.filter(product=self.id,status=1)
        
    def resolve_owner(self, _):
        return self.owner.get_username() if self.owner else None



class ProductInput(graphene.InputObjectType):
    slug = graphene.String(required=False)
    name = graphene.String(required=True)
    short_description = graphene.String(required=True)
    full_description = graphene.String(required=False)
    website = graphene.String(required=True)
    video_url = graphene.String(required=False)
    is_private = graphene.Boolean(required=False)


class BreadcrumbType(ObjectType):
    id = graphene.Int()
    name = graphene.String()


class BreadcrumbObject:
    def __init__(self, id, name):
        self.id = id
        self.name = name


def get_hitask(obj, hitask):
    if obj is not None:
        newObject = BreadcrumbObject(obj.id, obj.name)
        hitask.append(newObject)
        return get_hitask(obj.parent, hitask)
    return hitask


class AttachmentType(DjangoObjectType):
    class Meta:
        model = Attachment


class TagType(DjangoObjectType):
    class Meta:
        model = Tag


class CapabilityType(DjangoObjectType):
    id = graphene.Int()
    product = graphene.Field(ProductType)
    tasks = graphene.List(TaskType)
    attachments = graphene.List(AttachmentType)
    preview_video_url = graphene.String()

    class Meta:
        model = Capability

    def resolve_product(self, _):
        if self is not None:
            return Product.objects.get(capability_start_id=self.get_root().id)
        return None

    def resolve_tasks(self, _):
        if self is not None:
            return Challenge.objects.filter(capability=self)
        return None

    def resolve_attachments(self, _):
        return Attachment.objects.filter(capabilityattachment__capability=self)

    def resolve_preview_video_url(self, _):
        return get_video_link(self, "video_link")


class CapabilityTaskType(graphene.ObjectType):
    capability = graphene.Field(CapabilityType)
    tasks = graphene.List("api.work.types.TaskListingType")


class CapabilityInput(graphene.InputObjectType):
    node_id = graphene.Int(required=False)
    product_slug = graphene.String(required=False)
    name = graphene.String(required=True)
    description = graphene.String(required=True)

    # stacks = graphene.List(graphene.Int, required=False)
    video_link = graphene.String(required=False)
    attachments = graphene.List(graphene.Int, required=False)


class CodeRepositoryType(DjangoObjectType):
    class Meta:
        model = CodeRepository


class CodeRepositoryInput(graphene.InputObjectType):
    product_slug = graphene.String(required=True)
    repository = graphene.String(required=False)
    access_token = graphene.String(required=True)


class AttachmentInput(graphene.InputObjectType):
    task_id = graphene.Int(required=False)
    capability_id = graphene.Int(required=False)
    name = graphene.String(required=False)
    path = graphene.String(required=True)
    file_type = graphene.String(required=False)


class InitiativeDictType(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    status = graphene.Int()
    description = graphene.String()
    video_url = graphene.String()

    def resolve_video_url(self, _):
        return get_video_link(self, "video_url") if self else None


class ProductDictType(graphene.ObjectType):
    name = graphene.String()
    slug = graphene.String()
    owner = graphene.String()
    website = graphene.String()
    detail_url = graphene.String()
    video_url = graphene.String()


class PersonJSONData(graphene.ObjectType):
    username = graphene.String()
    first_name = graphene.String()


class AssignedToPersonType(graphene.ObjectType):
    slug = graphene.String()
    first_name = graphene.String()


class TaskListingType(DjangoObjectType):
    id = graphene.Int()
    priority = graphene.String()
    in_review = graphene.Boolean()
    status = graphene.Int()
    initiative = graphene.Field(InitiativeDictType)
    product = graphene.Field(ProductDictType)
    tags = graphene.List(graphene.String)
    category = graphene.String()
    expertise = graphene.List(ExpertiseType)
    assigned_to_person = graphene.Field(AssignedToPersonType)
    reviewer = graphene.Field(PersonJSONData)
    video_url = graphene.String()

    class Meta:
        model = ChallengeListing
        convert_choices_to_enum = False

    def resolve_product(self, info):
        return self.product_data

    def resolve_category(self, info):
        return self.challenge.skill if self.challenge.skill else None

    def resolve_expertise(self, info):
        if self.challenge.expertise.count():
            return self.challenge.expertise.all()
        else:
            return None

    def resolve_priority(self, _):
        try:
            return Challenge.CHALLENGE_PRIORITY[self.priority][1]
        except:
            return None

    def resolve_video_url(self, _):
        return get_video_link(self, "video_url")
