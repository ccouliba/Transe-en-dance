# logs_middleware.py
from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger('pong')

class UserLoginMiddleware(MiddlewareMixin):
    def login_request(self, request):
        if request.user.is_authenticated:
            logger.info(f"L'utilisateur {request.user.username} s'est connecté.")
    
    # def register_request(self, request):
    #     if request.user.is_authenticated:
    #         logger.info(f"L'utilisateur {request.user.username} s'est enregistre.")

class UserRegistrationMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        if view_func.__name__ == 'RegisterForm':  # Remplacez par le nom de votre vue d'inscription
            logger.info(f"Nouvel utilisateur inscrit : {request.POST.get('username')}")