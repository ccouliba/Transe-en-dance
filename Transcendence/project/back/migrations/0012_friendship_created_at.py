# Generated by Django 4.2.3 on 2024-07-05 12:39

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0011_user_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='friendship',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
