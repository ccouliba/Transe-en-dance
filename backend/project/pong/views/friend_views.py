from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from pong.models import User, Friendship
import json

# Cette vue gere l'envoi d'une demande d'ami entre deux utilisateurs en verifiant d'abord si une demande existe deja puis en creant une nouvelle demande si necessaire
@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def send_friend_request(request):
	payload = json.loads(request.body)
	to_email = payload.get('email')
	try:
		to_user = User.objects.get(email=to_email)
	except User.DoesNotExist:
		return JsonResponse({'status': 'error', 'message': 'Utilisateur non trouvé.'}, status=404)
   
	# Vérifier si l'utilisateur essaie de s'envoyer une demande d'ami
	if request.user == to_user:
		return JsonResponse({'status': 'error', 'message': 'Vous ne pouvez pas vous envoyer une demande d\'ami à vous-même.'}, status=400)
   
	# Vérifier si une demande existe déjà
	existing_request = Friendship.objects.filter(id_user_1=request.user, id_user_2=to_user).first()
	if existing_request:
		return JsonResponse({'status': 'error', 'message': 'Demande d\'ami déjà envoyée.'}, status=400)
   
	# Vérifier si les utilisateurs sont déjà amis
	if request.user.friends.filter(id=to_user.id).exists():
		return JsonResponse({'status': 'error', 'message': 'Vous êtes déjà amis avec cet utilisateur.'}, status=400)

	# Créer une nouvelle demande d'ami
	friend_request = Friendship.objects.create(id_user_1=request.user, id_user_2=to_user)

	return JsonResponse({
		'status': 'success',
		'message': 'Demande d\'ami envoyée avec succès.',
		'requested_user': {
			'id': to_user.id,
			'username': to_user.username,
			'email': to_user.email
		},
		'request': {
			'id': friend_request.id
		}
	})

@login_required
@require_POST
@csrf_exempt
def accept_friend_request(request):
	try:
		payload = json.loads(request.body)
		from_email = payload.get('email')
		
		from_user = get_object_or_404(User, email=from_email)
		
		# Vérifier si une demande existe
		friend_request = Friendship.objects.filter(id_user_1=from_user, id_user_2=request.user).first()
		if not friend_request:
			return JsonResponse({'status': 'error', 'message': 'Aucune demande d\'ami en attente de cet utilisateur.'}, status=400)
		
		# Accepter la demande d'ami
		request.user.friends.add(from_user)
		from_user.friends.add(request.user)
		
		# Supprimer la demande d'ami
		friend_request.delete()
		
		return JsonResponse({
			'status': 'success',
			'message': 'Demande d\'ami acceptée avec succès.',
			'new_friend': {
				'id': from_user.id,
				'username': from_user.username,
				'email': from_user.email
			}
		})
	except User.DoesNotExist:
		return JsonResponse({'status': 'error', 'message': 'Utilisateur non trouvé'}, status=404)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@login_required
@require_POST
@csrf_exempt
def remove_friend(request):
	try:
		payload = json.loads(request.body)
		friend_email = payload.get('email')
		
		friend = User.objects.get(email=friend_email)
		
		if friend not in request.user.friends.all():
			return JsonResponse({'status': 'error', 'message': 'Cet utilisateur n\'est pas dans votre liste d\'amis.'}, status=400)
		
		request.user.friends.remove(friend)
		friend.friends.remove(request.user)
		
		return JsonResponse({
			'status': 'success',
			'message': 'Ami supprimé avec succès.',
		})
	except User.DoesNotExist:
		return JsonResponse({'status': 'error', 'message': 'Utilisateur non trouvé'}, status=404)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@login_required
@csrf_exempt
def friends_data(request):
	user = request.user
	
	# Obtenir les amis
	friends = user.friends.all()
	
	# Obtenir les demandes d'amitié envoyées
	sent_requests = Friendship.objects.filter(id_user_1=user).exclude(id_user_2__in=user.friends.all())
	
	# Obtenir les demandes d'amitié reçues
	received_requests = Friendship.objects.filter(id_user_2=user).exclude(id_user_1__in=user.friends.all())

	return JsonResponse({
		'friends': [{'username': friend.username, 'email': friend.email} for friend in friends],
		'sentRequests': [{'username': req.id_user_2.username, 'email': req.id_user_2.email} for req in sent_requests],
		'receivedRequests': [{'username': req.id_user_1.username, 'email': req.id_user_1.email} for req in received_requests],
	})

from typing import List
from django.utils import timezone
from datetime import timedelta

def	are_user_online(friends:List[User]):
	statuses = []
	now = timezone.now()
	threshold = timedelta(seconds=100)  #definir la periode pour considerer un user comme en ligne 
	for friend in friends:
		if friend.last_activity is None:
			is_online = False
		else:
			time_since_last_activity = now - friend.last_activity #difference entre maintenant et derniere activite du user
			print(time_since_last_activity, friend.last_activity)
			is_online = time_since_last_activity < threshold #verifier si cette différence est inferieure au seuil (threshold)
		statuses.append(is_online) 
	return statuses

# def	are_user_online(friends:List[User]):
# 	statuses = []
# 	for friend in friends:
# 		is_online = friend.last_activity
# 		statuses.append(is_online) 
# 	return statuses

@login_required
@csrf_exempt
def friends_online_status(request):
	user = request.user
	friends = user.friends.all()
	statuses = are_user_online(friends)
	payload = {"statuses":statuses}
	return JsonResponse(payload)