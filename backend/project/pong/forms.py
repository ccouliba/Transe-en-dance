from django import forms
from django.contrib.auth.models import User
from .models import User
from django.contrib.auth.forms import UserCreationForm

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

# class RegisterForm(forms.ModelForm):
#     password = forms.CharField(widget=forms.PasswordInput)
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password']
		
#     def clean(self):
#         cleaned_data = super().clean()
#         password = cleaned_data.get("password")
#         password_confirm = cleaned_data.get("password_confirm")

#         if password and password_confirm and password != password_confirm:
#             self.add_error('password_confirm', "Passwords do not match")

#         return cleaned_data
	
	
	
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
		
		
