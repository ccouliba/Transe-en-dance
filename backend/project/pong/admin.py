from django.contrib import admin
from .models import User, Friendship, Game, Tournament, Participate, Composed

# Register your models here.

admin.site.register(User)
admin.site.register(Friendship)
admin.site.register(Game)
admin.site.register(Tournament)
admin.site.register(Participate)
admin.site.register(Composed)