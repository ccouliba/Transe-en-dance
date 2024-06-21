from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from .views import register_view, login_view, home_view, auth_callback, external_login_view, play

app_name = "pong"
urlpatterns = [
	# path("", views.index, name="index"),
	# path("home/", home_view, name="home"),
	path("users", views.user_list, name="user_list"),
	path("", views.index, name="index"), # Home Page
	path("home/", home_view, name="home"), #home
	path("register/", register_view, name='register'),
	path("login/", login_view, name="login"),
 	path('logout/', LogoutView.as_view(next_page='pong:login'), name='logout'),
	path('external-login/', views.external_login_view, name='external-login'),
	path('auth/callback/', views.auth_callback, name='auth_callback'),
	path('play/', play, name='play'),
	
	
	path('profile/', views.profile_view, name='profile'),
	path('profile/update/', views.user_updated_profile, name='update_profile'),
	path('profile/change_password/', views.user_password_changed, name='change_password'),
	path('profile/delete_account/', views.user_account_deleted, name='delete_account'),
 
	path('start_game/', views.start_game, name='start_game'),
	path('update_score/', views.update_score, name='update_score'),
	path('finish_game/', views.finish_game, name='finish_game'),
	path('cancel_game/', views.cancel_game, name='cancel_game'),
 
]
