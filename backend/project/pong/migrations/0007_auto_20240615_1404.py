# Generated by Django 4.2.3 on 2024-06-15 14:04

from django.db import migrations


class Migration(migrations.Migration):

    from django.db import migrations, models
from django.contrib.auth import get_user_model
from django.utils import timezone

def create_initial_user_and_player(apps, schema_editor):
    User = apps.get_model('pong', 'User')
    Player = apps.get_model('pong', 'Player')
    
    # Creer un utilisateur
    user = User.objects.create_user(
        username='user',
        email='user@email',
        password='abc'
    )
    
    # Creer un joueur associé à cet utilisateur
    Player.objects.create(user=user)

class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0006_participate_composed_and_more'),  # Assurez-vous que cette dépendance pointe vers la migration initiale correcte
    ]

    operations = [
        migrations.RunPython(create_initial_user_and_player),
    ]
