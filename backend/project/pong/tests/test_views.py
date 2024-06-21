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
