import datetime
from django.db import models
from django.utils import timezone
from django.forms import ModelForm
from django.contrib.auth.models import AbstractUser

# Create your models here.


# class User(AbstractUser): #https://openclassrooms.com/fr/courses/7192426-allez-plus-loin-avec-le-framework-django/7386368-personnalisez-le-modele-utilisateur
# 	# champs id, username, email, et password => deja inclus par AbstractUser
# 	# inserer champs supplementaires si necessaire
# 	pass
# 	def __str__(self): #definir mon objet en chaine de caractere (ce qui permet d'avoir la chaine de caractere dans l'interface admin)
# 		return self.username

# # Definir le modele Player, qui herite de la classe Model de base de Django
# class Player(models.Model):
# 	# Creer une relation one-to-one avec le modele User
# 	# Si l'utilisateur (User) est supprime, le joueur (Player) associe sera aussi supprime (CASCADE)
# 	user = models.OneToOneField(User, on_delete=models.CASCADE)

# 	# Definir un champ avatar pour stocker une image pour le joueur
# 	# L'image sera telechargee dans le repertoire 'avatars/'
# 	# Le champ peut etre nul ou laisse vide
# 	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

# 	# Definir la representation en chaine de caracteres de l'objet Player
# 	# Cette methode renvoie le nom d'utilisateur (username) de l'utilisateur associe
# 	def __str__(self):
# 		return self.user.username





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
