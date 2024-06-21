from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .forms import RegisterForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render
from .models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .auth_api import get_token_from_api, get_user_from_api
import os

def user_list(request):
    users = list(User.objects.all())    
    viewModels = [ user.email for user in users]
    return JsonResponse(viewModels, safe=False)


def index(request):
    template = loader.get_template('pong/index.html')
    return HttpResponse(template.render())

def home_view(request):
    return render(request, 'pong/home.html')

def logout_view(request):
    logout(request)
    return redirect('/pong/login')

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            print("Enregistrement réussi")  # Message de succès
            return redirect('/pong/login')  # Redirige vers la page de connexion après l'enregistrement
        else:
            print("Formulaire non valide")
            print(form.errors)  # Affiche les erreurs du formulaire pour le débogage
    else:
        form = RegisterForm()
        print("Affichage du formulaire d'inscription")  # Message lors de l'affichage du formulaire
    return render(request, 'pong/register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/pong/home')  # Redirige vers la page d'accueil après la connexion
            else:
                print("Authentification échouée")
        else:
            print("Formulaire non valide")
            print(form.errors)  # Affiche les erreurs du formulaire pour le débogage
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
    api_response = get_token_from_api(request)
    print(api_response, "response_code =", api_response.status_code)
    if api_response.status_code == 200:
        token_data = api_response.json()
        access_token = token_data.get('access_token')
        return get_user_from_api(request, access_token)
    return HttpResponse("Authentication failed", status=401)



@login_required
def profile_view(request):
    return render(request, 'pong/profile.html')



@login_required
def user_updated_profile(request):
    if request.method == 'POST':
        form = UserChangeForm(request.POST, instance=request.user) # CECI EST DE LA MAGIE : formulaire fourni par django
        if form.is_valid():
            form.save()
            return redirect('pong/profile.html')  
    else:
        form = UserChangeForm(instance=request.user)
    return render(request, 'pong/update.html', {'form': form})


@login_required
def user_password_changed(request):
    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST) # CECI EST DE LA MAGIE : formulaire fourni par django
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)  # Important pour maintenir la session active
            return redirect('pong/profile.html')  
    else:
        form = PasswordChangeForm(user=request.user)
    return render(request, 'pong/change_password.html', {'form': form})

@login_required
def user_account_deleted(request):
    user = request.user
    user.delete()
    return redirect('pong/home.html')  