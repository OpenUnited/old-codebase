from api import exceptions
from api.utils import get_current_person


def is_current_person(function):
    def wrap(request, *args, **kwargs):
        current_person = get_current_person(*args)
        if not current_person:
            raise exceptions.PermissionDenied(message="The person is undefined, please login to perform this action")

        return function(current_person, request, *args, **kwargs)
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


def get_logged_person(function):
    def wrap(request, *args, **kwargs):
        current_person = get_current_person(*args)

        return function(current_person, request, *args, **kwargs)
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap