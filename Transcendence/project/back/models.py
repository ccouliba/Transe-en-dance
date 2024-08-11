import datetime
from django.db import models
from django.utils import timezone
# from django.forms import ModelForm
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models import UniqueConstraint

# class User(AbstractUser): #https://openclassrooms.com/fr/courses/7192426-allez-plus-loin-avec-le-framework-django/7386368-personnalisez-le-modele-utilisateur

class User(AbstractUser):
	creation_date = models.DateTimeField(default=timezone.now)  # Date de creation de l'utilisateur
	langue = models.CharField(max_length=10, blank=True, null=True)  # Langue de l'utilisateur
	avatar = models.CharField(max_length=255, blank=True, null=True)  # URL ou chemin de l'avatar de l'utilisateur
	friends = models.ManyToManyField('self', symmetrical=True, blank=True)  # Champ pour les amis

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


#class qui permet de gerer les demandes d'amis. Si demande acceptee alors sauvegarde l'ami dans friends (cf. class user et dans bdd : `pong_user_friends``) 
class Friendship(models.Model):
	id_user_1 = models.ForeignKey(User, related_name='friendship_sender', on_delete=models.CASCADE, null = True, blank = True)
	id_user_2 = models.ForeignKey(User, related_name='friendship_receiver', on_delete=models.CASCADE, null = True, blank = True)

	class Meta: #Model Meta is basically the inner class of your model class https://www.geeksforgeeks.org/meta-class-in-models-django/
		constraints = [
			UniqueConstraint(fields=['id_user_1', 'id_user_2'], name='unique_friendship')#https://docs.djangoproject.com/en/5.0/ref/models/constraints/#fields
		]
	def __str__(self):
		return f"{self.id_user_1} is friend with {self.id_user_2}"

class Game(models.Model):
	player1 = models.ForeignKey(User, related_name='player1_games', on_delete=models.CASCADE,  null=True, blank=True)
	player2 = models.ForeignKey(User, related_name='player2_games', on_delete=models.CASCADE,  null=True, blank=True)
	player1_score = models.IntegerField(default=0)
	player2_score = models.IntegerField(default=0)
	status = models.CharField(max_length=20, choices=[('started', 'Started'), ('finished', 'Finished'), ('canceled', 'Canceled')])
	winner = models.ForeignKey(User, related_name='won_games', on_delete=models.SET_NULL, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True,  null=True, blank=True)

	def __str__(self):
		return f"Game {self.id}: {self.player1} vs {self.player2}"
	
class Tournament(models.Model):
	name = models.CharField(max_length=100)
	is_started = models.BooleanField(default=False)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
	winner = models.ForeignKey(User, related_name='won_tournaments', on_delete=models.SET_NULL, null=True, blank=True)

	def __str__(self):
		return self.name

class Participate(models.Model):
	player = models.ForeignKey(User, on_delete=models.CASCADE)
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	order_of_turn = models.IntegerField()
	alias = models.CharField(max_length=50)

	class Meta:
		constraints = [
			models.UniqueConstraint(fields=['player', 'tournament'], name='unique_player_tournament')
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
