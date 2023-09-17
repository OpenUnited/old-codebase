from graphene_django import DjangoObjectType
from pages.models import Page


class PageType(DjangoObjectType):
    class Meta:
        model = Page
