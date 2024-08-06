from django import forms
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import User

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

class RegisterForm(UserCreationForm):
	email = forms.EmailField(required=True)

	class Meta:
		model = User
		fields = ("username", "email", "password1", "password2")

	def save(self, commit=True):
		user = super().save(commit=False)
		user.email = self.cleaned_data["email"]
		if commit:
			user.save()
		return user

class AvatarUploadForm(forms.ModelForm):
	class Meta:
		model = User
		fields = ['avatar']
  

