from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from pong.models import Tournament, Participate, User
import json

# Cette vue gere la creation d'un tournoi en verifiant que le nom est fourni et en creant le tournoi puis en retournant les details du tournoi
@login_required
@require_POST
@csrf_exempt  # TO DO : ENLEVER CELA C'EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def create_tournament(request):
	try:
		payload = json.loads(request.body)
		name = payload.get('name')
		if not name:
			return JsonResponse({'status': 'error', 'message': 'Tournament name is required'}, status=400)
		
		tournament = Tournament.objects.create(name=name)
		return JsonResponse({'status': 'tournament_created', 'tournament_id': tournament.id, 'name': tournament.name})
	except Exception as e:
		print(f"Error: {e}")  # Impression de debug en cas d'erreur
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def player_joined_tournament(request):
	payload = json.loads(request.body)
	tournament_id = payload.get('tournament_id')
	alias = payload.get('alias')
	
	tournament = get_object_or_404(Tournament, id=tournament_id)
	player = request.user

	print(f"User trying to join: {player}")
	# Vérifier si le joueur a deja rejoint le tournoi
	if Participate.objects.filter(player=player, tournament=tournament).exists():
		return JsonResponse({'status': 'error', 'message': 'Player already joined the tournament'}, status=400)
		# Vérifier si l'alias est déjà utilisé dans le tournoi
	if Participate.objects.filter(tournament=tournament, alias=alias).exists():
		return JsonResponse({'status': 'error', 'message': 'Alias already used in the tournament'}, status=400)

	# Déterminer l'ordre de tour
	order_of_turn = Participate.objects.filter(tournament=tournament).count() + 1

	# Créer une nouvelle participation
	Participate.objects.create(player=player, tournament=tournament, alias=alias, order_of_turn=order_of_turn)
	
	return JsonResponse({'status': 'player_joined', 'tournament_id': tournament.id, 'player_id': player.id, 'alias': alias, 'order_of_turn': order_of_turn})

# Cette vue gere l'ajout d'un joueur a un tournoi en verifiant d'abord si le joueur ou l'alias existe deja dans le tournoi puis en creant une nouvelle participation avec l'ordre de tour
@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def start_tournament(request):
	payload = json.loads(request.body)
	tournament_id = payload.get('tournament_id')
	print(tournament_id)
	tournament = get_object_or_404(Tournament, id=tournament_id)
	if tournament.is_started:
		return JsonResponse({'status': 'error', 'message': 'Tournament already started'}, status=400)
	
	tournament.is_started = True
	tournament.start_date = timezone.now()
	tournament.save()
	
	return JsonResponse({'status': 'tournament_started', 'tournament_id': tournament.id, 'start_date': tournament.start_date})

# Cette vue gere la finalisation d'un tournoi en verifiant que le tournoi a commence puis en mettant a jour sa date de fin et son gagnant
@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def finish_tournament(request):
	payload = json.loads(request.body)
	tournament_id = payload.get('tournament_id')
	winner_id = payload.get('winner_id')
	
	tournament = get_object_or_404(Tournament, id=tournament_id)
	winner = get_object_or_404(User, id=winner_id)
	
	if not tournament.is_started:
		return JsonResponse({'status': 'error', 'message': 'Tournament has not started yet'}, status=400)
	
	tournament.is_started = False
	tournament.end_date = timezone.now()
	tournament.winner = winner
	tournament.save()
	
	return JsonResponse({'status': 'tournament_finished', 'tournament_id': tournament.id, 'end_date': tournament.end_date, 'winner_id': winner.id})

# Cette vue gere l'annulation d'un tournoi en verifiant que le tournoi n'a pas commence puis en le supprimant
@login_required
@require_POST
@csrf_exempt  # TO DO : ENLEVER CELA C'EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def cancel_tournament(request):
	try:
		payload = json.loads(request.body)
		tournament_id = payload.get('tournament_id')

		tournament = get_object_or_404(Tournament, id=tournament_id)

		if tournament.is_started:
			return JsonResponse({'status': 'error', 'message': 'Cannot cancel a started tournament'}, status=400)
		
		tournament.delete()
		return JsonResponse({'status': 'tournament_canceled', 'tournament_id': tournament_id})
	except Exception as e:
		print(f"Error: {e}") 
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)