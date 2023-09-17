import json
import os
import uuid
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.urls import reverse
from oic import rndstr
from oic.oauth2 import AuthorizationResponse
from oic.oic import Client
from oic.utils.authn.client import ClientSecretBasic, ClientSecretPost


class OICClient(Client):
    def http_request(self, *args, **kwargs):
        # Set requests timeout for all http connections pyoidc makes
        kwargs["timeout"] = 20
        return super(Client, self).http_request(*args, **kwargs)


class AuthMachineClient(object):
    def __init__(self, request):
        self.client = self.get_client()
        self.state = uuid.uuid4()
        self.request = request
        if request.is_secure():
            proto = 'https://'
        else:
            proto = 'http://'
        # self.host = proto + request.get_host()
        self.host = settings.FRONT_END_SERVER

    def get_client(self):
        client = OICClient(client_authn_method={
            'client_secret_post': ClientSecretPost,
            'client_secret_basic': ClientSecretBasic
        })
        client.provider_config(settings.AUTHMACHINE_URL)
        client.client_id = settings.AUTHMACHINE_CLIENT_ID
        client.client_secret = settings.AUTHMACHINE_CLIENT_SECRET
        client.verify_ssl = True
        return client

    def get_authorization_url(self):
        nonce = rndstr()

        args = {
            'client_id': self.client.client_id,
            'response_type': 'code',
            'scope': settings.AUTHMACHINE_SCOPE,
            'claims': json.dumps({
                'authmachine_permissions': ['object1', 'object2'],
            }),
            'nonce': nonce,
            'redirect_uri': self.host + reverse('oidc-callback'),
            'state': self.state,
            'register': 0
        }
        url = self.client.provider_info['authorization_endpoint'] + '?' + urlencode(args, True)
        return url

    def get_register_url(self):
        nonce = rndstr()

        args = {
            'client_id': self.client.client_id,
            'response_type': 'code',
            'scope': settings.AUTHMACHINE_SCOPE,
            'claims': json.dumps({
                'authmachine_permissions': ['object1', 'object2'],
            }),
            'nonce': nonce,
            'redirect_uri': self.host + reverse('oidc-callback'),
            'state': self.state,
            'register': 1
        }
        url = self.client.provider_info['registration_endpoint'] + '?' + urlencode(args, True)
        return url

    def get_logout_url(self):
        args = {
            'scope': settings.AUTHMACHINE_SCOPE,
            'post_logout_redirect_uri': self.host + reverse('auth-logout-callback'),
            'state': self.state,
            'revoke_tokens': 1
        }
        url = self.client.provider_info['end_session_endpoint'] + '?' + urlencode(args, True)
        return url

    def get_access_token(self, aresp):
        """Gets access token from AuthMachine.
        Args:
            aresp (AuthorizationResponse):
        """
        args = {
            'code': aresp['code'],
            'client_id': self.client.client_id,
            'client_secret': self.client.client_secret,
            'redirect_uri': self.host + reverse('oidc-callback')
        }

        return self.client.do_access_token_request(
            scope=settings.AUTHMACHINE_SCOPE,
            state=aresp['state'],
            request_args=args,
            authn_method='client_secret_post')

    def get_userinfo(self, authorization_response):
        """Returns Open ID userinfo as dict.
        """

        user_info = self.client.do_user_info_request(
            state=authorization_response['state'],
            authn_method='client_secret_post')
        return user_info.to_dict()

    def get_authorization_response(self):
        authorization_response = self.client.parse_response(
            AuthorizationResponse,
            info=self.request.GET,
            sformat='dict')
        return authorization_response

    def do_api_request(self, method, url, payload=None, query_params=None, **kwargs):
        assert settings.AUTHMACHINE_API_TOKEN is not None, "Can't perform an API Request: API Token not specified"
        absolute_url = os.path.join(settings.AUTHMACHINE_URL, url)

        if payload:
            kwargs['data'] = json.dumps(payload, sort_keys=True)

        if query_params:
            absolute_url += '?' + urlencode(query_params, doseq=True)

        headers = kwargs.pop('headers', {})
        headers['Content-Type'] = 'application/json'
        headers['Authorization'] = 'Token %s' % settings.AUTHMACHINE_API_TOKEN
        response = requests.request(method=method, url=absolute_url, headers=headers, **kwargs)

        return response

    def get_permissions(self, user_id, objects=None):
        if objects is None:
            objects = []
        response = self.do_api_request('get', 'api/scim/v1/Users/{}/permissions'.format(user_id),
                                       query_params={'object': objects})
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return {}

    def check_token_revoked_status(self, token):
        args = {
            'client_id': self.client.client_id,
            'client_secret': self.client.client_secret,
            'access_token': token['access_token'],
            'grant_type': 'check_token_revoked',
        }
        response = requests.request(method="POST",
                                    url=os.path.join(settings.AUTHMACHINE_URL, "oidc/token"),
                                    data=args)

        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return None

    def get_register(self, response):
        try:
            return int(response["register"]) == 1
        except KeyError as e:
            print(e, flush=True)
            return False
        except Exception as e:
            print(e, flush=True)
            return False
