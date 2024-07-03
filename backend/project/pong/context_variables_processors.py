from django.utils.translation import gettext as _

# commands for translating
# First of all we have to be in pong
# Then run -> python3 -m django makemessages -l 'xx'
# after that write the translations in the very file that python created (.po)
# Finally run -> python3 -m django compilemessages (that will generate .mo)

def texts_to_translate(request):
    return {
        'of_txt':_("of"),
        'or_txt':_("or"),
        
        # Registration and login
        'register_txt':_("Register"),
        'login_txt':_("Log in"),
        'have_account_txt':_("If you already have an account"),
        'no_account_txt':_("If you don't have an account"),
        'external_log_txt':_("Log with"),
        
        # # Related to Account
        'welcome_txt':_("Welcome"),
        'home_txt':_("Home"),
        'delete_account_txt': _("Delete account"),
        'confirm_deletion_txt':_("Do you confirm the deletion of your account?"),
        'no_change_txt':_("No i have changed my mind"),
        'back_to_profile_txt': _("Back to profile"),
        'disconnect_txt':_("Disconnect"),
        
        # # Related to Language
        'language_txt':_("Language"),
        'select_language_txt':_("Select language"),
        'change_txt':_("Change"),
        
        # # Related to Game
        'play_txt': _("Play"),
        'start_game_txt':_("Start game"),
        'stop_game_txt':_("Stop game"),
        
        # # # User list
        'user_list_txt':_("User list"),
        
        # # Related to Profile
        'profile_information_txt':_("Profile Information"),
        'profile_txt':_("Profile"),
        'name_txt':_("Name"),
        'username_txt':_("Username"),
        'email_txt':_("Email"),
        'user_id_txt':_("User id"),
        'change_password_txt': _("Change password"),
        'hashed_password_txt':_("Hashed password"),
        'update_profile_txt': _("Update profile"),
        'download_pdf_txt':_("Download as PDF"),
        
        # # # Friends list
        'friends_list_txt':_("Friends list"),
        'remove_txt':_("Remove"),
        'no_friend_txt':_("No friend yet"),
        
        # # # Friend request sent
        'friend_request_txt':_("Friend requests sent"),
        'no_request_send_txt':_("No friend request sent yet"),
        
        # # # Friend request received
        'friend_request_rec_txt':_("Friend requests received"),
        'accept_txt':_("Accept"),
        'refuse_txt':_("Refuse"),
        'no_request_rec_txt':_("No friend request received yet"),
        
        # # # Send friend request
        'friend_request_sent_txt':_("Send friend request"),
        'send_txt':_("Send"),
        
        # # Footage
        'reserved_rights_txt':_("All rights reserved"),
    }