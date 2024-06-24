from django import forms
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
class SetLanguageForm(forms.Form):
    language = forms.ChoiceField(
        choices=[
            ('en', _('English')),
            ('fr', _('French')),
            ('it', _('Italian')),
            ('es', _('Spanish')),
            ('de', _('Deutsch')),
        ],
        label=_('Select your language')
    )

# class UserLoginForm(forms.Form):
#     username = forms.CharField(label='username', required=True)
#     password = forms.CharField(widget=forms.PasswordInput, required=True)

# class UserRegistrationForm(forms.Form):
#     username = forms.CharField(label='username', required=True)
#     email = forms.EmailField(label='mail', required=True)
#     password = forms.CharField(widget=forms.PasswordInput, min_length=8, required=True)
#     password2 = forms.CharField(label='Confirm password', widget=forms.PasswordInput, required=True)
#     def clean(self):
#         cleaned_data = super().clean()
#         password = cleaned_data.get("password")
#         password2 = cleaned_data.get("password2")
#         if password != password2:
#             raise forms.ValidationError('password must match')
        
        
