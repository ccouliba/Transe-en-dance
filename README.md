For Ft_Transe_Brouillon :
Please follow this steps:
  - cd project
  - source .venv/bin/activate (Start project in a virtual environnement)
  - docker-compose build && docker-compose up -d --build (run the container)
  - docker-compose exec web python3 manage.py makemigrations && docker-compose exec web python3 manage.py migrate --noinput (Apply modifications of the databse)
  - docker-compose exec web python manage.py createsuperuser (Create a user in order to access Django server)
  - Finally open a browser to localhost:8000/pong
=D
