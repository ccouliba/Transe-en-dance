from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from pong.models import Tournament, Participate
import json

@login_required
@require_GET
def get_tournament_state(request):
	tournament = Tournament.objects.filter(is_started=False).first()
	if not tournament:
		return JsonResponse({'isStarted': False, 'players': []})
	
	players = Participate.objects.filter(tournament=tournament).values('player__username', 'alias')
	return JsonResponse({
		'isStarted': tournament.is_started,
		'players': list(players)
	})

@login_required
@require_POST
# @csrf_exempt
def register_player(request):
	tournament = Tournament.objects.filter(is_started=False).first()
	if not tournament:
		return JsonResponse({'error': 'No active tournament'}, status=400)

	data = json.loads(request.body)
	alias = data.get('alias')
	
	# determiner l ordre de tour
	order_of_turn = Participate.objects.filter(tournament=tournament).count() + 1

	Participate.objects.create(
		player=request.user,
		tournament=tournament,
		alias=alias,
		order_of_turn=order_of_turn
	)
	
	players = Participate.objects.filter(tournament=tournament).values('player__username', 'alias', 'order_of_turn')
	
	return JsonResponse({'players': list(players)})


# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required
# from django.views.decorators.http import require_POST, require_GET
# from django.views.decorators.csrf import csrf_exempt
# from django.shortcuts import get_object_or_404
# from django.utils import timezone
# from pong.models  import Tournament, Participate, User, Game, Composed
# from django.db.models import Q
# import json
# import random

# @login_required
# @require_POST
# @csrf_exempt
# def create_tournament(request):
# 	try:
# 		payload = json.loads(request.body)
# 		name = payload.get('name')
# 		if not name:
# 			return JsonResponse({'status': 'error', 'message': 'Tournament name is required'}, status=400)
		
# 		tournament = Tournament.objects.create(name=name)
# 		return JsonResponse({
# 			'status': 'tournament_created',
# 			'tournament_id': tournament.id,
# 			'name': tournament.name,
# 			'isStarted': tournament.is_started,
# 			'isFinished': False,
# 			'players': []
# 		})
# 	except Exception as e:
# 		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# @login_required
# @require_GET
# def get_tournament_state(request):
# 	tournament = Tournament.objects.filter(is_started=True, winner__isnull=True).first()
# 	if not tournament:
# 		return JsonResponse({'status': 'no_active_tournament'})
	
# 	participants = Participate.objects.filter(tournament=tournament).order_by('order_of_turn')
# 	players = [{'id': p.player.id, 'username': p.player.username, 'alias': p.alias} for p in participants]
	
# 	composed_games = Composed.objects.filter(tournament=tournament).order_by('game_number')
# 	match_data = [{
# 		'id': c.game.id,
# 		'player1': c.game.player1.username,
# 		'player2': c.game.player2.username,
# 		'status': c.game.status,
# 		'game_number': c.game_number
# 	} for c in composed_games]

# 	return JsonResponse({
# 		'tournamentId': tournament.id,
# 		'name': tournament.name,
# 		'isStarted': tournament.is_started,
# 		'isFinished': tournament.winner is not None,
# 		'players': players,
# 		'matches': match_data
# 	})

# @login_required
# @require_POST
# @csrf_exempt
# def register_player(request):
# 	tournament = Tournament.objects.filter(is_started=False, winner__isnull=True).first()
# 	if not tournament:
# 		return JsonResponse({'status': 'error', 'message': 'No active tournament'}, status=400)

# 	payload = json.loads(request.body)
# 	alias = payload.get('alias')
	
# 	if Participate.objects.filter(tournament=tournament, player=request.user).exists():
# 		return JsonResponse({'status': 'error', 'message': 'Player already registered'}, status=400)
	
# 	order = Participate.objects.filter(tournament=tournament).count() + 1
# 	Participate.objects.create(player=request.user, tournament=tournament, alias=alias, order_of_turn=order)
# 	players = Participate.objects.filter(tournament=tournament).order_by('order_of_turn').values('player__username', 'alias')
	
# 	return JsonResponse({
# 		'status': 'player_registered',
# 		'players': list(players)
# 	})

# @login_required
# @require_POST
# @csrf_exempt
# def start_tournament(request):
# 	tournament = Tournament.objects.filter(is_started=False, winner__isnull=True).first()
# 	if not tournament:
# 		return JsonResponse({'status': 'error', 'message': 'No tournament to start'}, status=400)

# 	participants = list(Participate.objects.filter(tournament=tournament).order_by('order_of_turn'))
# 	if len(participants) < 2:
# 		return JsonResponse({'status': 'error', 'message': 'Not enough players'}, status=400)

# 	matches = []
# 	game_number = 1
	
# 	for i in range(0, len(participants), 2):
# 		if i + 1 < len(participants):
# 			game = Game.objects.create(
# 				player1=participants[i].player,
# 				player2=participants[i+1].player,
# 				status='started'
# 			)
# 			Composed.objects.create(tournament=tournament, game=game, game_number=game_number)
# 			matches.append({
# 				'id': game.id,
# 				'player1': participants[i].player.username,
# 				'player2': participants[i+1].player.username,
# 				'game_number': game_number
# 			})
# 			game_number += 1

# 	tournament.is_started = True
# 	tournament.start_date = timezone.now()
# 	tournament.save()

# 	return JsonResponse({
# 		'status': 'tournament_started',
# 		'matches': matches
# 	})

# @login_required
# @require_POST
# @csrf_exempt
# def end_tournament_match(request):
# 	payload = json.loads(request.body)
# 	game_id = payload.get('gameId')
# 	winner_id = payload.get('winnerId')

# 	game = get_object_or_404(Game, id=game_id)
# 	winner = get_object_or_404(User, id=winner_id)

# 	if game.status != 'started':
# 		return JsonResponse({'status': 'error', 'message': 'This match is already completed'}, status=400)

# 	game.winner = winner
# 	game.status = 'finished'
# 	game.save()

# 	composed = Composed.objects.get(game=game)
# 	tournament = composed.tournament
	
# 	Participate.objects.filter(
# 		Q(player=game.player1) | Q(player=game.player2),
# 		tournament=tournament
# 	).exclude(player=winner).delete()

# 	if Participate.objects.filter(tournament=tournament).count() == 1:
# 		tournament.winner = winner
# 		tournament.end_date = timezone.now()
# 		tournament.save()
# 		return JsonResponse({'status': 'tournament_ended', 'winner': winner.username})

# 	# Create next round matches
# 	players = list(Participate.objects.filter(tournament=tournament).order_by('order_of_turn'))
# 	new_matches = []
# 	game_number = Composed.objects.filter(tournament=tournament).count() + 1
	
# 	for i in range(0, len(players), 2):
# 		if i + 1 < len(players):
# 			new_game = Game.objects.create(
# 				player1=players[i].player,
# 				player2=players[i+1].player,
# 				status='started'
# 			)
# 			Composed.objects.create(tournament=tournament, game=new_game, game_number=game_number)
# 			new_matches.append({
# 				'id': new_game.id,
# 				'player1': players[i].player.username,
# 				'player2': players[i+1].player.username,
# 				'game_number': game_number
# 			})
# 			game_number += 1

# 	return JsonResponse({
# 		'status': 'match_ended',
# 		'nextMatches': new_matches
# 	})

# @login_required
# @require_POST
# @csrf_exempt
# def finish_tournament(request):
# 	tournament = Tournament.objects.filter(is_started=True, winner__isnull=True).first()
# 	if not tournament:
# 		return JsonResponse({'status': 'error', 'message': 'No active tournament to finish'}, status=400)

# 	winner = Participate.objects.filter(tournament=tournament).first()
# 	if not winner:
# 		return JsonResponse({'status': 'error', 'message': 'No winner found'}, status=400)

# 	tournament.winner = winner.player
# 	tournament.end_date = timezone.now()
# 	tournament.save()

# 	return JsonResponse({
# 		'status': 'tournament_finished',
# 		'winner': winner.player.username,
# 		'tournamentId': tournament.id,
# 		'endDate': tournament.end_date
# 	})

# @login_required
# @require_POST
# @csrf_exempt
# def cancel_tournament(request):
# 	tournament = Tournament.objects.filter(is_started=False, winner__isnull=True).first()
# 	if not tournament:
# 		return JsonResponse({'status': 'error', 'message': 'No tournament to cancel'}, status=400)

# 	tournament.delete()
# 	return JsonResponse({'status': 'tournament_canceled'})

# # from django.shortcuts import get_object_or_404
# # from django.http import JsonResponse
# # from django.contrib.auth.decorators import login_required
# # from django.views.decorators.http import require_POST
# # from django.views.decorators.csrf import csrf_exempt
# # from django.utils import timezone
# # from pong.models import Tournament, Participate, User
# # import json

# # # Cette vue gere la creation d'un tournoi en verifiant que le nom est fourni et en creant le tournoi puis en retournant les details du tournoi
# # @login_required
# # @require_POST
# # @csrf_exempt  # TO DO : ENLEVER CELA C'EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# # def create_tournament(request):
# # 	try:
# # 		payload = json.loads(request.body)
# # 		name = payload.get('name')
# # 		if not name:
# # 			return JsonResponse({'status': 'error', 'message': 'Tournament name is required'}, status=400)
		
# # 		tournament = Tournament.objects.create(name=name)
# # 		return JsonResponse({'status': 'tournament_created', 'tournament_id': tournament.id, 'name': tournament.name})
# # 	except Exception as e:
# # 		print(f"Error: {e}")  # Impression de debug en cas d'erreur
# # 		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# # @login_required
# # @require_POST
# # @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# # def player_joined_tournament(request):
# # 	payload = json.loads(request.body)
# # 	tournament_id = payload.get('tournament_id')
# # 	alias = payload.get('alias')
	
# # 	tournament = get_object_or_404(Tournament, id=tournament_id)
# # 	player = request.user

# # 	print(f"User trying to join: {player}")
# # 	# Vérifier si le joueur a deja rejoint le tournoi
# # 	if Participate.objects.filter(player=player, tournament=tournament).exists():
# # 		return JsonResponse({'status': 'error', 'message': 'Player already joined the tournament'}, status=400)
# # 		# Vérifier si l'alias est déjà utilisé dans le tournoi
# # 	if Participate.objects.filter(tournament=tournament, alias=alias).exists():
# # 		return JsonResponse({'status': 'error', 'message': 'Alias already used in the tournament'}, status=400)

# # 	# Déterminer l'ordre de tour
# # 	order_of_turn = Participate.objects.filter(tournament=tournament).count() + 1

# # 	# Créer une nouvelle participation
# # 	Participate.objects.create(player=player, tournament=tournament, alias=alias, order_of_turn=order_of_turn)
	
# # 	return JsonResponse({'status': 'player_joined', 'tournament_id': tournament.id, 'player_id': player.id, 'alias': alias, 'order_of_turn': order_of_turn})

# # # Cette vue gere l'ajout d'un joueur a un tournoi en verifiant d'abord si le joueur ou l'alias existe deja dans le tournoi puis en creant une nouvelle participation avec l'ordre de tour
# # @login_required
# # @require_POST
# # @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# # def start_tournament(request):
# # 	payload = json.loads(request.body)
# # 	tournament_id = payload.get('tournament_id')
# # 	print(tournament_id)
# # 	tournament = get_object_or_404(Tournament, id=tournament_id)
# # 	if tournament.is_started:
# # 		return JsonResponse({'status': 'error', 'message': 'Tournament already started'}, status=400)
	
# # 	tournament.is_started = True
# # 	tournament.start_date = timezone.now()
# # 	tournament.save()
	
# # 	return JsonResponse({'status': 'tournament_started', 'tournament_id': tournament.id, 'start_date': tournament.start_date})

# # # Cette vue gere la finalisation d'un tournoi en verifiant que le tournoi a commence puis en mettant a jour sa date de fin et son gagnant
# # @login_required
# # @require_POST
# # @csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# # def finish_tournament(request):
# # 	payload = json.loads(request.body)
# # 	tournament_id = payload.get('tournament_id')
# # 	winner_id = payload.get('winner_id')
	
# # 	tournament = get_object_or_404(Tournament, id=tournament_id)
# # 	winner = get_object_or_404(User, id=winner_id)
	
# # 	if not tournament.is_started:
# # 		return JsonResponse({'status': 'error', 'message': 'Tournament has not started yet'}, status=400)
	
# # 	tournament.is_started = False
# # 	tournament.end_date = timezone.now()
# # 	tournament.winner = winner
# # 	tournament.save()
	
# # 	return JsonResponse({'status': 'tournament_finished', 'tournament_id': tournament.id, 'end_date': tournament.end_date, 'winner_id': winner.id})

# # # Cette vue gere l'annulation d'un tournoi en verifiant que le tournoi n'a pas commence puis en le supprimant
# # @login_required
# # @require_POST
# # @csrf_exempt  # TO DO : ENLEVER CELA C'EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# # def cancel_tournament(request):
# # 	try:
# # 		payload = json.loads(request.body)
# # 		tournament_id = payload.get('tournament_id')

# # 		tournament = get_object_or_404(Tournament, id=tournament_id)

# # 		if tournament.is_started:
# # 			return JsonResponse({'status': 'error', 'message': 'Cannot cancel a started tournament'}, status=400)
		
# # 		tournament.delete()
# # 		return JsonResponse({'status': 'tournament_canceled', 'tournament_id': tournament_id})
# # 	except Exception as e:
# # 		print(f"Error: {e}") 
# # 		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
