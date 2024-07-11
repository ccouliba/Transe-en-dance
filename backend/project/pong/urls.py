from django.urls import path
from .views.auth_views import * #register_view, login_view, logout_view, auth_callback, external_login
# from .views.game_views import *#play, start_game, update_score, finish_game, cancel_game, game
from .views.game_views import create_game, update_game
from .views.friend_views import * #send_friend_request, accept_friend_request, remove_friend, friends_data
from .views.tournament_views import * #create_tournament, player_joined_tournament, start_tournament, finish_tournament, cancel_tournament
from .views.profile_views import * #profile_view, user_updated_profile, user_password_changed, user_account_deleted, get_user_info, profile_update_view
from .views.user_views import * #user_list_json, user_list, index, home_view
from .api.api_views import *

app_name = 'pong'  # definir le namespace

urlpatterns = [

	path('', login_view, name='default_login'), 
	path('register/', register_view, name='register'),
	path('login/', login_view, name='login'),
	path('logout/', logout_view, name='logout'),
	# path('play/', play, name='play'), 	
	# path('start_game/', start_game, name='start_game'),
	# path('update_score/', update_score, name='update_score'),
	# path('finish_game/', finish_game, name='finish_game'),
	# path('cancel_game/', cancel_game, name='cancel_game'),
	# path('send_friend_request/', send_friend_request, name='send_friend_request'),
	# path('accept_friend_request/', accept_friend_request, name='accept_friend_request'),
	# path('refuse_friend_request/', refuse_friend_request, name='refuse_friend_request'),
	# path('remove_friend_request/', remove_friend_request, name='remove_friend_request'),
	# path('unfriend/', unfriend, name='unfriend'),
	path('create_tournament/', create_tournament, name='create_tournament'),
	path('player_joined_tournament/', player_joined_tournament, name='player_joined_tournament'),
	path('start_tournament/', start_tournament, name='start_tournament'),
	path('finish_tournament/', finish_tournament, name='finish_tournament'),
	path('cancel_tournament/', cancel_tournament, name='cancel_tournament'),
	path('update_profile/', user_updated_profile, name='update_profile'),
	path('change_password/', user_password_changed, name='change_password'),
	path('delete_account/', user_account_deleted, name='delete_account'),
	path('get_user_info/', get_user_info, name='get_user_info'),
	path('auth/callback/', auth_callback, name='auth_callback'),
	path('user_list_json/', user_list_json, name='user_list_json'),
	path('user_list/', user_list, name='user_list'),
	path('index/', index, name='index'),
	path('home/', home_view, name='home'),
	# path('game/', game, name='game'),
	path('external_login/', external_login, name='external_login'),
 
	path('api/profile/', profile_view, name='profile'),
	path('api/profile/update', profile_update_view, name='profile_update'),
	path('api/profile/send_friend_request/', send_friend_request, name='send_friend_request'),
	path('api/profile/accept_friend_request/', accept_friend_request, name='accept_friend_request'),
	path('api/profile/remove_friend/', remove_friend, name='remove_friend'),
	path('api/friends_data/', friends_data, name='friends_data'),
 
 
	path('api/games/create', create_game, name='create_game'),
	path('api/games/<int:game_id>/update', update_game, name='update_game'),
 
	## HERE our API views
	# # Same routes for login, register 
	path('api/login/', LoginAPIView.as_view, name='api_login'),
	# path('api/register/', api_register_view, name='api_register'),
	# path('api/external/<int:user_id>/', api_login_view, name='api_register'), 

]
