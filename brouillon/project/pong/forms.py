from django import forms
from django.forms.widgets import PasswordInput

class UserLoginForm(forms.Form):
    username = forms.CharField(label='username', required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

class UserRegistrationForm(forms.Form):
    username = forms.CharField(label='username', required=True)
    email = forms.EmailField(label='mail', required=True)
    password = forms.CharField(widget=forms.PasswordInput, min_length=8, required=True)
    password2 = forms.CharField(label='Confirm password', widget=forms.PasswordInput, required=True)
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password2 = cleaned_data.get("password2")
        if password != password2:
            raise forms.ValidationError('password must match')
        
