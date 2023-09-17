import graphene
from pages.models import Page
from api.pages.types import PageType


class PagesQuery(graphene.ObjectType):
    page = graphene.Field(PageType, slug=graphene.String())

    def resolve_page(self, info, slug):
        return Page.objects.get(slug=slug)
