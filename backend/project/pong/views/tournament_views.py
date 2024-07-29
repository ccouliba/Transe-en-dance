from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import transaction
from pong.models import Tournament, User
import json

@csrf_exempt
@require_http_methods(["POST"])
@login_required
def create_tournament(request):
	try:
		data = json.loads(request.body)
		name = data.get('name')

		if not name:
			return JsonResponse({'status': 'error', 'message': 'Tournament name required.'}, status=400)

		tournament = Tournament.objects.create(name=name, aliases=[]) #alias est une liste vide
  
		tournament.participants.add(request.user)

		tournament_data = {
			'id': tournament.id,
			'name': tournament.name,
			'is_started': tournament.is_started,
			'start_date': tournament.start_date.isoformat() if tournament.start_date else None,
			'aliases': tournament.aliases,
		}

		return JsonResponse({'status': 'success', 'tournament': tournament_data})
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
	

@login_required
def tournament_view(request):
	latest_tournament = Tournament.objects.filter(participants=request.user).order_by('-created_at').first()
	if latest_tournament:
		# Traitement des aliases pour s'assurer qu'ils sont dans le bon format
		formatted_aliases = []
		for alias in latest_tournament.aliases:
			if isinstance(alias, dict) and 'username' in alias and 'alias' in alias:
				formatted_aliases.append(alias)
			elif isinstance(alias, str):
				# Si c'est une ancienne entrée (juste une chaîne), on ajoute un username par défaut
				formatted_aliases.append({'username': 'Unknown', 'alias': alias})
			else:
				# Si le format n'est pas reconnu, on l'ignore
				continue

		tournament_data = {
			'id': latest_tournament.id,
			'name': latest_tournament.name,
			'is_started': latest_tournament.is_started,
			'start_date': latest_tournament.start_date.isoformat() if latest_tournament.start_date else None,
			'end_date': latest_tournament.end_date.isoformat() if latest_tournament.end_date else None,
			'created_at': latest_tournament.created_at.isoformat(),
			'participants': [participant.username for participant in list(latest_tournament.participants.all())],
			'aliases': formatted_aliases,
		}
	   
		return JsonResponse({
			'status': 'success',
			'tournament': tournament_data
		})
	else:
		return JsonResponse({
			'status': 'success',
			'tournament': None
		})

from django.shortcuts import get_object_or_404
@login_required
def tournament_detail(request, tournament_id):
	# Récupérer le tournoi ou renvoyer une 404 si non trouvé
	tournament = get_object_or_404(Tournament, id=tournament_id)
	
	# Récupérer la liste des participants
	participants = tournament.participants.all().values('id', 'username')

	# Préparer les données du tournoi
	tournament_data = {
		'id': tournament.id,
		'name': tournament.name,
		'is_started': tournament.is_started,
		'start_date': tournament.start_date.isoformat() if tournament.start_date else None,
		'participants': list(participants),
		'aliases': tournament.aliases
	}

	return JsonResponse({
		'status': 'success',
		'tournament': tournament_data
	})

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def add_participants(request, tournament_id):
	try:
		tournament = get_object_or_404(Tournament, id=tournament_id)
		
		data = json.loads(request.body)
		participant_usernames = data.get('participants', [])
		
		added_participants = []
		not_found_participants = []
		already_in_tournament = []
		
		for username in participant_usernames:
			try:
				user = User.objects.get(username=username)
				if user not in tournament.participants.all():
					tournament.participants.add(user)
					added_participants.append(username)
				else:
					already_in_tournament.append(username)
			except User.DoesNotExist:
				not_found_participants.append(username)
		
		response = {
			'status': 'success',
			'message': f'Added {len(added_participants)} participants to the tournament.',
			'added_participants': added_participants,
			'not_found_participants': not_found_participants,
			'already_in_tournament': already_in_tournament
		}
		
		if not added_participants and (not_found_participants or already_in_tournament):
			response['status'] = 'warning'
			if not_found_participants:
				response['message'] = 'Some users were not found.'
			elif already_in_tournament:
				response['message'] = 'All specified users are already in the tournament.'
		
		return JsonResponse(response)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def add_alias(request, tournament_id):
	try:
		tournament = get_object_or_404(Tournament, id=tournament_id)
		
		data = json.loads(request.body)
		new_username = data.get('username')
		new_alias = data.get('alias')
		
		if not new_username or not new_alias:
			return JsonResponse({'status': 'error', 'message': 'Both username and alias are required.'}, status=400)

		if not tournament.participants.filter(username=new_username).exists():
			return JsonResponse({'status': 'error', 'message': 'The user is not a participant in this tournament.'}, status=400)

		new_alias_obj = {'username': new_username, 'alias': new_alias}
		
		if new_alias_obj not in tournament.aliases:
			tournament.aliases.append(new_alias_obj)
			tournament.save()
			
			return JsonResponse({
				'status': 'success',
				'message': f'Alias "{new_alias}" added successfully for user "{new_username}".',
				'aliases': tournament.aliases
			})
		else:
			return JsonResponse({
				'status': 'warning',
				'message': f'Alias "{new_alias}" for user "{new_username}" already exists in this tournament.',
				'aliases': tournament.aliases
			})
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


from django.utils import timezone
@login_required
@csrf_exempt
@require_http_methods(["POST"])
def start_tournament(request, tournament_id):
	try:
		tournament = get_object_or_404(Tournament, id=tournament_id)
		
		if tournament.is_started:
			return JsonResponse({'status': 'error', 'message': 'Tournament has already started.'}, status=400)
		
		if tournament.participants.count() < 2:
			return JsonResponse({'status': 'error', 'message': 'At least two participants are required to start the tournament.'}, status=400)
		
		tournament.is_started = True
		tournament.start_date = timezone.now()
		tournament.save()
		

		
		return JsonResponse({
			'status': 'success',
			'message': 'Tournament started successfully.',
			'tournament_id': tournament.id
		})
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=400)



from django.db.models import Sum, Case, When
from pong.models import Tournament, Game, Composed
from itertools import combinations
from django.db.models import Q, F
from django.db.models import IntegerField


def get_matches(aliases, composed_games):
    
    matches = [
		{
			'id': cg.game.id,
			'player1': {
				'username': cg.game.player1.username,
				'alias': aliases.get(cg.game.player1.username)
			},
			'player2': {
				'username': cg.game.player2.username,
				'alias': aliases.get(cg.game.player2.username)
			},
			'player1_score': cg.game.player1_score,
			'player2_score': cg.game.player2_score,
			'status': cg.game.status
		} for cg in composed_games
	]
    
    return matches

def get_rankings(matches, aliases):
    rankings = {}
    
    for match in matches:
        player1 = match['player1']['username']
        player2 = match['player2']['username']
        
        # Initialiser les joueurs s'ils n'existent pas encore dans les rankings
        if player1 not in rankings:
            rankings[player1] = {'username': player1, 'alias': aliases.get(player1), 'wins': 0, 'total_score': 0}
        if player2 not in rankings:
            rankings[player2] = {'username': player2, 'alias': aliases.get(player2), 'wins': 0, 'total_score': 0}
        
        # Mettre à jour les scores totaux
        rankings[player1]['total_score'] += match['player1_score']
        rankings[player2]['total_score'] += match['player2_score']
        
        # Mettre à jour les victoires si le match est terminé
        if match['status'] == 'finished':
            if match['player1_score'] > match['player2_score']:
                rankings[player1]['wins'] += 1
            elif match['player2_score'] > match['player1_score']:
                rankings[player2]['wins'] += 1
            # En cas d'égalité, on ne compte pas de victoire
    
    # Convertir le dictionnaire en liste et trier par victoires puis par score total
    sorted_rankings = sorted(
        rankings.values(),
        key=lambda x: (x['wins'], x['total_score']),
        reverse=True
    )
    
    return sorted_rankings



@login_required
def tournament_matchmaking(request, tournament_id):
	tournament = get_object_or_404(Tournament, id=tournament_id)
   
	if not tournament.is_started:
		return JsonResponse({'status': 'error', 'message': 'Tournament has not started yet.'}, status=400)
   
	participants = list(tournament.participants.all())
	
	# Get aliases
	aliases = {alias['username']: alias['alias'] for alias in tournament.aliases}
   
	# Generate all possible matches if they don't exist
	if Composed.objects.filter(tournament=tournament).count() == 0:
		matches = list(combinations(participants, 2))
		for i, (player1, player2) in enumerate(matches):
			game = Game.objects.create(player1=player1, player2=player2, status='pending')
			Composed.objects.create(tournament=tournament, game=game, game_number=i+1)
   
	# Fetch all matches
	composed_games = Composed.objects.filter(tournament=tournament).select_related('game')
	matches = get_matches(aliases, composed_games)
   
	rankings = get_rankings(matches, aliases)
	# Determine winner if all games are finished
	winner = None
	if all(match['status'] == 'finished' for match in matches):
		winner = rankings[0]['username']
   
	return JsonResponse({
		'status': 'success',
		'matches': matches,
		'rankings': rankings,
		'winner': winner,
		'aliases': aliases
	})
 
 
@login_required
@require_http_methods(["POST"])
@csrf_exempt

def finish_tournament(request, tournament_id):
	try:
		tournament = Tournament.objects.get(id=tournament_id)
		if not tournament.is_started:
			return JsonResponse({'status': 'error', 'message': 'Tournament is not started.'}, status=400)
		
		tournament.end_date = timezone.now()
		tournament.save()
		
		return JsonResponse({'status': 'success', 'message': 'Tournament finished successfully.'})
	except Tournament.DoesNotExist:
		return JsonResponse({'status': 'error', 'message': 'Tournament not found.'}, status=404)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

import logging

logger = logging.getLogger(__name__)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def update_match_score(request):
	try:
		data = json.loads(request.body)
		logger.info(f"Received data: {data}")

		match_id = data.get('match_id')
		player1_score = data.get('player1_score')
		player2_score = data.get('player2_score')
		winner = data.get('winner')

		logger.info(f"Updating match {match_id}: {player1_score} - {player2_score}, winner: {winner}")

		game = get_object_or_404(Game, id=match_id)
		logger.info(f"Found game: {game}")
		
		# Update game scores
		game.player1_score = player1_score
		game.player2_score = player2_score
		game.status = 'finished'
		
		# Determine winner
		if game.player1.username == winner:
			game.winner = game.player1
		elif game.player2.username == winner:
			game.winner = game.player2

		game.save()
		logger.info(f"Game updated: {game}")

		# Update tournament rankings
		composed = get_object_or_404(Composed, game=game)
		tournament = composed.tournament
		logger.info(f"Updating rankings for tournament: {tournament}")

		# Recalculate tournament rankings
		participants = tournament.participants.all()
		rankings = []
		for player in participants:
			wins = Game.objects.filter(
				(Q(player1=player, winner=player) | Q(player2=player, winner=player)),
				composed__tournament=tournament,
				status='finished'
			).count()
			
			total_score = Game.objects.filter(
				Q(player1=player) | Q(player2=player),
				composed__tournament=tournament,
				status='finished'
			).aggregate(
				total=Sum(Case(
					When(player1=player, then='player1_score'),
					When(player2=player, then='player2_score'),
					default=0,
					output_field=IntegerField()
				))
			)['total'] or 0

			rankings.append({
				'username': player.username,
				'wins': wins,
				'total_score': total_score
			})

		# Sort rankings
		rankings.sort(key=lambda x: (-x['wins'], -x['total_score']))

		logger.info(f"Final rankings: {rankings}")

		# Check if the tournament is finished
		all_games_finished = not Game.objects.filter(
			composed__tournament=tournament,
			status='pending'
		).exists()

		return JsonResponse({
			'status': 'success',
			'message': 'Match score updated successfully.',
			'rankings': rankings,
			'tournament_finished': all_games_finished
		})

	except Exception as e:
		logger.error(f"Error in update_match_score: {str(e)}", exc_info=True)
		return JsonResponse({'status': 'error', 'message': str(e)}, status=400)