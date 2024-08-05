export DEV_ENV=1
export SECRET_KEY=foo
python3 manage.py migrate
python3 manage.py runserver
