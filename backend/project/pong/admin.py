from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.User)
admin.site.register(models.Friendship)
admin.site.register(models.Game)
admin.site.register(models.Tournament)
admin.site.register(models.Participate)
admin.site.register(models.Composed)