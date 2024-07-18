# # logs_middleware.py
# from django.utils.deprecation import MiddlewareMixin
# import logging

# logger = logging.getLogger('pong')
# logger1 = logging.getLogger('django.db.backend')

# class UserLoginLogMiddleware(MiddlewareMixin):
#     def login_request(self, request):
#         if request.user.is_authenticated:
#                 logger.info(f"Middleware-operation::[log in]::[{request.user.username}] => [success]")
#                 logger1.info(f"Middleware-operation::[log in]::[{request.user.username}] => [success]")
#         else:
#             logger.info(f"Middleware-operation::[log in]::[{request.user.username}] => [error]")
#             logger1.info(f"Middleware-operation::[log in]::[{request.user.username}] => [error]")

# class UserRegisterLogMiddleware(MiddlewareMixin):
#     def register_request(self, request, view_func):
#         if view_func.__name__ == 'register_view':
#             logger.info(f"Middleware-operation::[registration]::[{request.POST.get('username')}] => [on going]")