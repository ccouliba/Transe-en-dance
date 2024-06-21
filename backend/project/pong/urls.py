from django.urls import path
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings
from django.conf.urls.static import static
from django.views.i18n import set_language
from django.contrib.auth.views import LogoutView
from . import views

app_name = "pong"
urlpatterns = [
    path("player", views.user_list, name="player_list"),
    path("", views.index, name="index"), # Home Page
    path("home/", views.home_view, name="home"), #home
    path("register/", views.register_view, name='register'),
    path("login/", views.login_view, name="login"),
    path('logout/', LogoutView.as_view(next_page='pong:login'), name='logout'),
    path('external-login/', views.external_login_view, name='external-login'),
    path('auth/callback/', views.auth_callback, name='auth_callback'),
    path('play/', views.play, name='play'),

    path('profile/', views.profile_view, name='profile'),
	path('profile/update/', views.user_updated_profile, name='update_profile'),
	path('profile/change_password/', views.user_password_changed, name='change_password'),
	path('profile/delete_account/', views.user_account_deleted, name='delete_account'),

    path('set_language/', set_language, name='set_language'),
]
