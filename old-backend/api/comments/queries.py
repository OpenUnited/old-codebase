import graphene
from graphene import ObjectType
from api.comments.utils import resolve_comments
from comments.models import ChallengeComment, IdeaComment, BugComment, CapabilityComment
from ideas_bugs.models import Idea, Bug
from work.models import Challenge, Capability


class CommentsQuery(ObjectType):
    challenge_comments = graphene.JSONString(object_id=graphene.Int())
    idea_comments = graphene.JSONString(object_id=graphene.Int())
    bug_comments = graphene.JSONString(object_id=graphene.Int())
    capability_comments = graphene.JSONString(object_id=graphene.Int())

    @staticmethod
    def resolve_challenge_comments(*args, **kwargs):
        return resolve_comments(kwargs.get("object_id"), Challenge, ChallengeComment)

    @staticmethod
    def resolve_idea_comments(*args, **kwargs):
        return resolve_comments(kwargs.get("object_id"), Idea, IdeaComment)

    @staticmethod
    def resolve_bug_comments(*args, **kwargs):
        return resolve_comments(kwargs.get("object_id"), Bug, BugComment)

    @staticmethod
    def resolve_capability_comments(*args, **kwargs):
        return resolve_comments(kwargs.get("object_id"), Capability, CapabilityComment)
