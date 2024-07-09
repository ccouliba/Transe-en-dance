from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm, PasswordChangeForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from pong.forms import RegisterForm
from django.middleware.csrf import get_token
from django.http import JsonResponse, HttpResponse
import os
from ..views import auth
from django.middleware.csrf import get_token

def check_credentials(request):
    if (request.COOKIES['csrftoken'] == get_token(request)):
        return False
    return True

def api_login_view(request):
    if request.method == 'POST':
        if (check_credentials(request) == False):
            return JsonResponse({'messages':'success', 'redirect_url':'/home'})
        else:
            return JsonResponse({'messages':'failure', 'redirect_url':'/login'})
        
# def api_register(request):
#     if request.method == 'POST':
#         if (check_credentials(request) == False):
#             return JsonResponse({'messages':'success', 'redirect_url':'/home'})
#         else:
#             return JsonResponse({'messages':'failure', 'redirect_url':'/register'})
        
# def api_external_log(request):
#     if request.method == 'POST':
#         if (check_credentials(request) == False):
#             return JsonResponse({'messages':'success', 'redirect_url':'/home'})
#         else:
#             return JsonResponse({'messages':'failure', 'redirect_url':'/login'})

# def api_change_language(request):
#     if request.method == 'POST':
#         if (check_credentials(request) == False):
#             return JsonResponse({'messages':'success', 'redirect_url':'/home'})
#         else:
#             return JsonResponse({'messages':'failure', 'redirect_url':'/change_language'})