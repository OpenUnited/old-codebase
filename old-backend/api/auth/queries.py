import graphene
from graphene import ObjectType
from django.conf import settings
from .authmachine_client import AuthMachineClient


class AuthQuery(ObjectType):
    get_authmachine_login_url = graphene.String()
    get_authmachine_register_url = graphene.String()

    def resolve_get_authmachine_login_url(self, info):
        if settings.AUTHMACHINE_URL:
            client = AuthMachineClient(info.context)
            return client.get_authorization_url()
        else:
            return None

    def resolve_get_authmachine_register_url(self, info):
        if settings.AUTHMACHINE_URL:
            client = AuthMachineClient(info.context)
            return client.get_register_url()
        else:
            return None
