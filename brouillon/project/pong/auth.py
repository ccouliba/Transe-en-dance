from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import render, redirect
import requests
import os

def get_token_from_api(request):
    # Get code parameter of the GET request (autorisation temporaire pour obtenir un jeton pour se connecter)
    code = request.GET['code']
    response = requests.post(os.getenv('TOKEN_URL'), data={
        'code': code,
        'redirect_uri': os.getenv('REDIRECT_URI'),
        'client_id': os.getenv('UID'),
        'client_secret': os.getenv('SECRET'),
        'expire_in': 3,
        'grant_type': 'authorization_code',
    })
    return response

def get_user_from_api(request, access_token):    
    user_info_url = os.getenv('USER_INFO_URL')
    user_info_response = requests.get(user_info_url, headers={
        'Authorization': f"Bearer {access_token}"
    })
    if user_info_response.status_code == 200:
        user_info = user_info_response.json()
        user, created = User.objects.get_or_create(username=user_info['login'])
        login(request, user)
        return redirect('/pong/home')
    return HttpResponse("Communication with extern API failed", status=401)
