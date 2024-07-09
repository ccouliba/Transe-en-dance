from django.urls import path
from .views.auth_views import *
from .views.game_views import *
from .views.friend_views import *
from .views.tournament_views import *
from .views.profile_views import *
from .views.user_views import *
from .api.api_views import *

app_name = 'pong'  # definir le namespace

urlpatterns = [

	## HERE our API views
	# login
	path('api/login', api_login_view, name='api_login'), 
	# register
	# with_42
	# change_language

	path('', login_view, name='default_login'), 
	path('register/', register_view, name='register'),
	path('login/', login_view, name='login'),
	path('logout/', logout_view, name='logout'),
	path('play/', play, name='play'),
	path('start_game/', start_game, name='start_game'),
	path('update_score/', update_score, name='update_score'),
	path('finish_game/', finish_game, name='finish_game'),
	path('cancel_game/', cancel_game, name='cancel_game'),
	path('send_friend_request/', send_friend_request, name='send_friend_request'),
	path('accept_friend_request/', accept_friend_request, name='accept_friend_request'),
	path('refuse_friend_request/', refuse_friend_request, name='refuse_friend_request'),
	path('remove_friend_request/', remove_friend_request, name='remove_friend_request'),
	path('unfriend/', unfriend, name='unfriend'),
	path('create_tournament/', create_tournament, name='create_tournament'),
	path('player_joined_tournament/', player_joined_tournament, name='player_joined_tournament'),
	path('start_tournament/', start_tournament, name='start_tournament'),
	path('finish_tournament/', finish_tournament, name='finish_tournament'),
	path('cancel_tournament/', cancel_tournament, name='cancel_tournament'),
	path('profile/', profile_view, name='profile'),
	path('update_profile/', user_updated_profile, name='update_profile'),
	path('change_password/', user_password_changed, name='change_password'),
	path('delete_account/', user_account_deleted, name='delete_account'),
	path('get_user_info/', get_user_info, name='get_user_info'),
	path('auth/callback/', auth_callback, name='auth_callback'),
	path('user_list_json/', user_list_json, name='user_list_json'),
	path('user_list/', user_list, name='user_list'),
	path('index/', index, name='index'),
	path('home/', home_view, name='home'),
	path('game/', game, name='game'),
	path('external_login/', external_login, name='external_login'),
]
