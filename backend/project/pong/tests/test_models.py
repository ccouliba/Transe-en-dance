
from django.test import TestCase
from django.contrib.auth import get_user_model
# from pong.models import Player
from pong.models import Friendship
from pong.models import Game
from pong.models import Tournament
from pong.models import Participate
from pong.models import Composed
import requests
from django.test import Client
from django.contrib.auth.models import User

User = get_user_model()


#testing models creation

class UserModelTest(TestCase):
	
	def setUp(self):
		# Créer un utilisateur avec les nouveaux champs
		self.user = User.objects.create_user(
			username='testuser', 
			email='testuser@example.com', 
			password='testpass123',
			langue='fr',
			avatar='path/to/avatar.png'
		)
		self.user.save()

	def test_user_creation(self):
		# Vérifier que l'utilisateur a été créé correctement
		self.assertEqual(self.user.username, 'testuser')
		self.assertEqual(self.user.email, 'testuser@example.com')
		self.assertTrue(self.user.check_password('testpass123'))
		self.assertEqual(self.user.langue, 'fr')
		self.assertEqual(self.user.avatar, 'path/to/avatar.png')
		self.assertIsNotNone(self.user.creation_date)


class FriendshipModelTest(TestCase):
	
	def setUp(self):
		self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='testpass123')
		self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='testpass123')
		self.friendship = Friendship.objects.create(id_user_1=self.user1, id_user_2=self.user2)

	def test_friendship_creation(self):
		self.assertEqual(self.friendship.id_user_1, self.user1)
		self.assertEqual(self.friendship.id_user_2, self.user2)


class GameModelTest(TestCase):

	def setUp(self):
		# Création de trois utilisateurs pour les tests
		self.player_1 = User.objects.create_user(username='player1', email='player1@example.com', password='password123')
		self.player_2 = User.objects.create_user(username='player2', email='player2@example.com', password='password123')
		self.winner = User.objects.create_user(username='winner', email='winner@example.com', password='password123')

	def test_game_creation(self):
		# Création d'un jeu
		game = Game.objects.create(
			player_1=self.player_1,
			player_2=self.player_2,
			winner=self.winner,
			score=42,
			status='finished'
		)

		# Vérification que l'objet a été créé correctement
		self.assertEqual(game.player_1, self.player_1)
		self.assertEqual(game.player_2, self.player_2)
		self.assertEqual(game.winner, self.winner)
		self.assertEqual(game.score, 42)
		self.assertEqual(game.status, 'finished')

	def test_game_str_method(self):
		# Création d'un jeu
		game = Game.objects.create(
			player_1=self.player_1,
			player_2=self.player_2,
			winner=self.winner,
			score=42,
			status='finished'
		)

		# Vérification de la méthode __str__
		expected_str = f"Game {game.id} on {game.date} between {self.player_1} and {self.player_2}"
		self.assertEqual(str(game), expected_str)


class TournamentModelTest(TestCase):
	
	def setUp(self):
		self.tournament = Tournament.objects.create(name='Test Tournament', is_started=True)

	def test_tournament_creation(self):
		self.assertEqual(self.tournament.name, 'Test Tournament')
		self.assertTrue(self.tournament.is_started)


class ParticipateModelTest(TestCase):
	
	def setUp(self):
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.tournament = Tournament.objects.create(name='Test Tournament', is_started=True)
		self.participate = Participate.objects.create(player=self.user, tournament=self.tournament, order_of_turn=1, alias='Alias')

	def test_participate_creation(self):
		self.assertEqual(self.participate.player, self.user)
		self.assertEqual(self.participate.tournament, self.tournament)
		self.assertEqual(self.participate.order_of_turn, 1)
		self.assertEqual(self.participate.alias, 'Alias')

class ComposedModelTest(TestCase):
    def setUp(self):
        self.player1 = User.objects.create_user(username='player1', password='password')
        self.player2 = User.objects.create_user(username='player2', password='password')
        self.winner = User.objects.create_user(username='winner', password='password')
        self.game = Game.objects.create(
            player1=self.player1,
            player2=self.player2,
            winner=self.winner,
            player1_score=42,
            status='finished'
        )

    def test_composed_creation(self):
        self.assertEqual(self.game.player1, self.player1)
        self.assertEqual(self.game.player2, self.player2)
        self.assertEqual(self.game.status, 'finished')
        self.assertEqual(self.game.winner, self.winner)


#testing game now

class GameModelTest(TestCase):
    def setUp(self):
        self.player1 = User.objects.create_user(username='player1', password='password')
        self.player2 = User.objects.create_user(username='player2', password='password')
        self.winner = User.objects.create_user(username='winner', password='password')

    def test_game_creation(self):
        game = Game.objects.create(
            player1=self.player1,
            player2=self.player2,
            player1_score=10,
            player2_score=5,
            status='finished',
            winner=self.winner
        )
        self.assertEqual(game.player1, self.player1)
        self.assertEqual(game.player2, self.player2)
        self.assertEqual(game.status, 'finished')
        self.assertEqual(game.winner, self.winner)
    
    def test_game_str_method(self):
        game = Game.objects.create(
            player1=self.player1,
            player2=self.player2,
            player1_score=10,
            player2_score=5,
            status='finished',
            winner=self.winner
        )
        self.assertEqual(str(game), f"Game {game.id}: {self.player1} vs {self.player2}")
