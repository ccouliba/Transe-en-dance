#!/bin/bash

# cd project
# source .venv/bin/activate (Start project in a virtual environnement)
docker-compose build && docker-compose up -d --build # (run the container)
docker-compose exec web python3 manage.py makemigrations && docker-compose exec web python3 manage.py migrate --noinput # (Apply modifications of the databse)
