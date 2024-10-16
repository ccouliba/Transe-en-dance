# logs_middleware.py
import logging

class LoggingMiddleware():
    ''' __init__ => intervient avant que la vue ne soit decidee '''
    ''' __call__ => intervient avant que la vue ne soit appelée '''
    ''' Appel de la fonction logger.info() pour ecrire dans le fichier de logs '''
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger = logging.getLogger("back")
        logger.info(f"Request from: [{request.path}]")
        response = self.get_response(request)
        
        status = response.status_code
        state = 'success' if status == 200 else 'error'
        logger.info(f"code: [{status}] => [{state}]")
    
        return response
