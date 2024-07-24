from django.middleware.csrf import get_token
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from pong.forms import RegisterForm
from django.http import HttpResponse
from django.http import JsonResponse, HttpResponse
from ..models import User
from django.contrib.auth.forms import UserCreationForm
import os
from pong.views import auth
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.authtoken.models import Token
from pong.decorators.Logging import loggingFunction
# import logging
# from logstash.middleware.LogMiddleware import LoggingFunction

# import inspect

def base_view(request):
	return render(request, 'pong/base.html')

# Cette vue verifie si un utilisateur est authentifie ou pas. Elle est utilise dans base.html
# def check_auth(request):
# 	return JsonResponse({'is_authenticated': request.user.is_authenticated})
def check_auth(request):
	return JsonResponse({
		'is_authenticated': request.user.is_authenticated,
		'username': request.user.username if request.user.is_authenticated else None
	})
 
# Cette vue gere l'authentification via l'API d'Intra 42 en redirigeant l'utilisateur vers l'URL d'authentification appropriee
def external_login(request):
	forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
	redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id 
	# response_type = 'code'
	# LoggingFunction(request=request, opname='External log-in')
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

@loggingFunction
def auth_callback(request):
	api_response = auth.get_response_from_api(request)
	if api_response is None:
		# LoggingFunction(request=request, opname='Auth API callback')		
		return redirect('/pong/#login')
	elif api_response.status_code == 200:
		token_data = api_response.json()
		access_token = token_data.get('access_token')
		return auth.get_user_from_api(request, access_token)
	return HttpResponse("Authentication failed", status=401)

# Cette vue gere la connexion des utilisateurs
@require_POST
# @ensure_csrf_cookie
@csrf_exempt
## New function of back without form validation and all that stuff !!
def get_log(request, token):
	if request.method == 'POST':
		username = request.data.get('username')
		password = request.data.get('password')
		user = authenticate(username=username, password=password)  # Compare les informations d'identification (nom d'utilisateur et mdp) avec les informations stockées dans la bdd
		if user is not None:
			login(request, user)
			token = Token.objects.create(user=user)
			return JsonResponse({'messages':'succcess', 'token':token, 'redirect_url':'/pong/#home'})
	return None
	
def login_view(request):
	data = json.loads(request.body)
	username = data.get('username')
	password = data.get('password')
	user = authenticate(username=username, password=password)
	if user is not None:
		login(request, user)
		# LoggingFunction(request=request, opname='Log-in')
		return JsonResponse({'status': 'success'})
	else:
		return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)


@login_required
def logout_view(request):
	logout(request)
	# LoggingFunction(request=request, opname='Log-out')
	request.session.flush()
	return JsonResponse({'status': 'success'})

# Cette vue gere l'inscription des nouveaux utilisateurs
def register_view(request):
	try:
		data = json.loads(request.body)
		form = RegisterForm(data)
		if form.is_valid():
			user = form.save()
			# LoggingFunction(request=request, opname='Registration')
			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'error', 'message': form.errors}, status=400)
	except json.JSONDecodeError:
		return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
