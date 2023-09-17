import graphene
from graphql_jwt.decorators import login_required
from api.decorators import is_current_person
from api.ideas_bugs.inputs import IdeaInput, BugInput, VoteInput, ChangeStatusInput
from api.ideas_bugs.types import IdeaType, BugType
from api.ideas_bugs.utils import create_idea_or_bug_history, vote_to_idea_or_bug
from api.mutations import InfoStatusMutation, ObjectExistsMutation
from ideas_bugs.models import Idea, Bug, IdeaVote, BugVote, IdeaStatusHistory, BugStatusHistory


class CreateIdeaMutation(graphene.Mutation, InfoStatusMutation):
    """Create an idea"""
    class Arguments:
        input = IdeaInput(required=True)

    idea = graphene.Field(IdeaType)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        input_data = kwargs.get("input")
        # idea_type = input_data["idea_type"]
        # if idea_type not in range(0, 4):
        #     return CreateIdeaMutation(success=False, message="Not correct idea type")

        idea = Idea.objects.create(
            person=current_person,
            **input_data
        )

        return CreateIdeaMutation(success=True, message="Idea was created successfully", idea=idea)


class UpdateIdeaMutation(graphene.Mutation, InfoStatusMutation):
    """Update an idea"""
    class Arguments:
        id = graphene.Int()
        input = IdeaInput(required=True)

    idea = graphene.Field(IdeaType)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        pk = kwargs.get("id")
        input_data = kwargs.get("input")
        # idea_type = input_data["idea_type"]
        #
        # if idea_type not in range(0, 4):
        #     return UpdateIdeaMutation(success=False, message="Not correct idea type")

        idea = Idea.objects.filter(pk=pk)
        if idea:
            idea.update(
                person=current_person,
                **input_data
            )

            return UpdateIdeaMutation(success=True, message="Idea was updated successfully", idea=idea[0])
        else:
            return UpdateIdeaMutation(success=False, message="Object doesn't exist")


class DeleteIdeaMutation(ObjectExistsMutation, graphene.Mutation):
    """Delete an idea"""
    class Arguments:
        id = graphene.ID()

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        pk = kwargs.get("id")
        try:
            Idea.objects.get(id=pk).delete()
            is_exists = True
        except Idea.DoesNotExist:
            is_exists = False
        return DeleteIdeaMutation(is_exists)


class CreateBugMutation(graphene.Mutation, InfoStatusMutation):
    """Create a bug"""
    class Arguments:
        input = BugInput(required=True)

    bug = graphene.Field(BugType)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        input_data = kwargs.get("input")

        bug = Bug.objects.create(
            person=current_person,
            **input_data
        )

        return CreateBugMutation(success=True, message="Bug was created successfully", bug=bug)


class UpdateBugMutation(graphene.Mutation, InfoStatusMutation):
    """Update a bug"""
    class Arguments:
        id = graphene.Int()
        input = BugInput(required=True)

    bug = graphene.Field(BugType)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        pk = kwargs.get("id")
        input_data = kwargs.get("input")

        bug = Bug.objects.filter(pk=pk)
        if bug:
            bug.update(
                person=current_person,
                **input_data
            )

            return UpdateBugMutation(success=True, message="Bug was updated successfully", bug=bug[0])
        else:
            return UpdateBugMutation(success=False, message="Object doesn't exist")


class DeleteBugMutation(ObjectExistsMutation, graphene.Mutation):
    """Delete a bug"""
    class Arguments:
        id = graphene.ID()

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        pk = kwargs.get("id")
        try:
            Bug.objects.get(id=pk).delete()
            is_exists = True
        except Bug.DoesNotExist:
            is_exists = False
        return DeleteBugMutation(is_exists)


class VoteIdeaMutation(graphene.Mutation, InfoStatusMutation):
    """Vote an idea """
    class Arguments:
        input = VoteInput(required=True)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        return vote_to_idea_or_bug(
            current_person=current_person,
            input_data=kwargs.get("input"),
            vote_model=IdeaVote,
            parent_model=Idea,
            parent_type="idea",
            mutation=VoteIdeaMutation
        )


class VoteBugMutation(graphene.Mutation, InfoStatusMutation):
    """Vote a bug """
    class Arguments:
        input = VoteInput(required=True)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        return vote_to_idea_or_bug(
            current_person=current_person,
            input_data=kwargs.get("input"),
            vote_model=BugVote,
            parent_model=Bug,
            parent_type="bug",
            mutation=VoteBugMutation
        )


class ChangeIdeaStatusMutation(graphene.Mutation, InfoStatusMutation):
    """Change an idea status"""
    class Arguments:
        input = ChangeStatusInput(required=True)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        return create_idea_or_bug_history(
            current_person=current_person,
            input_data=kwargs.get("input"),
            history_model=IdeaStatusHistory,
            parent_model=Idea,
            parent_type="idea",
            mutation=ChangeIdeaStatusMutation,
        )


class ChangeBugStatusMutation(graphene.Mutation, InfoStatusMutation):
    """Change a bug status"""
    class Arguments:
        input = ChangeStatusInput(required=True)

    @staticmethod
    @login_required
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        return create_idea_or_bug_history(
            current_person=current_person,
            input_data=kwargs.get("input"),
            history_model=BugStatusHistory,
            parent_model=Bug,
            parent_type="bug",
            mutation=ChangeBugStatusMutation,
        )


class IdeaBugMutation(graphene.ObjectType):
    create_idea = CreateIdeaMutation.Field()
    update_idea = UpdateIdeaMutation.Field()
    delete_idea = DeleteIdeaMutation.Field()

    create_bug = CreateBugMutation.Field()
    update_bug = UpdateBugMutation.Field()
    delete_bug = DeleteBugMutation.Field()

    vote_idea = VoteIdeaMutation.Field()
    vote_bug = VoteBugMutation.Field()

    change_idea_status = ChangeIdeaStatusMutation.Field()
    change_bug_status = ChangeBugStatusMutation.Field()
