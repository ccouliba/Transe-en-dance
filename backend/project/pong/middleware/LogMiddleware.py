# logs_middleware.py
from django.utils.deprecation import MiddlewareMixin
import logging

class LoggingMiddleware:
    ''' __init__ => initialise le middleware avec get_response '''
    ''' __call__ => intervient avant que la vue ne soit appelée '''
    ''' Appel de la fonction logger.info() pour ecrire dans le fichier de logs '''
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger = logging.getLogger(__name__)
        logger.info(f"Request from: [{request.path}]")
        response = self.get_response(request)
        
        status = response.status_code
        state = 'success' if status == 200 else 'error'
        logger.info(f"Status code: [{status}] => [{state}]")
        return response


# def LoggingFunction(request, opname):
#     logger = logging.getLogger('pong')
#     if request.user.is_authenticated:
#         logger.info(f"operation::[{opname}]::[{request.user.username}] => [success]")
#     else:
#         logger.info(f"operation::[{opname}]::[{request.user.username}] => [error]")

## Another way to automatize logging is using our own decorators
## using @wraps
# from functools import wraps

# def loggingFunction(func):
#     @wraps(func)
#     def wrapper(request, *args, **kwargs):
#         logger = logging.getLogger(__name__)
#         logger.info(f"View called : [{func.__name__}]")
#         return func(request, *args, **kwargs)
#     return wrapper