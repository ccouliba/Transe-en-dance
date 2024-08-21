from django.db import models # un model => une table dans la bdd et un attribut => une colonne 
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models import UniqueConstraint
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import UniqueConstraint
from django.utils.translation import gettext_lazy as _
from django.db.models import F #query expressions F() : mettre à jour ou manipuler les champs de la bdd dynamiquement
from django.db.models import Q #pour executer des requetes dans la bdd avec des operations comme OR ou AND
import os

# explication AbstractUser : #https://openclassrooms.com/fr/courses/7192426-allez-plus-loin-avec-le-framework-django/7386368-personnalisez-le-modele-utilisateur
class User(AbstractUser):
	creation_date = models.DateTimeField(default=timezone.now) 
	langue = models.CharField(max_length=10, blank=True, null=True, default="en")  
	avatar = models.CharField(max_length=255, blank=True, null=True)  # avatar de l'utilisateur est stocke sous forme de chemin ou URL
	friends = models.ManyToManyField('self', symmetrical=True, blank=True)  # manytomany => un ami peut avoir plusieurs amis et chaque ami peut etre lie à plusieurs amis. Et symmetrical => si  A est ami  B alors B sera automatiquement ami  A 
	is_online = models.BooleanField(default=False)
	email = models.EmailField(_("email address"), unique=True, blank=True)
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	last_activity = models.DateTimeField(default=timezone.now)
	wins = models.IntegerField(default=0)
	losses = models.IntegerField(default=0)
	is_deleted = models.BooleanField(default=False)
	deleted_at = models.DateTimeField(null=True, blank=True)
 
	# les groupes auxquels cet utilisateur appartient
	groups = models.ManyToManyField(
		Group,  # Le modele de groupe du framework d'authentification de Django
		related_name='pong_user_set',  # Nom unique pour eviter les conflits avec l'application d'authentification par defaut de Django
		blank=True,  
		help_text='The groups this user belongs to.',  # Texte d'aide affiche dans l'interface d'administration
		related_query_name='pong_user',  
	)
 
	# les permissions specifiques de cet utilisateur
	user_permissions = models.ManyToManyField(
		Permission,  # Le modele de permission du framework d'authentification de Django
		related_name='pong_user_permissions_set',  # Nom unique pour eviter les conflits avec l'application d'authentification par defaut de Django
		blank=True, 
		help_text='Specific permissions for this user.',  # Texte d'aide affiche dans l'interface d'administration
		related_query_name='pong_user_permissions', 
	)
 
	# Methode __str__ : retourner une representation en chaine de caracteres de l'utilisateur
	def __str__(self):
		return self.username 

	def was_active_now(self):
		self.last_activity = timezone.now()

	def get_avatar_url(self):
		if self.avatar and hasattr(self.avatar, 'url'): #The hasattr() method returns true if an object has the given named attribute and false if it does not.
			if self.avatar.name.startswith('http'):
				return self.avatar.name
			else:
				return self.avatar.url
		else:
			return f"{settings.STATIC_URL}pong/images/default_avatar.png" #f-strings => inserer variables ou expressions 

	@property #https://docs.python.org/3/library/functions.html#property
	#permet d'appeler la methode comme un attribut => player.total_games au lieu de player.total_games()
	def total_games(self):
		return self.wins + self.losses

	@property
	def win_rate(self):
		if self.total_games > 0:
			return (self.wins / self.total_games) * 100
		return 0

	def register_from_42_login(self, email, avatar_url:str, firstname:str, lastname:str):
		self.email = email
		self.set_avatar(avatar_url)
		self.first_name = firstname
		self.last_name = lastname
		self.langue = "en"

	def set_avatar(self, avatar_url: str):
		if avatar_url.startswith('http'):
			self.avatar = avatar_url
		else:
			self.avatar = os.path.join(settings.MEDIA_URL, avatar_url)

	def login(self):
		self.is_online = True
		self.last_activity = timezone.now()
		self.save()

	def logout(self):
		self.is_online = False
		self.save()

#class qui permet de gerer les demandes d'amis. Si demande acceptee alors sauvegarde l'ami dans la table friends 
class Friendship(models.Model):
	id_user_1 = models.ForeignKey(User, related_name='friendship_sender', on_delete=models.CASCADE, null = True, blank = True)
	id_user_2 = models.ForeignKey(User, related_name='friendship_receiver', on_delete=models.CASCADE, null = True, blank = True)

	class Meta: #Model Meta is basically the inner class of your model class https://www.geeksforgeeks.org/meta-class-in-models-django/. Permet de definir des options plus specifiques
		constraints = [
			UniqueConstraint(fields=['id_user_1', 'id_user_2'], name='unique_friendship')#https://docs.djangoproject.com/en/5.0/ref/models/constraints/#fields
		]
	def __str__(self):
		return f"{self.id_user_1} is friend with {self.id_user_2}"


class Tournament(models.Model):
	name = models.CharField(max_length=100, null=True, blank=True, default="")
	is_started = models.BooleanField(default=False)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True, null=True)
	participants = models.ManyToManyField(User, related_name='tournaments', blank=True)
	aliases = models.JSONField(default=list, blank=True) 
 
	def __init__(self, *args, **kwargs): # permet d'initialiser l'objet avec des valeurs par defaut ou personnalisees
		super().__init__(*args, **kwargs) # pour appeler la method __init__ de la classe parente i.e. models.Model
		if not self.created_at:
			self.created_at = timezone.now()
	def __str__(self):
		return self.name

class Game(models.Model):
	player1 = models.ForeignKey(User, related_name='player1_games', on_delete=models.CASCADE,  null=True, blank=True)
	player2 = models.ForeignKey(User, related_name='player2_games', on_delete=models.CASCADE,  null=True, blank=True)
	player1_score = models.IntegerField(default=0)
	player2_score = models.IntegerField(default=0)
	status = models.CharField(max_length=20, choices=[('started', 'Started'), ('finished', 'Finished'), ('canceled', 'Canceled')])
	winner = models.ForeignKey(User, related_name='won_games', on_delete=models.SET_NULL, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True,  null=True, blank=True)
	finished_at = models.DateTimeField(null=True, blank=True)
	status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('started', 'Started'), ('finished', 'Finished')], default='pending')
	is_tournament_game = models.BooleanField(default=False)
	tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='games')
	def finish(self, winner):
		self.winner = winner
		self.status = 'finished'
		self.finished_at = self.finished_at or timezone.now()
		self.save()
	def __str__(self):
		return f"Game {self.id}: {self.player1} vs {self.player2}"
	
	def was_won_by(self, winner, player1_score, player2_score):
		self.status = 'finished'
		self.winner = winner
		self.player1_score  = player1_score
		self.player2_score  = player2_score
		
		# mise a jour des stats pour les joueurs
		if self.player1 == winner:
			self.player1.wins = F('wins') + 1
			self.player2.losses = F('losses') + 1
		else:
			self.player1.losses = F('losses') + 1
			self.player2.wins = F('wins') + 1

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
