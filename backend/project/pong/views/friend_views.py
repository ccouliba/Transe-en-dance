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
	to_user_id = payload.get('to_user_id')
	to_user = get_object_or_404(User, id=to_user_id)
	
	# Vérifier si l'utilisateur essaie de s'envoyer une demande d'ami
	if request.user == to_user:
		return JsonResponse({'status': 'error', 'message': 'Vous ne pouvez pas vous envoyer une demande d\'ami à vous-même.'}, status=400)
	
	# Vérifier si une demande existe déjà
	existing_request = Friendship.objects.filter(id_user_1=request.user, id_user_2=to_user).first()
	if existing_request:
		return JsonResponse({'status': 'error', 'message': 'Demande d\'ami déjà envoyée.'}, status=400)
	
	# Créer une nouvelle demande d'ami
	friend_request = Friendship.objects.create(id_user_1=request.user, id_user_2=to_user)
	return JsonResponse({'status': 'success', 'message': 'Demande d\'ami envoyée avec succès.'})

@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def accept_friend_request(request):
	payload = json.loads(request.body)
	request_id = payload.get('request_id')

	print(request_id)
	print(request.user)
 
	friend_request = get_object_or_404(Friendship, id=request_id)
	
	# Verifier si la demande est déjà acceptee
	if friend_request.id_user_1.friends.filter(id=friend_request.id_user_2.id).exists():
		return JsonResponse({'status': 'error', 'message': 'Friend request already accepted'}, status=400)

	# Accepter la demande d'ami
	sender   = friend_request.id_user_1
	receiver = friend_request.id_user_2
 
 
	sender.friends.add(receiver)
	receiver.friends.add(sender)
 
	sender.save()
	receiver.save()
 
	# Supprimer la demande d'ami car elle est maintenant acceptée
	friend_request.delete()

	return JsonResponse({'status': 'friend_request_accepted', 'request_id': friend_request.id})

# Cette vue gere l'acceptation d'une demande d'ami en verifiant d'abord si elle est deja acceptee puis en ajoutant chaque utilisateur a la liste d'amis de l'autre et en supprimant la demande acceptee
@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def refuse_friend_request(request):
	payload = json.loads(request.body)
	request_id = payload.get('request_id')
 
	friend_request = get_object_or_404(Friendship, id=request_id)

	# Refuser la demande d'ami en supprimant l'entree dans la base de données
	friend_request.delete()

	return JsonResponse({'status': 'friend_request_refused', 'request_id': request_id})

# Cette vue gère le retrait d'une demande d'ami envoyée
@login_required
@require_POST
@csrf_exempt
def remove_friend_request(request):
	payload = json.loads(request.body)
	request_id = payload.get('request_id')
	friend_request = get_object_or_404(Friendship, id=request_id, id_user_1=request.user)
	friend_request.delete()
	return JsonResponse({'status': 'success', 'message': 'Demande d\'ami retirée avec succès.'})

# Cette vue gère la suppression d'un ami
@login_required
@require_POST
@csrf_exempt
def unfriend(request):
	payload = json.loads(request.body)
	friend_id = payload.get('friend_id')
	friend = get_object_or_404(User, id=friend_id)
	
	# Supprimer l'ami des deux côtés
	request.user.friends.remove(friend)
	friend.friends.remove(request.user)
	
	return JsonResponse({'status': 'success', 'message': 'Ami supprimé avec succès.'})