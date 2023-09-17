import graphene
from django.conf import settings
from django.contrib.auth import logout, login
from api.auth.authmachine_client import AuthMachineClient
from api.mutations import InfoStatusMutation
from api.talent.types import PersonType
from talent.models import Person


class LogoutUserMutation(InfoStatusMutation, graphene.Mutation):
    """Logout user from the system"""

    url = graphene.String()

    @staticmethod
    def mutate(self, info):
        user = info.context.user
        data = {
            "success": True,
            "message": "User was successfully log out"
        }

        if user.is_anonymous:
            return LogoutUserMutation(**data)
        try:
            person = Person.objects.filter(user=user).first()
            if person.test_user or not settings.AUTHMACHINE_URL:
                logout(info.context)
            else:
                client = AuthMachineClient(info.context)
                data["url"] = client.get_logout_url()
            return LogoutUserMutation(**data)
        except Person.DoesNotExist:
            return LogoutUserMutation(success=False,
                                      message="Person not exist in the system")


class FakeLoginMutation(InfoStatusMutation, graphene.Mutation):
    """Fake login user in the system"""

    class Arguments:
        person_id = graphene.String()

    person = graphene.Field(PersonType)

    @staticmethod
    def mutate(self, info, person_id):
        try:
            person = Person.objects.get(id=person_id)
            login(info.context, person.user)
            print(person, flush=True)
            return FakeLoginMutation(success=True, message="User was successfully log in", person=person)
        except Person.DoesNotExist:
            return FakeLoginMutation(success=False, message="User doesn't exist in the system")


class AuthMutation(graphene.ObjectType):
    logout = LogoutUserMutation.Field()
    fake_login = FakeLoginMutation.Field()
