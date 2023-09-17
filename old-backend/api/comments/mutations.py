import graphene
from api.comments.inputs import CommentInput
from api.comments.utils import create_comment
from api.decorators import is_current_person
from api.mutations import InfoStatusMutation
from comments.models import ChallengeComment, BugComment, IdeaComment, CapabilityComment
from ideas_bugs.models import Bug, Idea
from work.models import Challenge, Capability


class CommentMutation(InfoStatusMutation, graphene.Mutation):
    class Arguments:
        comment_input = CommentInput(required=True)

    def mutate(self, info, *args, **kwargs):
        pass


class CreateTaskCommentMutation(CommentMutation):

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        comment_input = kwargs.get("comment_input")
        success, message = create_comment(current_person, comment_input, Challenge, ChallengeComment)

        return CreateTaskCommentMutation(success=success, message=message)


class CreateBugCommentMutation(CommentMutation):

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        comment_input = kwargs.get("comment_input")
        success, message = create_comment(current_person, comment_input, Bug, BugComment)

        return CreateBugCommentMutation(success=success, message=message)


class CreateIdeaCommentMutation(CommentMutation):

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        comment_input = kwargs.get("comment_input")
        success, message = create_comment(current_person, comment_input, Idea, IdeaComment)

        return CreateIdeaCommentMutation(success=success, message=message)


class CreateCapabilityCommentMutation(CommentMutation):

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        comment_input = kwargs.get("comment_input")
        success, message = create_comment(current_person, comment_input, Capability, CapabilityComment)

        return CreateCapabilityCommentMutation(success=success, message=message)


class CommentMutations(graphene.ObjectType):
    create_task_comment = CreateTaskCommentMutation.Field()
    create_bug_comment = CreateBugCommentMutation.Field()
    create_idea_comment = CreateIdeaCommentMutation.Field()
    create_capability_comment = CreateCapabilityCommentMutation.Field()
