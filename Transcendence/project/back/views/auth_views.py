from django.middleware.csrf import get_token
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from back.forms import RegisterForm
from ..models import User
import os
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.authtoken.models import Token
from back.decorators.Logging import loggingFunction
from django.utils import timezone
from django.db import transaction
from dotenv import load_dotenv
from django.db.models import Q
# import logging
# from logstash.middleware.LogMiddleware import LoggingFunction

# import inspect

from django.views.decorators.csrf import ensure_csrf_cookie
from back.utils import load_env

from django.utils.html import escape


#loading env variables for external login with api42
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, "../../../.utils/.env")
load_dotenv(env_path)


@ensure_csrf_cookie
def base_view(request):
	return render(request, 'pong/base.html')

# Cette vue verifie si un utilisateur est authentifie ou pas. Elle est utilise dans base.html
# def check_auth(request):
# 	return JsonResponse({'is_authenticated': request.user.is_authenticated})
def check_auth(request):
	user = request.user
 
	if not user.is_anonymous:
		user.was_active_now()
		user.save()

	return JsonResponse({
		'is_authenticated': request.user.is_authenticated,
		'username': request.user.username if request.user.is_authenticated else None
	})


# Cette vue gere l'authentification via l'API d'Intra 42 en redirigeant l'utilisateur vers l'URL d'authentification appropriee
@loggingFunction
def external_login(request):
	
	forty2_auth_url = os.getenv('API_AUTH_URL')
	redirect_uri = os.getenv('REDIRECT_URI')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id 
	
	url = f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
	
	return redirect(url)

import requests

def get_response_from_api(request):
	url = os.getenv('TOKEN_URL')
	code = request.GET.get('code')
	
	if not code:
		print("No authorization code received from 42 API")
		return None

	redirect_uri = os.getenv('REDIRECT_URI')
	
	data = {
		'code': code,
		'redirect_uri': redirect_uri,
		'grant_type': 'authorization_code',
	}

	client_id = os.getenv('UID')
	client_secret = os.getenv('SECRET')
	
	try:
		response = requests.post(
			url,
			data=data,
			auth=(client_id, client_secret),
			headers={
				"Authorization": f"Bearer {code}"
			}
		)
		print(f"Token API response status: {response.status_code}")
		print(f"Token API response content: {response.text}")
		response.raise_for_status()
		return response
	except requests.exceptions.RequestException as e:
		print(f"Error getting token from 42 API: {e}")
		return None

def get_user_from_api(request, access_token):
	user_info_url = os.getenv('USER_INFO_URL')
	
	try:
		user_info_response = requests.get(
			user_info_url,
			headers={'Authorization': f"Bearer {access_token}"},
			cookies=None
		)
		# print(f"User info API response status: {user_info_response.status_code}")
		# print(f"User info API response content: {user_info_response.text}")
		user_info_response.raise_for_status()
		user_info = user_info_response.json()
  
		username = user_info['login']
		email = user_info.get('email', '')
  
		# if a user with this username or email already exists
		existing_user = User.objects.filter(Q(username=username) | Q(email=email)).first()
		if existing_user:
			# If a user already exists just log them in
			user = existing_user
			if user.email != email:
				user.email = email
				user.save()
		else:
			# If no user exists with this username or email, create a new one
			user = User.objects.create(username=username, email=email)
		
		# user, created = User.objects.get_or_create(username=user_info['login'])
		# if created:
		# 	email = user_info.get('email', '')
			avatar = user_info.get('image', {}).get('link')
			first_name = user_info.get('first_name', '')
			last_name = user_info.get('last_name', '')
			
			user.register_from_42_login(email, avatar, first_name, last_name)
			user.save()
		
		login(request, user)
		user.login()
		return redirect('/pong/#home')
	except requests.exceptions.RequestException as e:
		print(f"Error getting user info from 42 API: {e}")
		return redirect('/pong/#login')
	except KeyError as e:
		print(f"KeyError when processing user info: {e}")
		return redirect('/pong/#login')

# Cette vue gere le callback de l'authentification (ie la reponse recue apres que l'utilisateur ait autorise l'application via l'authentification via l'API d'Intra 42)
@loggingFunction
# @csrf_exempt #maybe have to use it since api42 do not send back csrf token perhaps
def auth_callback(request):
	print("Received callback request:", request.GET)
	api_response = get_response_from_api(request)
	if api_response is None:
		print("API response is None")
		return redirect('/pong/#login')    
	elif api_response.status_code == 200:
		print("Successful API response:", api_response.json())
		token_data = api_response.json()
		access_token = token_data.get('access_token')
		if access_token:
			return get_user_from_api(request, access_token)
		else:
			print("No access token in API response")
			return redirect('/pong/#login')
	else:
		print(f"Failed API response: {api_response.status_code} - {api_response.text}")
	return redirect('/pong/#login')

# Cette vue gere la connexion des utilisateurs
@require_POST
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

@loggingFunction
def login_view(request):
	data = json.loads(request.body)
	username = data.get('username')
	password = data.get('password')
	user = authenticate(username=username, password=password)

	if user is not None:
		login(request, user)
		user.login()#utilisation de la methode de la class user (pour online/offline)
		return JsonResponse({'status': 'success'})
	else:
		return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)

@loggingFunction
@login_required
def logout_view(request):
	user = request.user
	request.session.flush()
	logout(request)
	user.logout()#utilisation de la methode de la class user (pour online/offline)
	
	return JsonResponse({'status': 'success'})

# Cette vue gere l'inscription des nouveaux utilisateurs
@loggingFunction
def register_view(request):
	try:
		data = json.loads(request.body)
		data["is_online"] = False
		data["username"] = escape(data["username"])
		data["email"] = escape(data["email"])
		form = RegisterForm(data)
		if form.is_valid():
			# form.is_online = False
			user = form.save()
			# LoggingFunction(request=request, opname='Registration')
			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'error', 'message': form.errors}, status=400)
	except json.JSONDecodeError:
		return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)





@login_required
@transaction.atomic
def soft_delete_user(request):
	if request.method == 'POST':
		user = request.user
		
		# Anonymize user data (like in discord)
		user.username = f"deleted_user_{user.id}"
		user.email = f"deleted_{user.id}@example.com"
		user.first_name = "Deleted"
		user.last_name = "User"
		
		user.is_deleted = True
		user.deleted_at = timezone.now()
		
		user.is_active = False
		
		user.avatar = None  
		
		user.save()
		
		logout(request)
		
		return JsonResponse({'status': 'success', 'message': 'Your account has been successfully deleted.'})
	
	return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


import os
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
