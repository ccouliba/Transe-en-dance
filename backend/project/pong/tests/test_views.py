from django.test import TestCase, Client
from django.contrib.auth.models import User
from pong.models import Friendship
from pong.models import Game
from pong.models import Tournament
from pong.models import Participate
from pong.models import Composed
import json
from django.contrib.auth.models import User

from django.contrib.auth import get_user_model
import requests

User = get_user_model()

class GameViewTests(TestCase):
	def setUp(self):
		self.client = Client()
		self.player1 = User.objects.create_user(username='player1', password='password')
		self.player2 = User.objects.create_user(username='player2', password='password')
		self.client.login(username='player1', password='password')

	def test_start_game(self):
		response = self.client.post('/pong/start_game/', json.dumps({'opponent_id': self.player2.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.assertEqual(Game.objects.count(), 1)
		game = Game.objects.first()
		self.assertEqual(game.status, 'started')
		self.assertEqual(game.player1, self.player1)
		self.assertEqual(game.player2, self.player2)

	def test_update_score(self):
		game = Game.objects.create(player1=self.player1, player2=self.player2, status='started')
		response = self.client.post('/pong/update_score/', json.dumps({'game_id': game.id, 'player_id': self.player1.id, 'new_score': 10}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		game.refresh_from_db()
		self.assertEqual(game.player1_score, 10)

	def test_finish_game(self):
		game = Game.objects.create(player1=self.player1, player2=self.player2, status='started')
		response = self.client.post('/pong/finish_game/', json.dumps({'game_id': game.id, 'winner_id': self.player1.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		game.refresh_from_db()
		self.assertEqual(game.status, 'finished')
		self.assertEqual(game.winner, self.player1)

	def test_cancel_game(self):
		game = Game.objects.create(player1=self.player1, player2=self.player2, status='started')
		response = self.client.post('/pong/cancel_game/', json.dumps({'game_id': game.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		game.refresh_from_db()
		self.assertEqual(game.status, 'canceled')


##########################friendship tests

class FriendshipViewTests(TestCase):
	def setUp(self):
		self.client = Client()
		self.user1 = User.objects.create_user(username='user1', password='password')
		self.user2 = User.objects.create_user(username='user2', password='password')
		self.client.login(username='user1', password='password')

	def test_send_friend_request(self):
		response = self.client.post('/pong/send_friend_request/', json.dumps({'to_user_id': self.user2.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.assertEqual(Friendship.objects.count(), 1)
		friend_request = Friendship.objects.first()
		self.assertEqual(friend_request.id_user_1, self.user1)
		self.assertEqual(friend_request.id_user_2, self.user2)
		self.assertEqual(response.json()['status'], 'friend_request_sent')

	def test_accept_friend_request(self):
		friend_request = Friendship.objects.create(id_user_1=self.user1, id_user_2=self.user2)
		self.client.login(username='user2', password='password')
		response = self.client.post('/pong/accept_friend_request/', json.dumps({'request_id': friend_request.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.user1.refresh_from_db()
		self.user2.refresh_from_db()
		self.assertIn(self.user1, self.user2.friends.all())
		self.assertIn(self.user2, self.user1.friends.all())
		self.assertEqual(Friendship.objects.count(), 0)
		self.assertEqual(response.json()['status'], 'friend_request_accepted')

	def test_refuse_friend_request(self):
		friend_request = Friendship.objects.create(id_user_1=self.user1, id_user_2=self.user2)
		self.client.login(username='user2', password='password')
		response = self.client.post('/pong/refuse_friend_request/', json.dumps({'request_id': friend_request.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.assertEqual(Friendship.objects.count(), 0)
		self.assertEqual(response.json()['status'], 'friend_request_refused')

	def test_send_duplicate_friend_request(self):
		Friendship.objects.create(id_user_1=self.user1, id_user_2=self.user2)
		response = self.client.post('/pong/send_friend_request/', json.dumps({'to_user_id': self.user2.id}), content_type='application/json')
		self.assertEqual(response.status_code, 400)
		self.assertEqual(Friendship.objects.count(), 1)
		self.assertEqual(response.json()['status'], 'error')
		self.assertEqual(response.json()['message'], 'Friend request already sent')

	def test_accept_nonexistent_friend_request(self):
		self.client.login(username='user2', password='password')
		response = self.client.post('/pong/accept_friend_request/', json.dumps({'request_id': 999}), content_type='application/json')
		self.assertEqual(response.status_code, 404)

	def test_refuse_nonexistent_friend_request(self):
		self.client.login(username='user2', password='password')
		response = self.client.post('/pong/refuse_friend_request/', json.dumps({'request_id': 999}), content_type='application/json')
		self.assertEqual(response.status_code, 404)
		
##########################tournament tests
import uuid
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from pong.models import Tournament, Participate

User = get_user_model()


class TournamentViewTests(TestCase):
	def setUp(self):
		self.client = Client()
		self.user = User.objects.create_user(username=f'user_{uuid.uuid4()}', password='password')
		self.tournament = Tournament.objects.create(name='Test Tournament')
		self.client.login(username=self.user.username, password='password')

	def test_player_joined_tournament(self):
		response = self.client.post('/pong/player_joined_tournament/', json.dumps({'tournament_id': self.tournament.id, 'alias': 'PlayerAlias'}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.assertEqual(Participate.objects.count(), 1)
		participation = Participate.objects.first()
		self.assertEqual(participation.player, self.user)
		self.assertEqual(participation.tournament, self.tournament)
		self.assertEqual(participation.alias, 'PlayerAlias')
		self.assertEqual(response.json()['status'], 'player_joined')
		self.assertEqual(response.json()['tournament_id'], self.tournament.id)
		self.assertEqual(response.json()['player_id'], self.user.id)
		self.assertEqual(response.json()['alias'], 'PlayerAlias')
		self.assertEqual(response.json()['order_of_turn'], 1)

	def test_player_already_joined_tournament(self):
		Participate.objects.create(player=self.user, tournament=self.tournament, alias='PlayerAlias', order_of_turn=1)
		response = self.client.post('/pong/player_joined_tournament/', json.dumps({'tournament_id': self.tournament.id, 'alias': 'PlayerAlias'}), content_type='application/json')
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.json()['status'], 'error')
		self.assertEqual(response.json()['message'], 'Player already joined the tournament')

	def test_start_tournament(self):
		response = self.client.post('/pong/start_tournament/', json.dumps({'tournament_id': self.tournament.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.tournament.refresh_from_db()
		self.assertTrue(self.tournament.is_started)
		self.assertIsNotNone(self.tournament.start_date)
		self.assertEqual(response.json()['status'], 'tournament_started')
		self.assertEqual(response.json()['tournament_id'], self.tournament.id)
		self.assertIsNotNone(response.json()['start_date'])

	def test_tournament_already_started(self):
		self.tournament.is_started = True
		self.tournament.save()
		response = self.client.post('/pong/start_tournament/', json.dumps({'tournament_id': self.tournament.id}), content_type='application/json', follow=False)
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.json()['status'], 'error')
		self.assertEqual(response.json()['message'], 'Tournament already started')

	def test_finish_tournament(self):
		self.tournament.is_started = True
		self.tournament.save()
		winner = User.objects.create_user(username=f'winner_{uuid.uuid4()}', password='password')
		response = self.client.post('/pong/finish_tournament/', json.dumps({'tournament_id': self.tournament.id, 'winner_id': winner.id}), content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.tournament.refresh_from_db()
		self.assertFalse(self.tournament.is_started)
		self.assertIsNotNone(self.tournament.end_date)
		self.assertEqual(self.tournament.winner, winner)
		self.assertEqual(response.json()['status'], 'tournament_finished')
		self.assertEqual(response.json()['tournament_id'], self.tournament.id)
		self.assertIsNotNone(response.json()['end_date'])
		self.assertEqual(response.json()['winner_id'], winner.id)

	def test_finish_tournament_not_started(self):
		response = self.client.post('/pong/finish_tournament/', json.dumps({'tournament_id': self.tournament.id, 'winner_id': self.user.id}), content_type='application/json')
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.json()['status'], 'error')
		self.assertEqual(response.json()['message'], 'Tournament has not started yet')

# class TournamentViewTests(TestCase):
# 	def setUp(self):
# 		self.client = Client()
# 		self.user = User.objects.create_user(username=f'user_{uuid.uuid4()}', password='password')
# 		self.tournament = Tournament.objects.create(name='Test Tournament')
# 		self.client.login(username=self.user.username, password='password')

# 	def test_player_joined_tournament(self):
# 		response = self.client.post('/pong/player_joined_tournament/', json.dumps({'tournament_id': self.tournament.id, 'alias': 'PlayerAlias'}), content_type='application/json')
# 		self.assertEqual(response.status_code, 200)
# 		self.assertEqual(Participate.objects.count(), 1)
# 		participation = Participate.objects.first()
# 		self.assertEqual(participation.player, self.user)
# 		self.assertEqual(participation.tournament, self.tournament)
# 		self.assertEqual(participation.alias, 'PlayerAlias')
# 		self.assertEqual(response.json()['status'], 'player_joined')
# 		self.assertEqual(response.json()['tournament_id'], self.tournament.id)
# 		self.assertEqual(response.json()['player_id'], self.user.id)
# 		self.assertEqual(response.json()['alias'], 'PlayerAlias')
# 		self.assertEqual(response.json()['order_of_turn'], 1)

# 	def test_player_already_joined_tournament(self):
# 		Participate.objects.create(player=self.user, tournament=self.tournament, alias='PlayerAlias', order_of_turn=1)
# 		response = self.client.post('/pong/player_joined_tournament/', json.dumps({'tournament_id': self.tournament.id, 'alias': 'PlayerAlias'}), content_type='application/json')
# 		self.assertEqual(response.status_code, 400)
# 		self.assertEqual(response.json()['status'], 'error')
# 		self.assertEqual(response.json()['message'], 'Player already joined the tournament')
 
# 	def test_start_tournament(self):
# 		response = self.client.post('/pong/start_tournament/', json.dumps({'tournament_id': self.tournament.id}), content_type='application/json')
# 		self.assertEqual(response.status_code, 200)
# 		self.tournament.refresh_from_db()
# 		self.assertTrue(self.tournament.is_started)
# 		self.assertIsNotNone(self.tournament.start_date)
# 		self.assertEqual(response.json()['status'], 'tournament_started')
# 		self.assertEqual(response.json()['tournament_id'], self.tournament.id)
# 		self.assertIsNotNone(response.json()['start_date'])


# 	def test_tournament_already_started(self):
# 		self.tournament.is_started = True
# 		self.tournament.save()
# 		response = self.client.post('/pong/start_tournament', json.dumps({'tournament_id': self.tournament.id}), content_type='application/json')
# 		self.assertEqual(response.status_code, 400)
# 		self.assertEqual(response.json()['status'], 'error')
# 		self.assertEqual(response.json()['message'], 'Tournament already started')

# 	def test_finish_tournament(self):
# 		self.tournament.is_started = True
# 		self.tournament.save()
# 		winner = User.objects.create_user(username=f'winner_{uuid.uuid4()}', password='password')
# 		response = self.client.post('/pong/finish_tournament/', json.dumps({'tournament_id': self.tournament.id, 'winner_id': winner.id}), content_type='application/json')
# 		self.assertEqual(response.status_code, 200)
# 		self.tournament.refresh_from_db()
# 		self.assertFalse(self.tournament.is_started)
# 		self.assertIsNotNone(self.tournament.end_date)
# 		self.assertEqual(self.tournament.winner, winner)
# 		self.assertEqual(response.json()['status'], 'tournament_finished')
# 		self.assertEqual(response.json()['tournament_id'], self.tournament.id)
# 		self.assertIsNotNone(response.json()['end_date'])
# 		self.assertEqual(response.json()['winner_id'], winner.id)

# 	def test_finish_tournament_not_started(self):
# 		response = self.client.post('/pong/finish_tournament/', json.dumps({'tournament_id': self.tournament.id, 'winner_id': self.user.id}), content_type='application/json')
# 		self.assertEqual(response.status_code, 400)
# 		self.assertEqual(response.json()['status'], 'error')
# 		self.assertEqual(response.json()['message'], 'Tournament has not started yet')