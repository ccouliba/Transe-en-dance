from django.urls import path
from .views.auth_views import base_view,check_auth, register_view, login_view, logout_view, auth_callback, external_login, soft_delete_user
from .views.game_views import create_game, update_game, finish_game, match_history,  get_current_user
from .views.friend_views import send_friend_request, accept_friend_request, remove_friend, friends_data, friends_online_status
from .views.profile_views import profile_view, get_user_locale, user_updated_profile, edit_password_view, get_user_info, profile_update_view, upload_avatar
from .views.user_views import index, home_view
from .views.tournament_views import create_tournament, tournament_view, tournament_detail, add_participants, add_alias, start_tournament, tournament_matchmaking, finish_tournament, update_match_score

from django.conf import settings
from django.conf.urls.static import static

app_name = 'pong'  # definir le namespace

urlpatterns = [

	path('', base_view, name='base'), 
 
	# path('register/', register_view, name='register'),
	path('api/login/', login_view, name='login'),
	path('api/logout/', logout_view, name='logout'),
	path('api/register/', register_view, name='api_register'),
	path('update_profile/', user_updated_profile, name='update_profile'),
	path('get_user_info/', get_user_info, name='get_user_info'),
	path('auth/callback/', auth_callback, name='auth_callback'),
	path('index/', index, name='index'),
	path('external_login/', external_login, name='external_login'),
 
 
	path('home/', home_view, name='home'),
	path('home/', home_view, name='home'),

 	path("api/get-user-locale", get_user_locale,  name="user_locale"),
	
	path('api/check_auth/', check_auth, name='check_auth'),
	path('api/profile/', profile_view, name='profile'),
	path('api/profile/update', profile_update_view, name='profile_update'),
	path('api/profile/change-password', edit_password_view, name='change_password'),
 	path('api/profile/upload-avatar/', upload_avatar, name='upload_avatar'),
 	path('api/profile/soft_delete_user/', soft_delete_user, name='upload_avatar'),
  
 
	path('api/profile/send_friend_request/', send_friend_request, name='send_friend_request'),
	path('api/profile/accept_friend_request/', accept_friend_request, name='accept_friend_request'),
	path('api/profile/remove_friend/', remove_friend, name='remove_friend'),
	path('api/friends_data/', friends_data, name='friends_data'),
	path('api/friends/get-status/', friends_online_status, name='friends_online_status'),
 
	path('api/games/create_game/', create_game, name='create_game'),
	path('api/games/<int:game_id>/update', update_game, name='update_game'),
	path('api/games/finish_game/<int:game_id>/', finish_game, name='finish_game'),
	path('api/games/match_history/', match_history, name='match_history'),
	path('api/games/get_current_user/', get_current_user, name='get_current_user'),
 
	path('api/tournament/create/', create_tournament, name='create_tournament'),
	path('api/tournament/latest_tournament/', tournament_view, name='create_tournament'),
	path('api/tournament/<int:tournament_id>/', tournament_detail, name='tournament_detail'),
	path('api/tournament/<int:tournament_id>/add_participants/', add_participants, name='add_participants'),
	path('api/tournament/<int:tournament_id>/add_alias/', add_alias, name='add_alias'),
	path('api/tournament/<int:tournament_id>/start/', start_tournament, name='start_tournament'),
	path('api/tournament/<int:tournament_id>/matchmaking/', tournament_matchmaking, name='tournament_matchmaking'),
	path('api/tournament/<int:tournament_id>/finish/', finish_tournament, name='finish_tournament'),
	path('api/tournament/update_match_score/', update_match_score, name='update_match_score'),
]

