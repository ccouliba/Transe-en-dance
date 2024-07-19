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

