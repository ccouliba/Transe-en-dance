from django import forms
from django.contrib.auth.models import User
from django.conf import settings
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
    