import graphene

from api.auth import AuthQuery, AuthMutation
from api.comments.mutations import CommentMutations
from api.comments.queries import CommentsQuery
from api.commercial.schema import OrganisationQuery, PartnerQuery, OrganisationPersonQuery, CommercialMutations
from api.ideas_bugs import IdeaBugQuery, IdeaBugMutation
from api.images.mutations import ImageMutations
from api.license.mutations import LicenseMutations
from api.license.queries import LicenseQuery
from api.work.schema import ProductQuery, InitiativeQuery, TaskQuery, CapabilityQuery, TaskCategoryQuery, ExpertiseQuery
from api.work import WorkMutations
from api.matching.schema import BountyClaimQuery, BountyClaimMutations, BountyDeliveryAttemptQuery
from api.talent.schema import PersonQuery, ProductPersonQuery, TalentMutations, PersonProfileQuery, ReviewQuery, \
    PersonSocialQuery
from api.pages import PagesQuery


class Query(
    PersonQuery,
    OrganisationQuery,
    ProductQuery,
    InitiativeQuery,
    CapabilityQuery,
    TaskQuery,
    PartnerQuery,
    OrganisationPersonQuery,
    BountyClaimQuery,
    ProductPersonQuery,
    PersonProfileQuery,
    PersonSocialQuery,
    ReviewQuery,
    CommentsQuery,
    AuthQuery,
    LicenseQuery,
    IdeaBugQuery,
    PagesQuery,
    BountyDeliveryAttemptQuery,
    TaskCategoryQuery,
    ExpertiseQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    WorkMutations,
    CommercialMutations,
    BountyClaimMutations,
    TalentMutations,
    CommentMutations,
    AuthMutation,
    LicenseMutations,
    ImageMutations,
    IdeaBugMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
