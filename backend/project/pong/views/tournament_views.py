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

		tournament = Tournament.objects.create(name=name)

		tournament_data = {
			'id': tournament.id,
			'name': tournament.name,
			'is_started': tournament.is_started,
			'start_date': tournament.start_date.isoformat() if tournament.start_date else None,
		}

		return JsonResponse({'status': 'success', 'tournament': tournament_data})
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
	

@login_required
def tournament_view(request):
	tournaments = Tournament.objects.all()
	
	tournament_data = [{
		'id': tournament.id,
		'name': tournament.name,
		'is_started': tournament.is_started,
		'start_date': tournament.start_date.isoformat() if tournament.start_date else None,
		'participants_count': tournament.participants.count(),
	} for tournament in tournaments]
	
	return JsonResponse({
		'status': 'success',
		'tournaments': tournament_data
	})