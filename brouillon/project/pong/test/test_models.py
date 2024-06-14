from django.test import TestCase
from django.contrib.auth import get_user_model
from pong.models import Player

User = get_user_model()

class UserModelTest(TestCase):
	
	def setUp(self):
		# Creer un utilisateur
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')

	def test_user_creation(self):
		# Verifier que l'utilisateur a ete cree correctement
		self.assertEqual(self.user.username, 'testuser')
		self.assertEqual(self.user.email, 'testuser@example.com')
		self.assertTrue(self.user.check_password('testpass123'))

class PlayerModelTest(TestCase):
	
	def setUp(self):
		# Creer un utilisateur et un joueur associe
		self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
		self.player = Player.objects.create(user=self.user, avatar='path/to/avatar.png')

	def test_player_creation(self):
		# Verifier que le joueur a ete cree correctement
		self.assertEqual(self.player.user.username, 'testuser')
		self.assertEqual(self.player.avatar, 'path/to/avatar.png')
		self.assertEqual(str(self.player), 'testuser')

	# def test_player_deletion_on_user_deletion(self):
	# 	# Supprimer l'utilisateur et verifier que le joueur est aussi supprime
	# 	self.user.delete()
	# 	self.assertFalse(Player.objects.filter(user=self.user).exists())


