# Notes

#### SPA from hell

What is happening when we want data from backend : 
- URL : http://localhost:8000/pong/profile/
- Le fichier profile.html étend base.html
- La fonction changePage() se trouve dans main.js
- La fonction Profile() se trouve dans profile.js :
  - La fonction loadProfileFromBackend() :
      - Utilise fetch sur l'URL de Profile => fait appel à la vue associée à l'URL (// urls.py)
      - ATTENTION fetch est non bloquant. Donc ce batard n'empêche pas l'exécution du reste du code pendant qu'il attend une réponse du serveur
      Donc comment faire ? 
      - Récupère les informations du backend et les assigne à une variable JS globale (profileState)
  - Retourne le HTML de la page avec les informations obtenues du backend grâce à la variable globale profileState

What is happening when we want to send data to the backend : 
- URL : http://localhost:8000/pong/profile/
- Le fichier profile.html étend base.html
- La fonction changePage() se trouve dans main.js
- La fonction Profile() se trouve dans profile.js :
  - La fonction loadProfileFromBackend() retourne le HTML de la page. 
  - Dans ce HTML => ${EditUsername()}

- function EditUsername() : 
  - Retourne le HTML du formulaire pour changer le username de l'utilisateur. 
  - On aimerait utiliser addeventlistener MAIS addeventlistener ne peut s'utiliser que si le HTML est deja charge. Or, le HTML du formulaire ne se charge qu'a la fin car c'est la valeur de retour de la fonction EditUsername(). 
  - DONC => utilisation de la fonction bindEvent()
- bindEvent() dans main.js
  - On utilise isLoaded de la variable globale profileState. Cette variable est a true lorsqu'on passe dans la fonction loadProfileFromBackend(). 
  - Donc si isLoaded est a true, cela veut dire qu'on a charge une premiere fois le html. Et on peut donc utiliser addeventlistener().




#### from localhost :

- docker-compose up db 
- Si erreur : `django.core.exceptions.ImproperlyConfigured: Error loading psycopg2 or psycopg module` alors : 
pip install psycopg2-binary
- SECRET_KEY=foo python3 manage.py runserver
- psql -U ccouliba -h localhost -p 5433 -W -d db1

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

# Ft transcendance :

## Modules a faire
### Web
  - Majeur : Backend (Django)
  - mineur : Frontend (Bootstrap)
  - mineur : Database (Postgres)
### Gestion utilisateur
  - Majeur : Gestion utilisateur standard, authentification, utilisateurs en tournois.
  - Majeur : Implémenter une authentification à distance (API42)
### IA-algo
  - Majeur : IA
### Securite
  - mineur : RGPD
### Devops
  - Majeur : Journaux de log
### Modules Accessibilite
  - mineur : Multi-langues
  - mineur : SSR (Django itself allows us to)

## Bonus
### Modules IA-algo
  - mineur : Dashboard (*Bonus*)
### Modules Gestion utilisateur
  - mineur : Experience utilisateur (*Bonus*)
### Jouabilité et expérience utilisateur
  - Majeur : Jouer a distance
### Modules Securite
  - Majeur : 2FA/JWT (*Bonus*)
### Modules Accessibilite
  - mineur : Support sur tout type (*Bonus*)
  - mineur : Compatibilite navigateur (*Bonus*)
### Modules Devops
  - Majeur : Microservices (*Bonus*)
### Modules Oriente objet
  - Majeur : Game cote serveur  (*Bonus*)
