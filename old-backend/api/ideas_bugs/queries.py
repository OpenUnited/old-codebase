import graphene
from django.db.models import Count, Q
from graphene import ObjectType
from api.decorators import get_logged_person
from api.ideas_bugs.types import IdeaType, BugType
from ideas_bugs.models import Bug, Idea
from talent.models import ProductPerson
from work.models import Product


class IdeaBugQuery(ObjectType):
    bugs = graphene.List(BugType, product_slug=graphene.String())
    bug = graphene.Field(BugType, id=graphene.Int())

    ideas = graphene.List(IdeaType, product_slug=graphene.String())
    idea = graphene.Field(IdeaType, id=graphene.Int())

    @staticmethod
    @get_logged_person
    def resolve_bugs(current_person, info, *args, product_slug):
        filter_data = dict()
        queryset = Bug.objects.none()
        if product_slug:
            filter_data["product__slug"] = product_slug

        if current_person:
            product_owner = Product.objects.filter(slug=product_slug, owner__person=current_person).exists()
            product_roles = ProductPerson.objects.filter(
                product__slug=product_slug,
                person=current_person,
                right__in=[ProductPerson.PERSON_TYPE_PRODUCT_ADMIN,
                           ProductPerson.PERSON_TYPE_PRODUCT_MANAGER]).exists()

            if not any([current_person.user.is_superuser, product_owner, product_roles]):
                # show user posted security bugs
                queryset = Bug.objects.filter(**filter_data, person=current_person, bug_type=True).all()
                filter_data['bug_type'] = False

        else:
            filter_data['bug_type'] = False

        queryset = (queryset | Bug.objects.filter(**filter_data)).distinct()

        return queryset\
            .annotate(vote_up=Count("bugvote", filter=Q(bugvote__vote_type=0)))\
            .order_by("-vote_up")\
            .all()

    def resolve_bug(self, info, id):
        return Bug.objects.get(id=id)

    def resolve_ideas(self, info, product_slug):
        filter_data = dict()
        if product_slug:
            filter_data["product__slug"] = product_slug

        return Idea.objects.filter(**filter_data)\
            .annotate(vote_up=Count("ideavote", filter=Q(ideavote__vote_type=0)))\
            .order_by("-vote_up")\
            .all()

    def resolve_idea(self, info, id):
        return Idea.objects.get(id=id)
