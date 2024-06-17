from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from .forms import RegisterForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.conf import settings
from django.contrib.auth import logout
import requests
from .auth_api import get_token_from_api, get_user_from_api

def index(request):
    template = loader.get_template('pong/index.html')
    return HttpResponse(template.render())

def home_view(request):
    template = loader.get_template('pong/home.html')
    return HttpResponse(template.render())

def lougout_view(request):
    logout(request)
    return redirect('/pong/login')

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('/pong/login') # Redirect to the login page after registration
        else:
            form = RegisterForm(request.POST or None)
    else:
        form = RegisterForm()
    return render(request, 'pong/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
            if user is not None:
                login(request, user)
                return redirect('/pong/home')  # Redirige vers la page d'accueil après l'inscription
        else:
            return redirect('/pong/login')
    else:
        form = AuthenticationForm()
    return render(request, 'pong/login.html', {'form': form})

def external_login_view(request):
    forty2_auth_url = "https://api.intra.42.fr/oauth/authorize"
    redirect_uri = 'http://127.0.0.1:8000/pong/auth/callback'
    client_id = 'u-s4t2ud-7a3abaaf67dc8706eff3e08365b4b1f28d472ac6d002b7977a3ebcb46f048ddd'
    response_type = 'code'
    return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

def auth_callback(request):
    response = get_token_from_api(request)
    print("status_code =", response.status_code)
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get('access_token')
        return get_user_from_api(request, response, access_token)
    return HttpResponse("Authentication failed", status=401)

# def auth_callback(request):
#     # get_token_fron
#     # Get code parameter of the GET request (autorisation temporaire pour obtenir un jeton pour se connecter)
#     code = request.GET.get('code')
#     # URL du token (fournie par l'API 42) pour échanger le code d'autorisation contre un jeton d'accès.
#     token_url = "https://api.intra.42.fr/oauth/token"
#     # Envoi de la request pour obtenir un jeton d'acces
#     response = requests.post(token_url, data={
#         'code': code,
#         'redirect_uri': 'http://127.0.0.1:8000/pong/auth/callback',
#         'client_id': 'u-s4t2ud-7a3abaaf67dc8706eff3e08365b4b1f28d472ac6d002b7977a3ebcb46f048ddd',
#         'client_secret': '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',
#         'grant_type': 'authorization_code',
#     })
    
#     # if request succeeded
#     if response.status_code == 200:
#         # extract 42_access_token to, which allow to get user_info
#         token_data = response.json()
#         # Extract json data from the response and get the access_token
#         access_token = token_data.get('access_token')
        
#         # Get user info via a get request with the token_access
#         user_info_url = "https://api.intra.42.fr/v2/me"
#         user_info_response = requests.get(user_info_url, headers={
#             'Authorization': f"Bearer {access_token}"
#         })

#         # Vérifier si la requête pour obtenir les informations utilisateur a réussi.
#         if user_info_response.status_code == 200:
#             # user_info['login'] contient le nom d'utilisateur de l'API 42.
#             user_info = user_info_response.json()
#             # Create a User or login the user found in 42database
#             user, created = User.objects.get_or_create(username=user_info['login'])
#             login(request, user)
#             return redirect('/pong/home')
#     return HttpResponse("Authentication failed", status=401)