import datetime
from django.db import models
from django.utils import timezone
from django.forms import ModelForm
# from django.contrib.auth.models import AbstractUser

# Create your models here.

class Login(models.Model):
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True, db_column="mail")
    password = models.CharField(max_length=42)
    def __str__(self):
        return self.username

# class User(AbstractUser):
#     pass
#     groups = models.ManyToManyField(Group, related_name='custom_user_groups')
#     login = models.CharField(unique=True, max_length=100)

# class RegisterForm(ModelForm):
#     """Form definition for MODELNAME."""
#     class Meta:
#         """Meta definition for MODELNAMEform."""
#         model = Login
#         fields = ('__all__')
    
# class LoginForm(ModelForm):
#     class Meta:
#         """Meta definition for MODELNAMEform."""
#         model = Login
#         # exclude = ('email',)
#         fields = ('username', 'password',)
        

# class Choice(models.Model):
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     choice_text = models.CharField(max_length=200)
#     votes = models.IntegerField(default=0)
#     def __str__(self):
#         return self.choice_text