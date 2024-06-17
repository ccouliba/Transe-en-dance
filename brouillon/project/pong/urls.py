from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from .views import register_view, login_view, home_view, auth_callback, external_login_view

app_name = "pong"
urlpatterns = [
    path("", views.index, name="index"), # Home Page
    path("home/", home_view, name="home"), #home
    path("register/", register_view, name='register'),
    path("login/", login_view, name="login"), #User Login Page
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'), # logout view 
    path('external-login/', views.external_login_view, name='external-login'),
    path('auth/callback/', views.auth_callback, name='auth_callback'),
]
