import datetime
from django.db import models
from django.utils import timezone
from django.forms import ModelForm
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models import UniqueConstraint

# class User(AbstractUser): #https://openclassrooms.com/fr/courses/7192426-allez-plus-loin-avec-le-framework-django/7386368-personnalisez-le-modele-utilisateur

class User(AbstractUser):
	# Ajout d'un champ many-to-many pour les groupes auxquels cet utilisateur appartient
	groups = models.ManyToManyField(
		Group,  # Le modele de groupe du framework d'authentification de Django
		related_name='pong_user_set',  # Nom unique pour eviter les conflits avec l'application d'authentification par defaut de Django
		blank=True,  # Champ optionnel, permet de laisser ce champ vide
		help_text='The groups this user belongs to.',  # Texte d'aide affiche dans l'interface d'administration
		related_query_name='pong_user',  # Nom utilise pour les requetes inverses
	)
	# Ajout d'un champ many-to-many pour les permissions specifiques de cet utilisateur
	user_permissions = models.ManyToManyField(
		Permission,  # Le modele de permission du framework d'authentification de Django
		related_name='pong_user_permissions_set',  # Nom unique pour eviter les conflits avec l'application d'authentification par defaut de Django
		blank=True,  # Champ optionnel, permet de laisser ce champ vide
		help_text='Specific permissions for this user.',  # Texte d'aide affiche dans l'interface d'administration
		related_query_name='pong_user_permissions',  # Nom utilise pour les requetes inverses
	)
	# Methode __str__ : retourner une representation en chaine de caracteres de l'utilisateur
	def __str__(self):
		return self.username 

class Player(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	# avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	def __str__(self):
		return self.user.username
	# def __init__(self):
		# self.friends = []
	# def became_friend_with(self, other_player):
	# 	self.friends.append(other_player)
	# 	other_player.friends.push(self)


class Friendship(models.Model):
	id_player1 = models.ForeignKey(Player, related_name='friendship_sender', on_delete=models.CASCADE)
	id_player2 = models.ForeignKey(Player, related_name='friendship_receiver', on_delete=models.CASCADE)

	# Utiliser UniqueConstraint pour garantir l'unicité de la paire id_player1 et id_player2
	# class Constraints(models.Model):
	#     constraints = [
	#         UniqueConstraint(fields=['id_player1', 'id_player2'], name='unique_friendship')
	#     ]
	class Meta: #Model Meta is basically the inner class of your model class https://www.geeksforgeeks.org/meta-class-in-models-django/
		constraints = [
			UniqueConstraint(fields=['id_player1', 'id_player2'], name='unique_friendship')#https://docs.djangoproject.com/en/5.0/ref/models/constraints/#fields
		]
	def __str__(self):
		return f"{self.id_player1} is friend with {self.id_player2}"



class Game(models.Model):
	date = models.DateTimeField(auto_now_add=True)
	winner = models.ForeignKey(Player, related_name='won_games', on_delete=models.SET_NULL, null=True, blank=True)
	status = models.CharField(max_length=20)  # Values can be 'started', 'finished', 'canceled'

	def __str__(self):
		return f"Game {self.id} on {self.date}"

class Play(models.Model):
	player = models.ForeignKey(Player, on_delete=models.CASCADE)
	game = models.ForeignKey(Game, on_delete=models.CASCADE)
	score = models.IntegerField()
	class Meta:
		constraints = [
			UniqueConstraint(fields=['player', 'game'], name='unique_player_game')
		]

	def __str__(self):
		return f"{self.player} played in {self.game} with score {self.score}"

class Tournament(models.Model):
	name = models.CharField(max_length=100)
	is_started = models.BooleanField(default=False)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
	winner = models.ForeignKey(Player, related_name='won_tournaments', on_delete=models.SET_NULL, null=True, blank=True)

	def __str__(self):
		return self.name

class Participate(models.Model):
	player = models.ForeignKey(Player, on_delete=models.CASCADE)
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	order_of_turn = models.IntegerField()
	alias = models.CharField(max_length=50)
	class Meta:
		constraints = [
			UniqueConstraint(fields=['player', 'tournament'], name='unique_player_tournament')
		]
	def __str__(self):
		return f"{self.player} participates in {self.tournament} as {self.alias}, order of turn: {self.order_of_turn}"
 

class Composed(models.Model):
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	game = models.ForeignKey(Game, on_delete=models.CASCADE)
	game_number = models.IntegerField()
	class Meta:
		constraints = [
			UniqueConstraint(fields=['tournament', 'game'], name='unique_game_tournament')
		]
	def __str__(self):
		return f"Game {self.game_number} in {self.tournament}"


		
### Carrel's code below


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
