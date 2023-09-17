import graphene
from graphene_django import DjangoObjectType
from ideas_bugs.models import Idea, Bug


class IdeaType(DjangoObjectType):
    idea_type = graphene.Int()
    vote_up = graphene.Int()

    class Meta:
        model = Idea

    def resolve_vote_up(self, info):
        return self.ideavote_set.filter(vote_type=0).count()


class BugType(DjangoObjectType):
    vote_up = graphene.Int()

    class Meta:
        model = Bug

    def resolve_vote_up(self, info):
        return self.bugvote_set.filter(vote_type=0).count()
