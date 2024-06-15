
from django.test import TestCase
from django.contrib.auth import get_user_model
from pong.models import Player
from pong.models import Friendship
from pong.models import Game
from pong.models import Tournament
from pong.models import Play
from pong.models import Participate
from pong.models import Composed


User = get_user_model()

class UserModelTest(TestCase):
	
	def setUp(self):
		# Creer un utilisateur
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.user.save()

	def test_user_creation(self):
		# Verifier que l'utilisateur a ete cree correctement
		self.assertEqual(self.user.username, 'testuser')
		self.assertEqual(self.user.email, 'testuser@example.com')
		self.assertTrue(self.user.check_password('testpass123'))

class PlayerModelTest(TestCase):
	
	def setUp(self):
		# Creer un utilisateur et un joueur associe
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.assertIsInstance(self.user, User, "self.user is not an instance of User")  # Ajout de cette assertion pour vérifier le type
		print(f"User instance: {self.user}")  # Ajoutez cette ligne pour afficher les informations de l'utilisateur
		print(f"User type: {type(self.user)}")  # Ajoutez cette ligne pour afficher le type de self.user
		self.player = Player.objects.create(user=self.user)
		# self.player = Player.objects.create(user=self.user, avatar='path/to/avatar.png')
		print(f"user instance : {self.user}")
		self.player.save()

	def test_player_creation(self):
		# Verifier que le joueur a ete cree correctement
		self.assertEqual(self.player.user.username, 'testuser')
		# self.assertEqual(self.player.avatar, 'path/to/avatar.png')
		self.assertEqual(str(self.player), 'testuser')

# 	# def test_player_deletion_on_user_deletion(self):
# 	# 	# Supprimer l'utilisateur et verifier que le joueur est aussi supprime
# 	# 	self.user.delete()
# 	# 	self.assertFalse(Player.objects.filter(user=self.user).exists())

class FriendshipModelTest(TestCase):
	
	def setUp(self):
		self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='testpass123')
		self.player1 = Player.objects.create(user=self.user1)
		self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='testpass123')
		self.player2 = Player.objects.create(user=self.user2)
		self.friendship = Friendship.objects.create(id_player1=self.player1, id_player2=self.player2)

	def test_friendship_creation(self):
		self.assertEqual(self.friendship.id_player1, self.player1)
		self.assertEqual(self.friendship.id_player2, self.player2)

class GameModelTest(TestCase):
	
	def setUp(self):
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.player = Player.objects.create(user=self.user)
		self.game = Game.objects.create(status='started', winner=self.player)

	def test_game_creation(self):
		self.assertEqual(self.game.status, 'started')
		self.assertEqual(self.game.winner, self.player)

class PlayModelTest(TestCase):
	
	def setUp(self):
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.player = Player.objects.create(user=self.user)
		self.game = Game.objects.create(status='started', winner=self.player)
		self.play = Play.objects.create(player=self.player, game=self.game, score=100)

	def test_play_creation(self):
		self.assertEqual(self.play.player, self.player)
		self.assertEqual(self.play.game, self.game)
		self.assertEqual(self.play.score, 100)

class TournamentModelTest(TestCase):
	
	def setUp(self):
		self.tournament = Tournament.objects.create(name='Test Tournament', is_started=True)

	def test_tournament_creation(self):
		self.assertEqual(self.tournament.name, 'Test Tournament')
		self.assertTrue(self.tournament.is_started)

class ParticipateModelTest(TestCase):
	
	def setUp(self):
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.player = Player.objects.create(user=self.user)
		self.tournament = Tournament.objects.create(name='Test Tournament', is_started=True)
		self.participate = Participate.objects.create(player=self.player, tournament=self.tournament, order_of_turn=1, alias='Alias')

	def test_participate_creation(self):
		self.assertEqual(self.participate.player, self.player)
		self.assertEqual(self.participate.tournament, self.tournament)
		self.assertEqual(self.participate.order_of_turn, 1)
		self.assertEqual(self.participate.alias, 'Alias')

class ComposedModelTest(TestCase):
	
	def setUp(self):
		self.tournament = Tournament.objects.create(name='Test Tournament', is_started=True)
		self.game = Game.objects.create(status='started')
		self.composed = Composed.objects.create(tournament=self.tournament, game=self.game, game_number=1)

	def test_composed_creation(self):
		self.assertEqual(self.composed.tournament, self.tournament)
		self.assertEqual(self.composed.game, self.game)
		self.assertEqual(self.composed.game_number, 1)




