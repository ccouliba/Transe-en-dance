from django.template import loader
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import login, authenticate
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .forms import RegisterForm
from .models import Game, Friendship
from django.contrib import messages
from .models import User
from .forms import RegisterForm
from . import auth
import os
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
import json

@login_required
def user_list(request):
	users = list(User.objects.all())    
	viewModels = [ user.email for user in users]
	return JsonResponse(viewModels, safe=False)


def index(request):
	template = loader.get_template('pong/index.html')
	return HttpResponse(template.render())

@login_required
def home_view(request):
	return render(request, 'pong/home.html')

@login_required
def logout_view(request):
	logout(request)
	return redirect('/pong/login')

def register_view(request):
	if request.method == 'POST':
		form = RegisterForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user) # apres register = connecter le user
			print("Enregistrement réussi")  # Message de succès
			return redirect('/pong/login')  # Redirige vers la page de connexion après l'enregistrement
		else:
			print("Formulaire non valide")
			print(form.errors)  # Affiche les erreurs du formulaire pour le débogage
	else:
		form = RegisterForm()
		print("Affichage du formulaire d'inscription")  # Message lors de l'affichage du formulaire
	return render(request, 'pong/register.html', {'form': form})


def login_view(request):
	if request.method == 'POST':
		form = AuthenticationForm(request, data=request.POST)
		if form.is_valid():
			username = form.cleaned_data['username']
			password = form.cleaned_data['password']
			user = authenticate(username=username, password=password)
			if user is not None:
				login(request, user)
				return redirect('/pong/home')  # Redirige vers la page d'accueil après la connexion
			else:
				print("Authentification échouée")
		else:
			print("Formulaire non valide")
			print(form.errors)  # Affiche les erreurs du formulaire pour le débogage
		return redirect('/pong/login')
	else:
		form = AuthenticationForm()
	return render(request, 'pong/login.html', {'form': form})



@login_required
def play(request):
	return render(request, 'pong/play.html')

def external_login_view(request):
	forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
	redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id # sauvegarder le client_id dans la session
	response_type = 'code'
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

def auth_callback(request):
	api_response = auth.get_response_from_api(request)
	if api_response is None:
		# print(api_response, "response_code =", api_response.status_code)
		return redirect('/pong/login')    
	elif api_response.status_code == 200:
		token_data = api_response.json()
		access_token = token_data.get('access_token')
		# request.session['access_token'] = access_token # a rajouter pour pour sauvegarder l'access_token dans la session ?
		return auth.get_user_from_api(request, access_token)
	return HttpResponse("Authentication failed", status=401)



#everything for the user

@login_required
def profile_view(request):
	return render(request, 'pong/profile.html')

@login_required
def user_updated_profile(request):
	if request.method == 'POST':
		form = UserChangeForm(request.POST, instance=request.user) # CECI EST DE LA MAGIE : formulaire fourni par django
		if form.is_valid():
			form.save()
			return redirect('/pong/profile')  
			# return redirect('pong/profile.html')  
	else:
		form = UserChangeForm(instance=request.user)
	return render(request, 'pong/update.html', {'form': form})

@login_required
def user_password_changed(request):
	if request.method == 'POST':
		form = PasswordChangeForm(user=request.user, data=request.POST) # CECI EST DE LA MAGIE : formulaire fourni par django
		if form.is_valid():
			form.save()
			update_session_auth_hash(request, form.user)  # Important pour maintenir la session active
			return redirect('/pong/profile')  
			# return redirect('pong/profile.html')  
	else:
		form = PasswordChangeForm(user=request.user)
	return render(request, 'pong/change_password.html', {'form': form})

#  This view is causes some trouble on reverse html on success !
# That is why i have done this ; for now we could use the view below instead
# @login_required
# def user_account_deleted(request):
#     user = request.user
#     user.delete()
#     return redirect('pong/home.html')

# Can be changed any time ! Just a simple view linked to a template/form that works
@login_required
def user_account_deleted(request):
	user = request.user
	user.delete()
	return redirect('pong/home.html')  

##########################lets the game begin...

def game(request):
	return render(request, 'pong/game.html')



import json
from django.views.decorators.csrf import csrf_exempt

@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def start_game(request):
	player = request.user  # Recupere l'utilisateur actuellement connecte
	payload = json.loads(request.body)  # Recupere le corps de la requete HTTP et le convertit en dictionnaire python
	opponent_id = payload['opponent_id']  # Recupere l'identifiant de l'adversaire depuis le dictionnaire
	opponent = User.objects.get(id=opponent_id)  # On a l'id donc maintenant on recupere l'objet utilisateur de l'adversaire depuis la base de donnees
	# Cree un nouvel objet Game avec les joueurs et le statut 'started'
	game = Game.objects.create(player1=player, player2=opponent, status='started')
	request.session['game_id'] = game.id #sauvegarder l'utilisateur player dans la session
	# Retourne une reponse JSON avec l'identifiant du jeu et le statut
	return JsonResponse({'game_id': game.id, 'status': 'started'})

@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def update_score(request):
	payload = json.loads(request.body)
	game_id = payload['game_id']
	player_id = payload['player_id']
	new_score = payload['new_score']
	
	# game_id = request.POST.get('game_id')
	# player_id = request.POST.get('player_id')
	# new_score = request.POST.get('new_score')
	
	game = Game.objects.get(id=game_id)
	if game.status == 'started':
		if game.player1.id == player_id:
			game.player1_score = new_score
		elif game.player2.id == player_id:
			game.player2_score = new_score
		game.save()
		return JsonResponse({'status': 'score_updated', 'game_id': game.id})
	
	return JsonResponse({'status': 'error', 'message': 'Game not in progress'}, status=400)

@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def finish_game(request):
	payload = json.loads(request.body)
	game_id = payload['game_id']
	winner_id = payload['winner_id']
	# game_id = request.POST.get('game_id')
	# winner_id = request.POST.get('winner_id')
	game = Game.objects.get(id=game_id)
	game.status = 'finished'
	game.winner = User.objects.get(id=winner_id)
	game.save()
	
	return JsonResponse({'status': 'finished', 'game_id': game.id, 'winner': game.winner.id})


@login_required
@require_POST
@csrf_exempt # TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def cancel_game(request):
	payload = json.loads(request.body)
	game_id = payload['game_id']
	# game_id = request.POST.get('game_id')
	game = Game.objects.get(id=game_id)
	game.status = 'canceled'
	game.save()
	return JsonResponse({'status': 'canceled', 'game_id': game.id})

##########################friends stuff...

@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def send_friend_request(request):
	payload = json.loads(request.body)
	to_user_id = payload.get('to_user_id')
	to_user = get_object_or_404(User, id=to_user_id)
	print("request.user is: ",request.user, "to_user is: ",to_user)
	# Verifier si une demande existe deja
	existing_request = Friendship.objects.filter(id_user_1=request.user, id_user_2=to_user).first()
	if existing_request:
		print("existing_request.id is ", existing_request.id)
		return JsonResponse({'status': 'error', 'message': 'Friend request already sent'}, status=400)

	# Creer une nouvelle demande d'ami
	friend_request = Friendship.objects.create(id_user_1=request.user, id_user_2=to_user)
	print("friend_request.id is : ", friend_request.id)
	return JsonResponse({'status': 'friend_request_sent', 'request_id': friend_request.id})

@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def accept_friend_request(request):
	print("HELLO")
	payload = json.loads(request.body)
	request_id = payload.get('request_id')

	print(request_id)
	print(request.user)
 
 
	friend_request = get_object_or_404(Friendship, id=request_id, id_user_2=request.user)

	# Verifier si la demande est déjà acceptee
	if friend_request.id_user_1.friends.filter(id=friend_request.id_user_2.id).exists():
		return JsonResponse({'status': 'error', 'message': 'Friend request already accepted'}, status=400)

	# Accepter la demande d'ami
	request.user.friends.add(friend_request.id_user_1)
	friend_request.id_user_1.friends.add(request.user)

	# Supprimer la demande d'ami car elle est maintenant acceptée
	friend_request.delete()

	return JsonResponse({'status': 'friend_request_accepted', 'request_id': friend_request.id})


@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def refuse_friend_request(request):
	payload = json.loads(request.body)
	request_id = payload.get('request_id')
	friend_request = get_object_or_404(Friendship, id=request_id, id_user_2=request.user)

	# Refuser la demande d'ami en supprimant l'entree dans la base de données
	friend_request.delete()

	return JsonResponse({'status': 'friend_request_refused', 'request_id': request_id})
##########################tournament stuff...