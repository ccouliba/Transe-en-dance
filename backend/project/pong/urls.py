from django.urls import path
from .views.auth_views import base_view,check_auth, register_view, login_view, logout_view, auth_callback, external_login
from .views.game_views import create_game, update_game, finish_game
from .views.friend_views import send_friend_request, accept_friend_request, remove_friend, friends_data, friends_online_status
from .views.profile_views import profile_view, user_updated_profile, user_account_deleted,edit_password_view, get_user_info, profile_update_view, upload_avatar
from .views.user_views import user_list_json, user_list, index, home_view
# from .views.tournament_views import (
# 	create_tournament, get_tournament_state, register_player,
# 	start_tournament, end_tournament_match, finish_tournament, cancel_tournament
# )
from django.conf import settings
from django.conf.urls.static import static

from .views.tournament_views import (
	get_tournament_state, register_player,
)
app_name = 'pong'  # definir le namespace

urlpatterns = [

	path('', base_view, name='base'), 
 
	# path('register/', register_view, name='register'),
	path('api/login/', login_view, name='login'),
	path('api/logout/', logout_view, name='logout'),
	path('api/register/', register_view, name='api_register'),
 
	path('update_profile/', user_updated_profile, name='update_profile'),
	path('delete_account/', user_account_deleted, name='delete_account'),
	path('get_user_info/', get_user_info, name='get_user_info'),
	path('auth/callback/', auth_callback, name='auth_callback'),
	path('user_list_json/', user_list_json, name='user_list_json'),
	path('user_list/', user_list, name='user_list'),
	path('index/', index, name='index'),
 
	path('home/', home_view, name='home'),

	path('external_login/', external_login, name='external_login'),
 
	path('api/check_auth/', check_auth, name='check_auth'),
	path('api/profile/', profile_view, name='profile'),
	path('api/profile/update', profile_update_view, name='profile_update'),
	path('api/profile/change-password', edit_password_view, name='change_password'),
 	path('api/profile/upload-avatar/', upload_avatar, name='upload_avatar'),
 
	path('api/profile/send_friend_request/', send_friend_request, name='send_friend_request'),
	path('api/profile/accept_friend_request/', accept_friend_request, name='accept_friend_request'),
	path('api/profile/remove_friend/', remove_friend, name='remove_friend'),
	path('api/friends_data/', friends_data, name='friends_data'),
	path('api/friends/get-status/', friends_online_status, name='friends_online_status'),
 
 
	path('api/games/create', create_game, name='create_game'),
	path('api/games/<int:game_id>/update', update_game, name='update_game'),
	path('api/games/finish_game/<int:game_id>/', finish_game, name='finish_game'),
 
	# path('api/tournament/create', create_tournament, name='create_tournament'),
	path('api/tournament/state', get_tournament_state, name='get_tournament_state'),
	path('api/tournament/register', register_player, name='register_player'),
	# path('api/tournament/start', start_tournament, name='start_tournament'),
	# path('api/tournament/endmatch', end_tournament_match, name='end_tournament_match'),
	# path('api/tournament/finish', finish_tournament, name='finish_tournament'),
	# path('api/tournament/cancel', cancel_tournament, name='cancel_tournament'),
]

