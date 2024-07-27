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
  


# class TournamentCreationForm(forms.ModelForm):
# 	class Meta:
# 		model = Tournament
# 		fields = ['name']

# 	participants = forms.CharField(widget=forms.Textarea, help_text="Enter user names and aliases, one per line. Format: username,alias")

# 	def clean_participants(self):
# 		data = self.cleaned_data['participants']
# 		lines = data.split('\n')
# 		participants = []

# 		if len(lines) < 2:
# 			raise ValidationError("The tournament must have at least 2 participants.")
# 		if len(lines) > 8:
# 			raise ValidationError("The tournament cannot have more than 8 participants.")

# 		for line in lines:
# 			if line.strip():
# 				try:
# 					username, alias = line.strip().split(',')
# 					user = User.objects.get(username=username.strip())
# 					participants.append((user, alias.strip()))
# 				except ValueError:
# 					raise ValidationError(f"Invalid format for line: {line}. Use 'username,alias'.")
# 				except User.DoesNotExist:
# 					raise ValidationError(f"The user {username} doesn't exist")

# 		return participants

# 	def save(self, commit=True):
# 		tournament = super().save(commit=False)
# 		if commit:
# 			tournament.save()
# 			for user, alias in self.cleaned_data['participants']:
# 				TournamentParticipant.objects.create(
# 					tournament=tournament,
# 					user=user,
# 					alias=alias
# 				)
# 		return tournament