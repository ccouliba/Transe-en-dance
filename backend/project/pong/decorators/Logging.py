# logs_decorators.py
from django.utils.deprecation import MiddlewareMixin
import logging
from functools import wraps

## Another way to automatize logging is using our own decorators
## using @wraps

def loggingFunction(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"function name : [{func.__name__}]")
        return func(request, *args, **kwargs)
    return wrapper