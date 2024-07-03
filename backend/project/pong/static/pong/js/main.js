console.log("in main.js");

// Définir les routes et les fonctions de rendu
let routes = {
	home: () => mountComponent(Home),
	play: () => mountComponent(Play),
	404: () => mountComponent(Page404),
};

// Fonction pour afficher le menu
function Menu() {
	return `
		<div>
			<a href="#" onclick="changePage('home')">Home</a>
			<a href="#" onclick="changePage('play')">Play</a>
			<a href="#" onclick="changePage('profile')">Profile</a>
			<a href="#" onclick="changePage('logout')">Déconnexion</a>
			<a href="#" onclick="changePage('user_list')">Liste des utilisateurs - test</a>
		</div>`;
}

function Home() {
	console.log("IM AT HOME");
	return `
	<div>
		${Menu()}
		<h1>Welcome home</h1>
	</div>`;
}

function Play() {
	console.log("IM IN PLAY");
	return `
	<div>
		${Menu()}
		<h1>HELLO Play Page</h1>
		<p>Tu es sur la page de jeu.</p>
	</div>`;
}

function Page404() {
	return `
	<div>
		${Menu()}
		<h1>my own 404</h1>
		<p>Page non trouvée</p>
	</div>`;
}

// Fonction pour changer de page
window.changePage = function(pageName) {
	console.log("in changePage function");
	console.log(pageName);

	if (typeof routes[pageName] === "undefined") {
		console.log("page name is undefined so 404")
		// Si la page demandée n'existe pas
		// routes[404](); // Charger la page 404
		mountComponent(Page404)
		history.pushState({ page: "page404" }, "", "/404"); // Ajoute à l'historique

		return;
	}
	// console.log("what is being pushed", page, pageName)

	routes[pageName](); // Charge la page demandée
	history.pushState({ page: pageName }, "", `/${pageName}`); // Ajoute à l'historique

}
// // Gérer l'événement `popstate`
// window.onpopstate = function(event) {
// 	console.log(event.state)
//     const page = event.state ? event.state.page : '404';
//     if (routes[page]) {
//         routes[page](); // Appeler la fonction appropriée pour monter le composant
//     } else {
//         routes[404](); // Si la route n'existe pas, afficher la page 404
//     }
// };

// Fonction pour monter un composant
function mountComponent(componentFunction, data) {
	// Fonction pour charger un composant dans le div app
	document.getElementById("app").innerHTML = componentFunction(data);
}


// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
	changePage('home'); // Charger la page d'accueil par défaut
});

// console.log("in main.js");

// function Home() {
// 	console.log("IM AT HOME")
// 	return `
// 	<div>
// 	${Menu()}
// 	<h1> welcome home</h1>
// 	</div>
// 	`;
// }


// function Play() {
// 	console.log("IM IN PLAY")

// 	return `
// 	<div>
// 	${Menu()}
// 	<h1> HELLO Play Page</h1>
// 	<p>Tu es sur la page de jeu.</p>
// 	</div>
// 	`;
// }

// function Page404() {
// 	return `
// 	${Menu()}
// 		<h1>my own 404</h1>
// 		<p>Page non trouvée</p>
// `;
//   }

// // Fonction pour afficher le menu
// function Menu() {
// 	return `
// 		<div>
// 			<a href="#" onclick="changePage('home')">Home</a>
// 			<a href="#" onclick="changePage('play')">Play</a>
// 			<a href="#" onclick="changePage('profile')">Profile</a>
// 			<a href="#" onclick="changePage('logout')">Déconnexion</a>
// 			<a href="#" onclick="changePage('user_list')">Liste des utilisateurs - test</a>
// 		</div>`;
// }

// let routes = {
// 	home: () => mountComponent(Home),
// 	play: () => mountComponent(Play),
// 	404 : () => mountComponent(Page404),
// }

// // Fonction pour changer de page
// function changePage(pageName) {
// 	console.log("in changepage function")
// 	console.log(pageName)
// 	if (typeof routes[pageName] === "undefined") {
// 		// Si la page demandée n'existe pas
// 		mountComponent(Page404);
// 		history.pushState({ page: "page404" }, "", "page404"); // Ajoute à l'historique
// 		return;
// 	  }
// 	  routes[pageName](); // Charge la page 
// 	  history.pushState({ page: pageName }, '', pageName);
// }
// function mountComponent(componentFunction, data) {
// 	// Fonction pour charger un composant dans le div app
// 	document.getElementById("app").innerHTML = componentFunction(data);
//   }


// // Gérer l'événement `popstate`
// window.onpopstate = function (event) {

// 	if (event.state && event.state.page) {
// 		if (typeof pages[event.state.page] === "function") {
// 			pages[event.state.page](); // DOIT EXECUTER la fonction pour trouver le composant 
// 		} else {
// 			mountComponent(Page404); // Montre la page 404 si la fonction n'existe pas
// 		}
// 	} else {
// 		mountComponent(Menu); // Recharge le menu initial sinon
// 	}
// };



// // Initialiser l'application
// document.addEventListener('DOMContentLoaded', () => {
// 	changePage('home'); // Charger la page d'accueil par défaut

// });

// // // Ajouter des écouteurs d'événements aux boutons de navigation de l'historique
// // document.getElementById('goBack').addEventListener('click', function() {
// //     window.history.back();
// // });

// // document.getElementById('goForward').addEventListener('click', function() {
// //     window.history.forward();
// // });
