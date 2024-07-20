from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from pong.forms import RegisterForm
from django.middleware.csrf import get_token
from ..models import User
from django.contrib.auth.forms import UserCreationForm
import os
from . import auth
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
import json
import inspect

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
	request.session['client_id'] = client_id # sauvegarder le client_id dans la session
	response_type = 'code'
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

import requests

def get_response_from_api(request):
	url = os.getenv('TOKEN_URL')
	code = request.GET.get('code')
	
	if not code:
		print("No authorization code received from 42 API")
		return None

	data = {
		'code': code,
		'redirect_uri': os.getenv('REDIRECT_URI'),
		'grant_type': 'authorization_code',
	}

	client_id = os.getenv('UID')
	client_secret = os.getenv('SECRET')

	try:
		response = requests.post(
			url, 
			data=data, 
			auth=(client_id, client_secret)
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
		print(f"User info API response status: {user_info_response.status_code}")
		print(f"User info API response content: {user_info_response.text}")
		user_info_response.raise_for_status()
		
		user_info = user_info_response.json()
		user, created = User.objects.get_or_create(username=user_info['login'])
		login(request, user)
		return redirect('/pong/#home')
	except requests.exceptions.RequestException as e:
		print(f"Error getting user info from 42 API: {e}")
		return redirect('/pong/#login')
	except KeyError as e:
		print(f"KeyError when processing user info: {e}")
		return redirect('/pong/#login')

# Cette vue gere le callback de l'authentification (ie la reponse recue apres que l'utilisateur ait autorise l'application via l'authentification via l'API d'Intra 42)
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
# @ensure_csrf_cookie
@csrf_exempt
def login_view(request):
	data = json.loads(request.body)
	username = data.get('username')
	password = data.get('password')
	user = authenticate(username=username, password=password)
	if user is not None:
		login(request, user)
		return JsonResponse({'status': 'success'})
	else:
		return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)


# vue pour gerer la deconnexion de l'utilisateur
# @login_required
# def logout_view(request):
# 	logout(request) #methode Django
# 	return JsonResponse({'status': 'success'})
@login_required
def logout_view(request):
	logout(request)
	request.session.flush()
	return JsonResponse({'status': 'success'})

# Cette vue gere l'inscription des nouveaux utilisateurs
def register_view(request):
	try:
		data = json.loads(request.body)
		form = RegisterForm(data)
		if form.is_valid():
			user = form.save()
			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'error', 'message': form.errors}, status=400)
	except json.JSONDecodeError:
		return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
	except Exception as e:
		return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
