from django.utils.translation import gettext as _

# commands for translating
# First of all we have to be in pong
# Then run -> python3 -m django makemessages -l 'fr' (fr cause we want french)
# after that write the translations in the very file that python created (.po)
# Finally run -> python3 -m django compilemessages (that will generate .mo)

def texts_to_translate(request):
    return {
        # Context variables for the values of input balise
        'play_txt': _("Play"),
        'logout_txt': _("Logout"),
        'update_profile_txt': _("Update profile"),
        'change_password_txt': _("Change password"),
        'delete_account_txt': _("Delete account"),

        # Other context variables
        'no_account_txt':_("If you don't have an account"),
        'register_txt':_("Register"),
        'or_txt':_("or"),
        'external_log_txt':_("Log with"),
        'login_txt':_("Log in"),
        'have_account_txt':_("If you already have an account"),

        'profile_information_txt':_("Profile Information"),
        'welcome_txt':_("Welcome"),
        'back_to_profile_txt': _("Back to profile"),
        'no_change_txt':_("No i have changed my mind"),
        'confirm_deletion_txt':_("Do you confirm the deletion of your account?"),
        'select_language_txt':_("Select language"),
        'change_txt':_("Change"),
        'home_txt':_("Home"),
        'profile_txt':_("Profile"),
        'language_txt':_("Language"),
        'disconnect_txt':_("Disconnect"),
        'username_txt':("Username"),
        'email_txt':("Email"),
        'reserved_rights_txt':_("All rights reserved"),
    }