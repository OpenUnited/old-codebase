from django import forms


class CreatePersonForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()
