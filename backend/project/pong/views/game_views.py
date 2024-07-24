from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import Game, User
import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F #pour effectuer des opérations de mise à jour directement au niveau de la base de données sans d'abord récupérer les objets en mémoire

@csrf_exempt
@login_required
def create_game(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		player1_email = data.get('player1Email')
		player2_email = data.get('player2Email')

		try:
			player1 = User.objects.get(email=player1_email)
			player2 = User.objects.get(email=player2_email)

			game = Game.objects.create(
				player1=player1,
				player2=player2,
				status='started'
			)

			return JsonResponse({'gameId': game.id}, status=201)
		except User.DoesNotExist:
			return JsonResponse({'error': 'One or both players not found'}, status=404)
	else:
		return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@login_required
def update_game(request, game_id):
	if request.method == 'POST':
		data = json.loads(request.body)
		player1_score = data.get('player1Score')
		player2_score = data.get('player2Score')
		winner_email = data.get('winner')

		try:
			game = Game.objects.get(id=game_id)
			game.player1_score = player1_score
			game.player2_score = player2_score
			game.status = 'finished'

			winner = User.objects.get(email=winner_email)
			game.winner = winner

			game.save()

			return JsonResponse({'message': 'Game updated successfully'}, status=200)
		except Game.DoesNotExist:
			return JsonResponse({'error': 'Game not found'}, status=404)
		except User.DoesNotExist:
			return JsonResponse({'error': 'Winner not found'}, status=404)
	else:
		return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@login_required
def finish_game(request, game_id):
	if request.method == 'POST':
		try:
			game = Game.objects.get(id=game_id)
			
			if game.status == 'finished':
				return JsonResponse({'error': 'Game already finished'}, status=400)
			
			data = json.loads(request.body)
			winner_email = data.get('winner')
			winner = User.objects.get(email=winner_email)
			
			# mise a jour du statut du jeu et le gagnant
			game.status = 'finished'
			game.winner = winner
			game.save()
			
			# mise a jour des stats pour les joueurs
			if game.player1 == winner:
				game.player1.wins = F('wins') + 1
				game.player2.losses = F('losses') + 1
			else:
				game.player1.losses = F('losses') + 1
				game.player2.wins = F('wins') + 1
			
			game.player1.save()
			game.player2.save()
			
			return JsonResponse({
				'message': 'Game finished successfully',
				'winner': winner.username
			}, status=200)
		
		except Game.DoesNotExist:
			return JsonResponse({'error': 'Game not found'}, status=404)
		except User.DoesNotExist:
			return JsonResponse({'error': 'Winner not found'}, status=404)
	else:
		return JsonResponse({'error': 'Invalid request method'}, status=405)