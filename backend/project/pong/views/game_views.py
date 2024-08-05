from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import Game, User
import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F #pour effectuer des opérations de mise à jour directement au niveau de la base de données sans d'abord récupérer les objets en mémoire
from django.db.models import Q #pour construire des requêtes qui nécessitent des opérations logiques telles que OR et AND

@csrf_exempt
@login_required
def create_game(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		player1_email = data.get('player1Email')
		player2_email = data.get('player2Email')
  
		if not User.objects.filter(email=player1_email).exists() or not User.objects.filter(email=player2_email).exists():
			return JsonResponse({'error': 'One or both players not found'}, status=404)

		print(User.objects.filter(email=player1_email).exists())
  
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
			player1_score = data.get('player1Score')
			player2_score = data.get('player2Score')
			winner = User.objects.get(email=winner_email)
			
			# mise a jour du statut du jeu et le gagnant
			game.was_won_by(winner, player1_score, player2_score)
			game.save()
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

import pytz
from django.utils import timezone

@login_required
@csrf_exempt
def match_history(request):
	user = request.user
	games = Game.objects.filter(
		Q(player1=user) | Q(player2=user),
		status='finished'
	).order_by('-created_at')  
	paris_tz = pytz.timezone('Europe/Paris')
	# print(paris_tz)
	history = []
	for game in games:
		game_time = game.finished_at or game.created_at
		game_time_paris = game_time.astimezone(paris_tz)
		history.append({
			'id': game.id,
			'opponent': game.player2.email if game.player1 == user else game.player1.email,
			'user_score': game.player1_score if game.player1 == user else game.player2_score,
			'opponent_score': game.player2_score if game.player1 == user else game.player1_score,
			'result': 'Win' if game.winner == user else 'Loss',
			'date': game_time_paris.strftime("%Y-%m-%d %H:%M:%S")
		})
	
	return JsonResponse({'match_history': history})


from django.utils import timezone

@login_required
@csrf_exempt
def update_online_status(request):
	if request.method == 'POST':
		user = request.user
		user.last_activity = timezone.now()
		user.save()
		return JsonResponse({'status': 'success'})
	return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
