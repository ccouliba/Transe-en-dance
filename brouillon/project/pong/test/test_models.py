from django.test import TestCase
from django.contrib.auth import get_user_model
from pong.models import Player

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

		self.player = Player.objects.create(user=self.user, avatar='path/to/avatar.png')
		print(f"user instance : {self.user}")
		self.player.save()

	def test_player_creation(self):
		# Verifier que le joueur a ete cree correctement
		self.assertEqual(self.player.user.username, 'testuser')
		self.assertEqual(self.player.avatar, 'path/to/avatar.png')
		self.assertEqual(str(self.player), 'testuser')

# 	# def test_player_deletion_on_user_deletion(self):
# 	# 	# Supprimer l'utilisateur et verifier que le joueur est aussi supprime
# 	# 	self.user.delete()
# 	# 	self.assertFalse(Player.objects.filter(user=self.user).exists())


