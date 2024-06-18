from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from .forms import RegisterForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from .models import Player, User
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

def lougout_view(request):
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