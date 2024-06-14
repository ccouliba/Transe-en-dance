#!/bin/bash

# cd project
# source .venv/bin/activate #(Start project in a virtual environnement)
docker-compose build && docker-compose up -d --build # (run the container)
docker-compose exec web python3 manage.py makemigrations && docker-compose exec web python3 manage.py migrate --noinput # (Apply modifications of the databse)

# #apres modification du code 
# docker-compose restart web

# if :  ./start.sh
# bash: ./start.sh: /bin/bash^M: bad interpreter: No such file or directory
# sed -i 's/\r$//' .venv/bin/activate
# sed -i 's/\r$//' start.sh