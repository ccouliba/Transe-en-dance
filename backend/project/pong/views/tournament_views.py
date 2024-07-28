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