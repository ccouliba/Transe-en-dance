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

# Create your views here.
# def auth_callback(request):
#     return HttpResponse("Authentication successful!")

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

def external_login_view(request):
    forty2_auth_url = "https://api.intra.42.fr/oauth/authorize"
    redirect_uri = 'http://pong/auth/callback/'
    client_id = 'u-s4t2ud-0ab5e728b00e49e0dcadbf58fcea0e3500a3026a93f11b7c026f3100670cb07f'
    # response_type = 'code'
    return redirect(f"{forty2_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")

def auth_callback(request):
    code = request.GET.get('code')
    token_url = "https://api.intra.42.fr/oauth/token"
    response = request.post(token_url, data={
        'code': code,
        'redirect_uri': 'http://localhost:8000/pong/auth/callback/',
        'client_id': 'u-s4t2ud-0ab5e728b00e49e0dcadbf58fcea0e3500a3026a93f11b7c026f3100670cb07f',
        'client_secret': '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',
        'grant_type': 'authorization_code',
    })
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get('access_token')
        
        user_info_url = "https://api.intra.42.fr/v2/me"
        user_info_response = request.GET(user_info_url, headers={
            'Authorization': f"Bearer {access_token}"
        })
        if user_info_response.status_code == 200:
            user_info = user_info_response.json()
            user, created = User.objects.get_or_create(username=user_info['username'])
            login(request, user)
            return redirect('/pong/home')
    
    return HttpResponse("Authentication failed", status=401)