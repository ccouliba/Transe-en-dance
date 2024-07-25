from django.http import HttpResponse
# from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import render, redirect
from ..models import User
import requests
# from requests.auth import HTTPBasicAuth 
import os
from pong.decorators.Logging import loggingFunction

@loggingFunction
def get_response_from_api(request):
    # Get code parameter of the GET request (autorisation temporaire pour obtenir un jeton pour se connecter)
    url = os.getenv('TOKEN_URL')
    code = request.GET.get('code')
    # possible parameters of post: allow_redirects=False, cookies=None, auth=request.user, cert="",timeout=30
    response = requests.post(
        url,
        data={
            'code': code or None,
            'redirect_uri': os.getenv('REDIRECT_URI'),
            'client_id': os.getenv('UID'),
            'client_secret': os.getenv('SECRET'),
            'grant_type': 'authorization_code',
        })
    if response.status_code != 200 or code is None:
        return None
    return response

@loggingFunction
def get_user_from_api(request, access_token):    
    user_info_url = os.getenv('USER_INFO_URL')
    user_info_response = requests.get(
            user_info_url,
            headers={ 'Authorization': f"Bearer {access_token}"},
            cookies=None)
    if user_info_response.status_code == 200:
        user_info = user_info_response.json()
        user, created = User.objects.get_or_create(username=user_info['login'])
        login(request, user)
        redirect('/pong/#home')
        # return redirect('/pong/#home')
    return redirect('/pong/#login')
