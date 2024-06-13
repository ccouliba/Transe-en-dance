# Useful ressources for starting Transcendance 

Start a project with Django framework

- https://docs.djangoproject.com/fr/5.0/intro/tutorial01/

- https://www.geeksforgeeks.org/getting-started-with-django/

- https://www.geeksforgeeks.org/create-pong-game-using-python-turtle/

- https://piehost.com/websocket/python-websocket

- https://jaydenwindle.com/writing/django-websockets-zero-dependencies/

- https://www.codeur.com/tuto/html/creer-formulaire-html/

- https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Authentication

- https://code-garage.fr/blog/qu-est-ce-que-le-ssr-ou-server-side-rendering/
(for ssr)

## For Ft_Transe_Brouillon :
Please follow this steps:
  - `cd project`
  - `source .venv/bin/activate` (Start project in a virtual environnement)
  - `docker-compose build && docker-compose up -d --build` (run the container)
  - `docker-compose exec web python3 manage.py makemigrations && docker-compose exec web python3 manage.py migrate --noinput` (Apply modifications of the databse)
  - `docker-compose exec web python manage.py createsuperuser` (Create a user in order to access Django server)
  - Finally open a browser to [localhost:8000/pong]

  (You can also go to [localhost:8000/admin] and connect with the very identifiers you used to create the superuser)

## Ft transcendance :
### Modules W
- Majeur : Backend (Django)
- mineur : Frontend (Bootstrap)
- mineur : Database (Postgres)

### Modules Gestion utilisateur
- Majeur : Gestion utilisateur standard, authentification, utilisateurs en tournois.
- Majeur : Implémenter une authentification à distance (API42)
- Majeur : Jouer a distance
- Majeur : Multijoueur
- Majeur : Chat
- mineur : Experience utilisateur (*Bonus*)
 	
### Modules IA-algo
- Majeur : IA (*Bonus*)
- mineur : Dashboard (*Bonus*)
 
### Modules Securite
- mineur : RGPD
- Majeur : 2FA/JWT (*Bonus*)

### Modules Devops
- Majeur : Journaux de log
- mineur : Monitoring
- Majeur : Microservices (*Bonus*)

### Modules Accessibilite
- mineur : Support sur tout type (*Bonus*)
- mineur : Compatibilite navigateur (*Bonus*)
- mineur : Multi-langues (*Bonus*)
- mineur : SSR (*Bonus*)

### Modules Oriente objet
- Majeur : Game cote serveur  (*Bonus*)
