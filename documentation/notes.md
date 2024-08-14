function saluer() {
	console.log("Bonjour !");
}

let actions = {
	direct: saluer,
	flechee: () => console.log("Salut !")
}

actions["direct"]()
actions["flechee"]()


let x = 5; // Assigner la valeur 5 à la variable x
'2' == 2; // true, car le string '2' est converti en nombre
0 == false; // true, car 0 et false sont considérés comme équivalents
'2' === 2; // false, car bien que les valeurs semblent similaires, les types sont différents
0 === false; // false, car les types sont différents


{% comment %} 
https://developer.mozilla.org/en-US/docs/Glossary/SPA
An SPA (Single-page application) is a web app implementation that loads only 
a single web document, and then updates the body content of that single document
 via JavaScript APIs such as Fetch when different content
 is to be shown.

This therefore allows users to use websites
 without loading whole new pages from the server, which can result in performance
  gains and a more dynamic experience, with some tradeoff disadvantages such as SEO,
   more effort required to maintain state, implement navigation, and do meaningful 
   performance monitoring. {% endcomment %}




<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<title>SPA</title>
</head>
<body>
	<div id="app"></div> <!-- Zone où le contenu sera injecté -->
	<button onclick="myFunction_back()">Go back</button>
	<button onclick="myFunction_next()">Go next</button>


	<script>

		function myFunction() {
			console.log("MARCHESTP")
			window.history.back();
		  }

		// Menu de l'application contenant des boutons pour la navigation
		function Menu() {
			return `
			<div>
				<button onclick="changePage('page1')">page1</button>
				<button onclick="changePage('page2')">page2</button>
				<button onclick="changePage('page4')">page4</button>
			</div>
			`;
		}

		// Fonction qui retourne un tableau simple HTML
		function Table() {
			return `
			<table>
				<tbody>
					<tr>
						<td>1</td>
					</tr>
				</tbody>
			</table>
			`;
		}

		// Contenu de la page 1
		function Page1(data) {
			return `
			<div>
				${Menu()}
				<h1>Page 1</h1>
				<p>Tu as ${data.age}</p>
			<div>
			`;
		}

		// Contenu de la page 2
		function Page2() {
			return `
			<div>
				${Menu()}
				<h1>Page 2</h1>
				${Table()}
			</div>
			`;
		}

		// Page d'erreur 404 affichee si la page n'est pas trouvee
		function Page404() {
			return `
			${Menu()}
			<div>404</div>    
			`;
		}

		// Objet contenant les fonctions pour afficher les differentes pages
		let pages = { //object litteral
			page1: () => mountComponent(Page1, { age: 20 }), //fonction anonyme et flechee
			page2: () => mountComponent(Page2),
		
		};


		// Fonction pour naviguer entre les pages
		function changePage(pageName) {
			if (typeof pages[pageName] === "undefined") { // Si la page demandée n'existe pas
				mountComponent(Page404); // Charge la page 404
				history.pushState({ page: 'page404' }, '', 'page404'); // Ajoute page404 à l'historique
				return;
			}
			pages[pageName](); // Charge la page demandée
			history.pushState({ page: pageName }, '', pageName); // Ajoute l'état de la page à l'historique
		}

		// Cette fonction écoute les changements d'état du navigateur (boutons précédent/suivant)
		window.onpopstate = function(event) {
			console.log("État pop :", event.state);
			if (event.state && pages[event.state.page]) {
				pages[event.state.page](); // Charge la page correspondant à l'état de l'historique
			} else {
				mountComponent(Menu); // Sinon, recharge le menu initial
			}
		};
		

		// Fonction pour afficher un composant dans la zone <div id="app">
		function mountComponent(componentFunction, data) {
			document.getElementById("app").innerHTML = componentFunction(data);
		}

		// Charge initialement le menu de navigation
		// Initialise l'application en chargeant le menu de navigation
		document.addEventListener("DOMContentLoaded", function() {
			mountComponent(Menu);
			history.replaceState({ page: 'menu' }, '', '#menu');
		});
	</script>
</body>
</html>

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
