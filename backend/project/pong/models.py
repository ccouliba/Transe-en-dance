from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models import UniqueConstraint
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import UniqueConstraint, Q

# class User(AbstractUser): #https://openclassrooms.com/fr/courses/7192426-allez-plus-loin-avec-le-framework-django/7386368-personnalisez-le-modele-utilisateur

class User(AbstractUser):
	creation_date = models.DateTimeField(default=timezone.now)  # Date de creation de l'utilisateur
	langue = models.CharField(max_length=10, blank=True, null=True)  # Langue de l'utilisateur
	avatar = models.CharField(max_length=255, blank=True, null=True)  # URL ou chemin de l'avatar de l'utilisateur
	friends = models.ManyToManyField('self', symmetrical=True, blank=True)  # Champ pour les amis
	
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

	last_activity = models.DateTimeField(default=timezone.now)
 
	wins = models.IntegerField(default=0)
	losses = models.IntegerField(default=0)

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
	def was_active_now(self):
		self.last_activity = timezone.now()
	def get_avatar_url(self):
		if self.avatar and hasattr(self.avatar, 'url'):
			return self.avatar.url
		else:
			return f"{settings.STATIC_URL}pong/images/default_avatar.png"
	@property #https://docs.python.org/3/library/functions.html#property
	def total_games(self):
		return self.wins + self.losses
	@property
	def win_rate(self):
		if self.total_games > 0:
			return (self.wins / self.total_games) * 100
		return 0

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
	finished_at = models.DateTimeField(null=True, blank=True)
	def finish(self, winner):
		self.winner = winner
		self.status = 'finished'
		self.finished_at = self.finished_at or timezone.now()
		self.save()
	def __str__(self):
		return f"Game {self.id}: {self.player1} vs {self.player2}"
	

class Tournament(models.Model):
	name = models.CharField(max_length=100)
	is_started = models.BooleanField(default=False)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True, null=True)
	participants = models.ManyToManyField(User, related_name='tournaments', blank=True)
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		if not self.created_at:
			self.created_at = timezone.now()
	def __str__(self):
		return self.name








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
