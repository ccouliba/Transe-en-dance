from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
# from .models import Game, User
from pong.models import Game, User
import json

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


# from django.shortcuts import render
# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required
# from django.views.decorators.http import require_POST
# from django.views.decorators.csrf import csrf_exempt
# from pong.models import Game, User
# import json

# # Cette vue rend la page HTML du jeu 
# def game(request):
# 	return render(request, 'pong/game.html')



# # Cette vue restreint l'acces à la page de jeu uniquement aux utilisateurs connectés et retourne la page html 
# @login_required
# def play(request):
# 	return render(request, 'pong/play.html')


# # Cette vue permet a l'utilisateur connecte de demarrer une nouvelle partie de pong avec un adversaire specifie
# @login_required
# @require_POST
# @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# def start_game(request):
# 	player = request.user  # Recupere l'utilisateur actuellement connecte
# 	payload = json.loads(request.body)  # Recupere le corps de la requete HTTP et le convertit en dictionnaire python
# 	opponent_id = payload['opponent_id']  # Recupere l'identifiant de l'adversaire depuis le dictionnaire
# 	opponent = User.objects.get(id=opponent_id)  # On a l'id donc maintenant on recupere l'objet utilisateur de l'adversaire depuis la base de donnees
# 	# Cree un nouvel objet Game avec les joueurs et le statut 'started'
# 	game = Game.objects.create(player1=player, player2=opponent, status='started')
# 	request.session['game_id'] = game.id #sauvegarder l'utilisateur player dans la session
# 	# Retourne une reponse JSON avec l'identifiant du jeu et le statut
# 	return JsonResponse({'game_id': game.id, 'status': 'started'})


# #Cette vue met a jour le score d'un joueur dans une partie en cours de Pong
# @login_required
# @require_POST
# @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# def update_score(request):
# 	payload = json.loads(request.body)
# 	game_id = payload['game_id']
# 	player_id = payload['player_id']
# 	new_score = payload['new_score']
	
# 	# game_id = request.POST.get('game_id')
# 	# player_id = request.POST.get('player_id')
# 	# new_score = request.POST.get('new_score')
	
# 	game = Game.objects.get(id=game_id)
# 	if game.status == 'started':
# 		if game.player1.id == player_id:
# 			game.player1_score = new_score
# 		elif game.player2.id == player_id:
# 			game.player2_score = new_score
# 		game.save()
# 		return JsonResponse({'status': 'score_updated', 'game_id': game.id})
	
# 	return JsonResponse({'status': 'error', 'message': 'Game not in progress'}, status=400)


# #Cette vue termine une partie de Pong en mettant a jour son statut et en enregistrant le gagnant
# @login_required
# @require_POST
# @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# def finish_game(request):
# 	payload = json.loads(request.body)
# 	game_id = payload['game_id']
# 	winner_id = payload['winner_id']
# 	# game_id = request.POST.get('game_id')
# 	# winner_id = request.POST.get('winner_id')
# 	game = Game.objects.get(id=game_id)
# 	game.status = 'finished'
# 	game.winner = User.objects.get(id=winner_id)
# 	game.save()
	
# 	return JsonResponse({'status': 'finished', 'game_id': game.id, 'winner': game.winner.id})

# #Cette vue permet a l'utilisateur connecte d'annuler une partie de Pong en mettant a jour son statut
# @login_required
# @require_POST
# @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# def cancel_game(request):
# 	payload = json.loads(request.body)
# 	game_id = payload['game_id']
# 	# game_id = request.POST.get('game_id')
# 	game = Game.objects.get(id=game_id)
# 	game.status = 'canceled'
# 	game.save()
# 	return JsonResponse({'status': 'canceled', 'game_id': game.id})