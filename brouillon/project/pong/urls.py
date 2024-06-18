from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from .views import register_view, login_view, home_view, auth_callback, external_login_view, play

app_name = "pong"
urlpatterns = [
    path("", views.index, name="index"),
    path("home/", home_view, name="home"),
    path("register/", register_view, name='register'),
    path("login/", login_view, name="login"),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('external-login/', views.external_login_view, name='external-login'),
    path('auth/callback/', views.auth_callback, name='auth_callback'),
    path('play/', play, name='play'),
]
