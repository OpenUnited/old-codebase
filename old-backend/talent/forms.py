from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from entitlements.exceptions import ValidationError as ValidError
from license.validation import validate_development_edition


class UserCreationNewForm(UserCreationForm):

    def clean(self):
        # check if current instance is not developer edition
        try:
            validate_development_edition("user")
        except ValidError as e:
            raise ValidationError(e)
