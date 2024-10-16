#!/bin/sh

python manage.py makemigrations
python manage.py migrate

# collects all static files in our app and puts it in the STATIC_ROOT
python manage.py collectstatic --noinput

gunicorn server.wsgi:application -b 0.0.0.0:8000 --certfile=./selfsigned.crt --keyfile=./selfsigned.key
