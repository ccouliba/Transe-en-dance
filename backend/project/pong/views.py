from django.template import loader
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .forms import RegisterForm
from .models import Player, User
from . import auth
import os

# Create your views here.

def player_list(request):
    players = list(Player.objects.all())    
    viewModels = [ player.user.email for player in players]
    return JsonResponse(viewModels, safe=False)




def index(request):
    template = loader.get_template('pong/index.html')
    return HttpResponse(template.render())

def home_view(request):
    template = loader.get_template('pong/home.html')
    return HttpResponse(template.render())

@login_required
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
            return redirect('/pong/home') # Redirect to the login page after registration
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

@login_required
def play(request):
    return render(request, 'pong/play.html')

def external_login_view(request):
    forty2_auth_url = os.getenv('API_AUTH_URL', 'https://api.intra.42.fr/oauth/authorize')
    redirect_uri = os.getenv('REDIRECT_URI', 'http://127.0.0.1:8000/pong/auth/callback')
    client_id = os.getenv('UID')
    response_type = 'code'
    return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

def auth_callback(request):
    api_response = auth.get_response_from_api(request)
    if api_response is None:
        # print(api_response, "response_code =", api_response.status_code)
        return redirect('/pong/login')    
    elif api_response.status_code == 200:
        token_data = api_response.json()
        access_token = token_data.get('access_token')
        # print("request_method =", request.method)
        return auth.get_user_from_api(request, access_token)
    return redirect('/pong/login')
