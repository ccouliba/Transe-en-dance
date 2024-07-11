# from django.contrib.auth.decorators import 
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.response import Response
from ..views.auth_views import get_log
from . import api_models

def check_credentials(request):
    if (request.COOKIES['csrftoken'] == get_token(request)):
        return False
    return True

class LoginAPIView(APIView):
    def connect(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # user = self.login(username, password)
        received = api_models.LoginSerializer('username':username, 'password':password)
        if received.is_valid():
            def login(self, request):
                user = get_log(request)
                if user is not None:
                    return Response(user, status=200)
                else:
                    return Response(None, status=400)

# def api_login_view(request):
#     if request.method == 'POST':
#         if (check_credentials(request) == False):
#             return JsonResponse({'messages':'success', 'redirect_url':'/home'})
#         else:
#             return JsonResponse({'messages':'failure', 'redirect_url':'/login'})
        
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