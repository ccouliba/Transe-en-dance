from django.template import loader
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import login, authenticate
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib import messages
from django.utils import translation
from django.conf import settings
from django.utils.translation import gettext as _
from .models import User
from . import auth, forms
import os

# Create your views here.

@login_required
def user_list(request):
    users = list(User.objects.all())    
    viewModels = [ user.email for user in users]
    return JsonResponse(viewModels, safe=False)

def index(request):
    template = loader.get_template('pong/index.html')
    return HttpResponse(template.render())

@login_required
def home_view(request):
    return render(request, 'pong/home.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('/pong/login')

def register_view(request):
    if request.method == 'POST':
        form = forms.RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            print("Enregistrement réussi")  # Message de succès
            return redirect('/pong/login')  # Redirige vers la page de connexion après l'enregistrement
        else:
            # print("Formulaire non valide")
            print(form.errors)  # Affiche les erreurs du formulaire pour le débogage
    else:
        form = forms.RegisterForm()
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
    api_response = auth.get_response_from_api(request)
    if api_response is None:
        # print(api_response, "response_code =", api_response.status_code)
        return redirect('/pong/login')    
    elif api_response.status_code == 200:
        token_data = api_response.json()
        access_token = token_data.get('access_token')
        return auth.get_user_from_api(request, access_token)
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
            return redirect('/pong/profile')  
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
            return redirect('/pong/profile')  
    else:
        form = PasswordChangeForm(user=request.user)
    return render(request, 'pong/change_password.html', {'form': form})

# Can be removeded any time ! Just a simple view linked to a template/form that works
@login_required
def user_account_deleted(request):
    if request.method == 'POST':
        user = request.user
        # Maybe remove auth_token when user deletes account ??
        # user.auth_token.delete()
        user.delete()
        return redirect('/pong/register')
    return render(request, 'pong/delete_account.html')

@login_required
def change_language(request):
    if request.method == 'POST':
        form = forms.SetLanguageForm(request.POST)
        if form.is_valid():
            user_language = form.cleaned_data['language']
            translation.activate(user_language)
            response = redirect('/pong/home')
            response.set_cookie(settings.LANGUAGE_COOKIE_NAME, user_language)
            return response
    else:
        form = forms.SetLanguageForm()
    return render(request, 'pong/change_language.html', {'form': form})