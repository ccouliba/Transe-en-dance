# logs_middleware.py
from django.utils.deprecation import MiddlewareMixin
import logging

class LoggingMiddleware(MiddlewareMixin):
    ''' __init__ => intervient avant que la vue ne soit decidee '''
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
        logger.info(f"code: [{status}] => [{state}]")
    
        return response


# def Logging_acces(request, opname):
#     logger = logging.getLogger('pong')
#     if request.user.is_authenticated:
#         logger.info(f"operation::[{opname}]::[{request.user.username}] => [success]")
#     else:
#         logger.info(f"operation::[{opname}]::[{request.user.username}] => [error]")