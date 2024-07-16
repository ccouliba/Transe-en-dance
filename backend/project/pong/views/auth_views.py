from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from pong.forms import RegisterForm
from django.middleware.csrf import get_token
import logging
import os
from . import auth

import inspect

def get_current_line():
	return inspect.currentframe().f_lineno




def external_login(request):
	forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
	redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
	client_id = os.getenv('UID')
	request.session['client_id'] = client_id 
	response_type = 'code'
	return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")


def auth_callback(request):
	api_response = auth.get_response_from_api(request)
	if api_response is None:
		
		return redirect('/pong/login')    
	elif api_response.status_code == 200:
		token_data = api_response.json()
		access_token = token_data.get('access_token')
		
		return auth.get_user_from_api(request, access_token)
	return HttpResponse("Authentication failed", status=401)

def login_view(request):
	if request.method == 'POST':
		logger = logging.getLogger(__name__)
		logger.debug("Received request: %s", request)
		form = AuthenticationForm(request, data=request.POST)  
		
			
		if form.is_valid():
			username = form.cleaned_data['username']  
			password = form.cleaned_data['password']
			
			user = authenticate(username=username, password=password)  
			if user is not None:
				login(request, user)
				logger.info("Log-in operation completed successfully")
				return redirect('/pong/home')  
			else:
				logger.info("Log-in operation completed with errors")
				
		else:
			logger.info("Log-in operation completed with errors")
			
			
		return redirect('/pong/login')
	else:
		form = AuthenticationForm()
	csrf_token = get_token(request)  
	return render(request, 'pong/login.html', {'form': form})


@login_required
def logout_view(request):
	logout(request) 
	return redirect('/pong/login')

def register_view(request):
	if request.method == 'POST':
		logger = logging.getLogger(__name__)
		logger.debug("Received request: %s", request)
		form = RegisterForm(request.POST)
		if form.is_valid():
			user = form.save(commit=False)
			user.set_password(form.cleaned_data['password'])
			user.save()
			login(request, user)
			logger.info("Register operation completed successfully")
			return redirect('/pong/home')
		else:
			logger.info("Log-in operation completed with errors")
	else:
		form = RegisterForm()
		print("Affichage du formulaire d'inscription") 
	csrf_token = get_token(request)
	return render(request, 'pong/register.html', {'form': form})  
