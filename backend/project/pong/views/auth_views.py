from django.middleware.csrf import get_token
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from pong.forms import RegisterForm
from django.http import HttpResponse
from django.http import JsonResponse, HttpResponse
import os
from pong.views import auth
from rest_framework.authtoken.models import Token
import logging
# from logstash.middleware.LogMiddleware import LoggingFunction

# from ... logstash.middleware import LogMiddleware
import inspect

logger = logging.getLogger(__name__)

def get_current_line():
	return inspect.currentframe().f_lineno

def external_login(request):
	forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
	redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id 
	response_type = 'code'
	LoggingFunction(request=request, opname='External log-in')
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")


def auth_callback(request):
	api_response = auth.get_response_from_api(request)
	if api_response is None:
		LoggingFunction(request=request, opname='Auth API callback')		
		return redirect('/pong/login')
	elif api_response.status_code == 200:
		token_data = api_response.json()
		access_token = token_data.get('access_token')
		return auth.get_user_from_api(request, access_token)
	return HttpResponse("Authentication failed", status=401)

# Cette vue gere la connexion des utilisateurs
# - Si la methode HTTP est POST => elle traite le formulaire de connexion
# 	- Si le formulaire est valide => elle authentifie l'utilisateur avec les informations 
#		- Si l'authentification reussit => l'utilisateur est connecte et redirige vers la page d'accueil
#		- Si l'authentification echoue ou si le formulaire n'est pas valide => les erreurs sont affichees pour le debogage
# - Si la methode HTTP n'est pas POST => elle affiche un formulaire de connexion vide

## New function of back without form validation and all that stuff !!
def get_log(request, token):
	if request.method == 'POST':
		username = request.data.get('username')
		password = request.data.get('password')
		user = authenticate(username=username, password=password)  # Compare les informations d'identification (nom d'utilisateur et mdp) avec les informations stockées dans la bdd
		if user is not None:
			login(request, user)
			token = Token.objects.create(user=user)
			return JsonResponse({'messages':'succcess', 'token':token, 'redirect_url':'/pong/home'})
	return None
	
def login_view(request):
	if request.method == 'POST':
		# logger.info("Method of received request => [%s]", request.method)
		# logger.info("operation::[log in] => [beginning]")
		form = AuthenticationForm(request, data=request.POST)
		if form.is_valid():
			username = form.cleaned_data['username']  
			password = form.cleaned_data['password']
			user = authenticate(username=username, password=password)  
			if user is not None:
				login(request, user)
				LoggingFunction(request=request, opname='Log-in')
				# logger.info("operation::[log in] => [success]")
				return redirect('/pong/home')  
			# else:
				# logger.info("operation::[log in] => [error I]")	
		# else:
		LoggingFunction(request=request, opname='Log-in')
		return redirect('/pong/login')
	else:
		form = AuthenticationForm()
	csrf_token = get_token(request)  # genere et inclut un token CSRF dans la réponse
	# return JsonResponse({'messages':'success', 'redirect_url':'/pong/home', 'html':'login.html', 'form':form})
	return render(request, 'pong/login.html', {'form': form})

@login_required
def logout_view(request):
	logout(request) 
	return redirect('/pong/login')

def register_view(request):
	# logger = logging.getLogger(__name__)
	if request.method == 'POST':
		# logger.info("Method of received request => [%s]", request.method)
		# logger.info("operation::[registration] => [beginning]")
		form = RegisterForm(request.POST)
		if form.is_valid():
			user = form.save(commit=False)
			user.set_password(form.cleaned_data['password'])
			user.save()
			login(request, user)
			logger.info("operation::[registration] => [success]")
			return redirect('/pong/home')
		# else:
			# logger.info('Processed request [LOGIN]',
		# 	logger.info("operation::[registration] => [error I]")
			# 		extra= {
			# 			'user_id': user.id,
			# 			'path': request.path,
			# },)
		LoggingFunction(request=request, opname='Regestration')
		return redirect('/pong/login')
	else:
		logger.info("operation::[registration] => [error II]")
		form = RegisterForm()
		# print("Affichage du formulaire d'inscription") 
	csrf_token = get_token(request)
	return render(request, 'pong/register.html', {'form': form})  
