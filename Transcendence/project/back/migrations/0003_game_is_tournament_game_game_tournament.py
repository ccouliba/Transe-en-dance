# Generated by Django 4.2.3 on 2024-08-08 19:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0002_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='is_tournament_game',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='game',
            name='tournament',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='games', to='pong.tournament'),
        ),
    ]
