from django.db.models import Count, Q

from matching.models import BountyClaim, CLAIM_TYPE_DONE
from .types import *
from work.models import Bounty, CodeRepository
from api.work.types import CodeRepositoryType
from .mutations import CreatePersonMutation, SignInPersonMutation, AvatarUploadMutation, UpdatePersonMutation, \
    AvatarDeleteMutation
from ..utils import get_paginator, make_filters
from ..decorators import is_current_person


class PersonQuery(ObjectType):
    people = graphene.List(PersonType,
                           hide_test_users=graphene.Boolean(),
                           show_only_test_users=graphene.Boolean())
    person = graphene.Field(PersonType, id=graphene.String())
    comment_people = graphene.List(PersonType,
                                   hide_test_users=graphene.Boolean(),
                                   show_only_test_users=graphene.Boolean(),
                                   starts_with=graphene.String())
    person_info = graphene.Field(PersonPortfolioType,
                                 person_slug=graphene.String())

    person_tasks = graphene.List(PersonTask,
                                 person_slug=graphene.String())

    person_task_delivery_message = graphene.Field(DeliveryAttemptType,
                                                  task_id=graphene.Int(),
                                                  person_slug=graphene.String())

    logged_in_user = graphene.Field(PersonType, id=graphene.String())

    @is_current_person
    def resolve_logged_in_user(current_person, *args, **kwargs):
        return current_person


    def resolve_person(self, info, **kwargs):
        id = kwargs.get('id')

        if not id:
            try:
                user = info.context.user

                if user.is_authenticated:
                    return Person.objects.filter(user=info.context.user).first()
                else:
                    return None
            except Person.DoesNotExist:
                return None

        if id is not None:
            return Person.objects.get(pk=id)

        return None

    def resolve_people(self, info, hide_test_users=False, show_only_test_users=False):
        filter_data = dict()
        if hide_test_users:
            filter_data["test_user"] = False
        if show_only_test_users:
            filter_data["test_user"] = True
        return Person.objects.filter(**filter_data).all()

    def resolve_comment_people(self, info, starts_with, hide_test_users=False, show_only_test_users=False):
        if not starts_with:
            return []
        filter_data = dict()
        if hide_test_users:
            filter_data["test_user"] = False
        if show_only_test_users:
            filter_data["test_user"] = True
        filter_data["user__username__startswith"] = starts_with
        return Person.objects.filter(**filter_data).all()

    @staticmethod
    def resolve_person_info(info, *args, **kwargs):
        person_slug = kwargs.get('person_slug')
        person = Person.objects.prefetch_related('profile', 'profile__avatar', 'preferences').get(slug=person_slug)
        return person

    @staticmethod
    def resolve_person_tasks(info, *args, **kwargs):
        # page = kwargs.get('page', 1)
        person_slug = kwargs.get('person_slug')
        # filters = kwargs.get('filters')
        # page_size = 6
        task_filters = {}
        # if filters:
            # task_filters = make_filters(filters)
        bounty_claims = BountyClaim.objects.filter(person__slug=person_slug, kind=CLAIM_TYPE_DONE, **task_filters).order_by(
            '-bounty__updated_at').select_related('bounty').all()
        challenges = [i.bounty.challenge for i in bounty_claims]
        return challenges
        # return get_paginator(tasks, page_size, page, PersonPaginatedTasks)

    @staticmethod
    def resolve_person_task_delivery_message(info, *args, **kwargs):
        challenge_id = kwargs.get('task_id')
        person_slug = kwargs.get('person_slug')
        challenge_bounty = Bounty.objects.filter(challenge_id=challenge_id)
        bounty_claim = None
        for bounty in challenge_bounty:
            bounty_claim = BountyClaim.objects.filter(bounty=bounty, kind=CLAIM_TYPE_DONE,
                                                  person__slug=person_slug).last()
            if bounty_claim:
                delivery_attempt = bounty_claim.delivery_attempt.filter(kind=BountyDeliveryAttempt.SUBMISSION_TYPE_APPROVED).last()
                if delivery_attempt:
                    return delivery_attempt

        return


class ProductPersonQuery(ObjectType):
    product_persons = graphene.Field(ProductPersonsType, product_slug=graphene.String())
    product_person = graphene.Field(ProductPersonType, id=graphene.Int())
    repositories = graphene.List(CodeRepositoryType, product_slug=graphene.String())

    def resolve_product_person(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return ProductPerson.objects.get(pk=id)

        return None

    @staticmethod
    def resolve_product_persons(info, *args, **kwargs):
        product_slug = kwargs.get("product_slug")
        contributor_rights = [ProductPerson.PERSON_TYPE_USER, ProductPerson.PERSON_TYPE_CONTRIBUTOR]
        if product_slug:
            product_team_persons = ProductPerson.objects \
                .filter(product__slug=product_slug) \
                .exclude(right__in=contributor_rights) \
                .distinct() \
                .values_list("person", flat=True)

            product_team = Person.objects.filter(pk__in=product_team_persons).all()

            contributors_persons = ProductPerson.objects \
                .annotate(finished_tasks=Count("person", filter=Q(person__taskclaim__kind=0))) \
                .filter(product__slug=product_slug, right__in=contributor_rights) \
                .order_by("-finished_tasks") \
                .distinct() \
                .values_list("person", flat=True)
            contributors = Person.objects.filter(pk__in=contributors_persons).all()

            return ProductPersonsType(product_team=product_team, contributors=contributors)
        else:
            return None

    def resolve_repositories(self, info, **kwargs):
        product_slug = kwargs.get("product_slug")
        if product_slug:
            qs = CodeRepository.objects.filter(product__slug=product_slug)
            return qs

        return CodeRepository.objects.all()


class ReviewQuery(ObjectType):
    reviews = graphene.List(ReviewType, person_slug=graphene.String())
    review = graphene.Field(ProductReviewType,
                            id=graphene.Int(),
                            person_slug=graphene.String())

    def resolve_review(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            review = Review.objects.get(pk=id)
            reviews = Review.objects.filter(product=review.product)

            obj = ProductReviewType()
            obj.review = review
            obj.product_reviews = reviews
            return obj

        return None

    def resolve_reviews(self, info, query=None, **kwargs):
        person_slug = kwargs.get('person_slug')
        if person_slug is not None:
            qs = Review.objects.filter(person__slug=person_slug).distinct('product')
            return qs
        return None


class PersonProfileQuery(ObjectType):
    person_profile = graphene.Field(PersonProfileType, person_slug=graphene.String())
    person_profiles = graphene.List(PersonProfileType, person_slug=graphene.String())

    def resolve_person_profile(self, info, **kwargs):
        try:
            person_slug = kwargs.get('person_slug')
            if person_slug is not None:
                return PersonProfile.objects.filter(person__user__username=person_slug).first()
            return None
        except:
            pass
        return None

    def resolve_person_profiles(self, info, query=None, **kwargs):
        person_slug = kwargs.get('person_slug')
        if person_slug is not None:
            qs = PersonProfile.objects.filter(person__username=person_slug)
            return qs
        return None


class PersonSocialQuery(ObjectType):
    person_socials = graphene.List(PersonSocialType, person_id=graphene.String())

    @staticmethod
    def resolve_person_socials(self, info, **kwargs):
        person_id = kwargs.get('person_id')

        if person_id is not None:
            return PersonSocial.objects.filter(person_id=person_id)

        return None


class TalentMutations(graphene.ObjectType):
    create_person = CreatePersonMutation.Field()
    update_person = UpdatePersonMutation.Field()
    sign_in_person = SignInPersonMutation.Field()
    save_avatar = AvatarUploadMutation.Field()
    delete_avatar = AvatarDeleteMutation.Field()
