import graphene

from .helpers import create_person, update_person
from .types import PersonInput
from talent.models import Person, PersonAvatar, PersonProfile
from users.models import User
from django.contrib.auth import authenticate
from entitlements.exceptions import ValidationError
from ..decorators import is_current_person
from ..images.utils import upload_photo


class CreatePersonMutation(graphene.Mutation):
    class Arguments:
        person_input = PersonInput(required=True)

    status = graphene.Boolean()
    message = graphene.String()

    @staticmethod
    @is_current_person
    def mutate(current_person, *args, **kwargs):
        person_input = kwargs.get('person_input')
        try:
            if not Person.objects.filter(email_address=current_person.email_address).exists():
                return CreatePersonMutation(status=False, message='User is not found')
            person = Person.objects.get(email_address=current_person.email_address)
            create_person(person, person_input)
            return CreatePersonMutation(status=True, message='Successfully created')
        except ValidationError as e:
            return CreatePersonMutation(status=False, message=str(e))
        except Exception as e:
            print(e, flush=True)
            return CreatePersonMutation(status=False, message='Unknown error')

    @staticmethod
    def sign_up(person_input, slug_increment):
        available_slug = CreatePersonMutation.get_available_slug(person_input, slug_increment)
        is_exists_person_by_slug = Person.objects.filter(slug=available_slug).exists()
        is_exists_user_by_slug = User.objects.filter(username=available_slug).exists()

        if is_exists_person_by_slug or is_exists_user_by_slug:
            CreatePersonMutation.sign_up(person_input, slug_increment + 1)
        else:
            user = User.objects.create_user(
                username=available_slug,
                email=person_input.email_address,
                password=person_input.password
            )

            person = Person(
                first_name=f'{person_input.first_name} {person_input.last_name}',
                email_address=person_input.email_address,
                slug=available_slug,
                user=user
            )
            person.save()

    @staticmethod
    def get_available_slug(person_input, slug_increment):
        return person_input.get_slug() + ('' if slug_increment == 0 else f'-{slug_increment}')


class UpdatePersonMutation(graphene.Mutation):
    class Arguments:
        person_input = PersonInput(required=True)

    status = graphene.Boolean()
    message = graphene.String()

    @staticmethod
    @is_current_person
    def mutate(current_person, *args, **kwargs):
        person_input = kwargs.get('person_input')
        try:
            if not Person.objects.filter(email_address=current_person.email_address).exists():
                return UpdatePersonMutation(status=False, message='User is not found')
            person = Person.objects.prefetch_related("profile", "preferences").get(email_address=current_person.email_address)
            update_person(person, person_input)
            return UpdatePersonMutation(status=True, message='Successfully updated')
        except ValidationError as e:
            return UpdatePersonMutation(status=False, message=str(e))
        except Exception as e:
            print(e, flush=True)
            return UpdatePersonMutation(status=False, message=str(e))


class AvatarUploadMutation(graphene.Mutation):
    class Arguments:
        avatar = graphene.String(required=True)

    status = graphene.Boolean()
    message = graphene.String()
    avatar_url = graphene.String()
    avatar_id = graphene.Int()

    @staticmethod
    @is_current_person
    def mutate(current_person, *args, **kwargs):
        avatar = kwargs.get('avatar', None)
        if not avatar:
            return AvatarUploadMutation(status=False, message="Avatar is not provided", avatar_url="", avatar_id=None)
        try:
            avatar_url = upload_photo(avatar, 'avatar')
            avatar = PersonAvatar.objects.create(avatar=avatar_url)
            return AvatarUploadMutation(status=True, message="Successfully uploaded", avatar_url=avatar.avatar,
                                        avatar_id=avatar.pk)
        except Exception as e:
            return AvatarUploadMutation(status=False, message=str(e), avatar_url="", avatar_id=None)


class AvatarDeleteMutation(graphene.Mutation):
    class Arguments:
        person_slug = graphene.String(required=True)

    status = graphene.Boolean()
    message = graphene.String()

    @staticmethod
    @is_current_person
    def mutate(current_person, *args, **kwargs):
        slug = kwargs.get('person_slug', None)
        if not slug:
            return AvatarDeleteMutation(status=False, message="Slug is not provided")
        try:
            person_profile = PersonProfile.objects.get(person__slug=slug)
            avatar = person_profile.avatar
            person_profile.avatar = None

            person_profile.save()
            avatar.delete()

            return AvatarDeleteMutation(status=True, message="Successfully deleted")
        except Exception as e:
            return AvatarDeleteMutation(status=False, message=str(e))


class SignInPersonMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    status = graphene.Boolean()

    @staticmethod
    def mutate(*args, **kwargs):
        email = kwargs.get('email')
        password = kwargs.get('password')

        try:
            user = authenticate(email=email, password=password)
            if user is not None:
                return SignInPersonMutation(status=True)
            else:
                return SignInPersonMutation(status=False)
        except Exception as e:
            print(e)
            return CreatePersonMutation(status=False, message='Unknown error')
