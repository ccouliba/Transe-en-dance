export DEV_ENV=1
export SECRET_KEY=foo
python3 manage.py flush --no-input
python3 manage.py migrate sessions
python3 manage.py migrate
# python3 manage.py runserver 0.0.0.0:8000
python3 manage.py collectstatic
gunicorn server.wsgi:application --bind 0.0.0.0:8000 --certfile=./selfsigned.crt --keyfile=./selfsigned.key
