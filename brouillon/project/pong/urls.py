from django.urls import path
from . import views

app_name = "pong"
urlpatterns = [
    path("", views.index, name="index"), # Home Page
    path("home/", views.home, name="home"), #home
    path("register/", views.getRegistered, name="register"), #User Registeration Page
    path("login/", views.getLogged, name="login"), #User Login Page
    # path("login/", views.getLogged, name="logout")
]