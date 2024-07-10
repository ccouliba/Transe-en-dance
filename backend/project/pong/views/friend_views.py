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

# # Cette vue gere l'acceptation d'une demande d'ami en verifiant d'abord si elle est deja acceptee puis en ajoutant chaque utilisateur a la liste d'amis de l'autre et en supprimant la demande acceptee
# @login_required
# @require_POST
# @csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# def refuse_friend_request(request):
# 	payload = json.loads(request.body)
# 	request_id = payload.get('request_id')
 
# 	friend_request = get_object_or_404(Friendship, id=request_id)

# 	# Refuser la demande d'ami en supprimant l'entree dans la base de données
# 	friend_request.delete()

# 	return JsonResponse({'status': 'friend_request_refused', 'request_id': request_id})

# # Cette vue gère le retrait d'une demande d'ami envoyée
# @login_required
# @require_POST
# @csrf_exempt
# def remove_friend_request(request):
# 	payload = json.loads(request.body)
# 	request_id = payload.get('request_id')
# 	friend_request = get_object_or_404(Friendship, id=request_id, id_user_1=request.user)
# 	friend_request.delete()
# 	return JsonResponse({'status': 'success', 'message': 'Demande d\'ami retirée avec succès.'})

# # Cette vue gère la suppression d'un ami
# @login_required
# @require_POST
# @csrf_exempt
# def unfriend(request):
# 	payload = json.loads(request.body)
# 	friend_id = payload.get('friend_id')
# 	friend = get_object_or_404(User, id=friend_id)
	
# 	# Supprimer l'ami des deux côtés
# 	request.user.friends.remove(friend)
# 	friend.friends.remove(request.user)
	
# 	return JsonResponse({'status': 'success', 'message': 'Ami supprimé avec succès.'})