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
from .models import Game, Friendship, Tournament
from django.contrib import messages
from .models import User
from .forms import RegisterForm
from . import auth
import os
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
import json
from django.utils import timezone
from .models import Participate
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
# view pour tester et lister les emails des users (sur l'url /users/)
@login_required
def user_list(request):
	users = list(User.objects.all())    
	viewModels = [ user.email for user in users]
	return JsonResponse(viewModels, safe=False)


def index(request):
	template = loader.get_template('pong/index.html')
	return HttpResponse(template.render())

# vue pour afficher la page d'accueil
# render => combines a template with a given context dictionary and returns an HttpResponse object with that rendered tex
@login_required
def home_view(request):
	return render(request, 'pong/home.html')

# vue pour gerer la deconnexion de l'utilisateur
@login_required
def logout_view(request):
	logout(request) #fonction de django
	return redirect('/pong/login')

# Cette vue gere l'inscription des nouveaux utilisateurs
# User clique sur bouton pour s'inscrire. GET -> recuperer formulaire d'inscription (RegisterForm())
# User remplit le formulaire et clique sur bouton pour soumettre. POST -> envoyer formulaire d'inscription
# - Si la methode HTTP est POST => on traite le formulaire d'inscription
# 	- Si le formulaire est valide => l'utilisateur est enregistre et connecte automatiquement et l'utilisateur est redirige vers la page de connexion
# 	- Si le formulaire n'est pas valide => les erreurs sont affichees pour le debug
# - Si la methode HTTP n'est pas POST => elle affiche un formulaire d'inscription vide
def register_view(request):
	if request.method == 'POST':
		form = RegisterForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user) 
			print("Enregistrement reussi") 
			return redirect('/pong/login')  
		else:
			print("Formulaire non valide")
			print(form.errors)  
	else:
		form = RegisterForm()
		print("Affichage du formulaire d'inscription") 
	return render(request, 'pong/register.html', {'form': form})


# Cette vue gere la connexion des utilisateurs
# - Si la methode HTTP est POST => elle traite le formulaire de connexion
# 	- Si le formulaire est valide => elle authentifie l'utilisateur avec les informations 
#		- Si l'authentification reussit => l'utilisateur est connecte et redirige vers la page d'accueil
#		- Si l'authentification echoue ou si le formulaire n'est pas valide => les erreurs sont affichees pour le debogage
# - Si la methode HTTP n'est pas POST => elle affiche un formulaire de connexion vide
def login_view(request):
	if request.method == 'POST':
		form = AuthenticationForm(request, data=request.POST) #AuthenticationForm = formulaire de Django pour gerer l'authentification 
		if form.is_valid():
			username = form.cleaned_data['username'] # cleaned_data => dictionary of validated form 
			password = form.cleaned_data['password']
			user = authenticate(username=username, password=password) # compare les informations d'identification (nom d'utilisateur et mdp) avec les informations stockees dans la bdd
			if user is not None:
				login(request, user)
				return redirect('/pong/home')  # Redirige vers la page d'accueil après la connexion
			else:
				print("Authentification échouée")
		else:
			print("Formulaire non valide")
			print(form.errors)  # Affiche les erreurs du formulaire pour le debug
		return redirect('/pong/login')
	else:
		form = AuthenticationForm()
	return render(request, 'pong/login.html', {'form': form})


# Cette vue restreint l'acces à la page de jeu uniquement aux utilisateurs connectés et retourne la page html 
@login_required
def play(request):
	return render(request, 'pong/play.html')

# Cette vue gere l'authentification via l'API d'Intra 42 en redirigeant l'utilisateur vers l'URL d'authentification appropriee
def external_login_view(request):
	forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
	redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id # sauvegarder le client_id dans la session
	response_type = 'code'
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

# Cette vue gere le callback de l'authentification (ie la reponse recue apres que l'utilisateur ait autorise l'application via l'authentification via l'API d'Intra 42)
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

#Cette vue affiche le profil de l'utilisateur connecte en rendant la page HTML appropriee
@login_required
def profile_view(request):
	return render(request, 'pong/profile.html')

#Cette vue permet a l'utilisateur connecte de mettre a jour son profil en utilisant un formulaire fourni par Django
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

# Cette vue permet a l'utilisateur connecte de changer son mot de passe en utilisant un formulaire fourni par Django
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
# Cette vue permet a l'utilisateur connecte de supprimer son compte et de rediriger vers la page d'accueil
@login_required
def user_account_deleted(request):
	user = request.user
	user.delete()
	return redirect('pong/home.html')  

##########################lets the game begin...

# Cette vue rend la page HTML du jeu 
def game(request):
	return render(request, 'pong/game.html')



import json
from django.views.decorators.csrf import csrf_exempt

# Cette vue permet a l'utilisateur connecte de demarrer une nouvelle partie de pong avec un adversaire specifie
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

#Cette vue met a jour le score d'un joueur dans une partie en cours de Pong
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

#Cette vue termine une partie de Pong en mettant a jour son statut et en enregistrant le gagnant
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

#Cette vue permet a l'utilisateur connecte d'annuler une partie de Pong en mettant a jour son statut
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

# Cette vue gere l'envoi d'une demande d'ami entre deux utilisateurs en verifiant d'abord si une demande existe deja puis en creant une nouvelle demande si necessaire
@login_required
@require_POST
@csrf_exempt# TO DO : ENLEVER CELA C EST JUSTE POUR LES TESTS AVEC POSTMAN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
def send_friend_request(request):
	payload = json.loads(request.body)
	to_user_id = payload.get('to_user_id')
	to_user = get_object_or_404(User, id=to_user_id)
	print("request.user is: ",request.user, "to_user is: ",to_user)
	# Verifier si une demande existe deja
	# Rappel Friendship = class/model qui stock les demandes d'amis uniquement
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

##########################tournament stuff...
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

# RGPD stuff 

@login_required
def get_active_user_info(request):
	user = request.user
	user_info = {
		'id': user.id,
		'username': user.username,
		'email': user.email,
		'first_name': user.first_name,
		'last_name': user.last_name,
		'creation_date': user.creation_date,
		'langue': user.langue,
		'avatar': user.avatar,
		'friends': list(user.friends.values('id', 'username', 'email')),
		'groups': list(user.groups.values('id', 'name')),
		'user_permissions': list(user.user_permissions.values('id', 'name', 'codename')),
	}

	# Si le paramètre `format` est 'pdf', générer et retourner un PDF
	if request.GET.get('format') == 'pdf':
		# Créer un buffer pour le PDF
		buffer = BytesIO()
		# Créer un canevas pour le PDF
		p = canvas.Canvas(buffer, pagesize=letter)
		# Définir les coordonnées de départ pour le texte
		start_y = 750
		line_height = 15

		# Ajouter les informations utilisateur au PDF
		p.drawString(100, start_y, f"ID: {user_info['id']}")
		p.drawString(100, start_y - line_height, f"Username: {user_info['username']}")
		p.drawString(100, start_y - 2 * line_height, f"Email: {user_info['email']}")
		p.drawString(100, start_y - 3 * line_height, f"First Name: {user_info['first_name']}")
		p.drawString(100, start_y - 4 * line_height, f"Last Name: {user_info['last_name']}")
		p.drawString(100, start_y - 5 * line_height, f"Creation Date: {user_info['creation_date']}")
		p.drawString(100, start_y - 6 * line_height, f"Langue: {user_info['langue']}")
		p.drawString(100, start_y - 7 * line_height, f"Avatar: {user_info['avatar']}")

		# Ajouter les amis
		p.drawString(100, start_y - 9 * line_height, "Friends:")
		for i, friend in enumerate(user_info['friends']):
			p.drawString(120, start_y - (10 + i) * line_height, f"{friend['username']} ({friend['email']})")

		# Ajouter les groupes
		p.drawString(100, start_y - (11 + len(user_info['friends'])) * line_height, "Groups:")
		for i, group in enumerate(user_info['groups']):
			p.drawString(120, start_y - (12 + len(user_info['friends']) + i) * line_height, f"{group['name']}")

		# Ajouter les permissions
		p.drawString(100, start_y - (13 + len(user_info['friends']) + len(user_info['groups'])) * line_height, "Permissions:")
		for i, permission in enumerate(user_info['user_permissions']):
			p.drawString(120, start_y - (14 + len(user_info['friends']) + len(user_info['groups']) + i) * line_height, f"{permission['name']}")

		# Finaliser le PDF
		p.showPage()
		p.save()

		# Revenir au début du buffer
		buffer.seek(0)

		# Retourner le PDF en réponse HTTP
		return HttpResponse(buffer, content_type='application/pdf')

	# Si le format n'est pas PDF, retourner les informations en JSON
	return JsonResponse(user_info, safe=False)