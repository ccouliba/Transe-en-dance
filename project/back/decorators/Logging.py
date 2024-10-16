# logs_decorators.py
import logging
from functools import wraps 

## Another way to automatize logging is using our own decorators
## using @wraps

def loggingFunction(func):
    ''' Decorateur pour le log : Wrap la fonction d'execution '''
    ''' Pour conserver les parametres de la view appelant le decorateur '''
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        logger = logging.getLogger("back")
        logger.info(f"(from : [{func.__name__}])")
        return func(request, *args, **kwargs)
    return wrapper