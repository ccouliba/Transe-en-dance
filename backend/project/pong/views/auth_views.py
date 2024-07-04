from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm, PasswordChangeForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from pong.forms import RegisterForm
from django.middleware.csrf import get_token
import os
from . import auth

import inspect



def home_view(request):
	return render(request, 'home.html')
	
def get_current_line():
	return inspect.currentframe().f_lineno



# Cette vue gere l'authentification via l'API d'Intra 42 en redirigeant l'utilisateur vers l'URL d'authentification appropriee
def external_login(request):
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

# Cette vue gere la connexion des utilisateurs
# - Si la methode HTTP est POST => elle traite le formulaire de connexion
# 	- Si le formulaire est valide => elle authentifie l'utilisateur avec les informations 
#		- Si l'authentification reussit => l'utilisateur est connecte et redirige vers la page d'accueil
#		- Si l'authentification echoue ou si le formulaire n'est pas valide => les erreurs sont affichees pour le debogage
# - Si la methode HTTP n'est pas POST => elle affiche un formulaire de connexion vide
def login_view(request):
	if request.method == 'POST':
		form = AuthenticationForm(request, data=request.POST)  # AuthenticationForm = formulaire de Django pour gérer l'authentification 
		# for field in form:
			# print(field.name,  field.errors)
		if form.is_valid():
			username = form.cleaned_data['username']  # cleaned_data => dictionnaire des données validées du formulaire 
			password = form.cleaned_data['password']
			# print(f"Debug - Username: {username}, Password: {password}") 
			user = authenticate(username=username, password=password)  # Compare les informations d'identification (nom d'utilisateur et mdp) avec les informations stockées dans la bdd
			if user is not None:
				login(request, user)
				return redirect('/pong/home')  # Redirige vers la page d'accueil après la connexion
			else:
				print("Authentification échouée")
		else:
			print("Formulaire non valide")
			# print(form.errors)  # Affiche les erreurs du formulaire pour le debug
		return redirect('/pong/login')
	else:
		form = AuthenticationForm()
	csrf_token = get_token(request)  # genere et inclut un token CSRF dans la réponse
	return render(request, 'pong/login.html', {'form': form})

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
		form = RegisterForm(request.POST)  # Formulaire d'inscription soumis par l'utilisateur
		if form.is_valid():
			user = form.save(commit=False)  # Crée un nouvel utilisateur sans l'enregistrer immédiatement
			user.set_password(form.cleaned_data['password'])  # Hacher le mot de passe
			user.save()  # Enregistre l'utilisateur avec le mot de passe haché
			login(request, user)  # Connecte automatiquement l'utilisateur après l'inscription
			print("Enregistrement reussi") 
			return redirect('/pong/home')  # Redirige vers la page d'accueil après l'inscription
		else:
			print("Formulaire non valide")
			print(form.errors)  # Affiche les erreurs du formulaire pour le debug
	else:
		form = RegisterForm()  # Affiche un formulaire d'inscription vide pour les requêtes non POST
		print("Affichage du formulaire d'inscription") 
	csrf_token = get_token(request)  # Genere et inclut un token CSRF dans la réponse pour protéger contre les attaques CSRF
	return render(request, 'pong/register.html', {'form': form})  # Affiche le formulaire d'inscription
