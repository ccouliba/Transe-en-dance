import requests
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import render, redirect

def get_token_from_api(request):
    # Get code parameter of the GET request (autorisation temporaire pour obtenir un jeton pour se connecter)
    code = request.GET.get('code')
    # URL du token (fournie par l'API 42) pour échanger le code d'autorisation contre un jeton d'accès.
    token_url = "https://api.intra.42.fr/oauth/token"
    # Envoi de la request pour obtenir un jeton d'acces
    response = requests.post(token_url, data={
        'code': code,
        'redirect_uri': 'http://127.0.0.1:8000/pong/auth/callback',
        'client_id': 'u-s4t2ud-7a3abaaf67dc8706eff3e08365b4b1f28d472ac6d002b7977a3ebcb46f048ddd',
        'client_secret': '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',
        'grant_type': 'authorization_code',
    })
    # if request succeeded
    # if response.status_code == 200:
    #     token_data = response.json()
    #     access_token = token_data.get('access_token')
        
    #     # Get user info via a get request
    #     user_info_url = "https://api.intra.42.fr/v2/me"
    #     user_info_response = requests.get(user_info_url, headers={
    #         'Authorization': f"Bearer {access_token}"
    #     })
    #     if user_info_response.status_code == 200:
    #         user_info = user_info_response.json()
    #         user, created = User.objects.get_or_create(username=user_info['login'])
    #         login(request, user)
    #         return redirect('/pong/home')
    return HttpResponse("Authentication failed", status=401)