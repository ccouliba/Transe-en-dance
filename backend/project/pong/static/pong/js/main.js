
// Définir les routes et les fonctions de rendu
let routes = {
	home: () => mountComponent(Home),
	play: () => mountComponent(Play),
	404: () => mountComponent(Page404),
};

document.addEventListener(onc)
// Fonction pour afficher le menu
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

function Menu() {
	return `
		<div>
			<a href="#" onclick="changePage('home'); event.preventDefault();">Home</a>
			<a href="#" onclick="changePage('play'); event.preventDefault();">Play</a>
			<a href="#" onclick="changePage('profile'); event.preventDefault();">Profile</a>
			<a href="#" onclick="changePage('logout'); event.preventDefault();">Déconnexion</a>
			<a href="#" onclick="changePage('user_list'); event.preventDefault();">Liste des utilisateurs - test</a>
		</div>`;
}

function Home() {
	return `
	<div>
		${Menu()}
		<h1>Welcome home</h1>
	</div>`;
}

function Play() {
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
window.changePage = function (pageName) {
	// console.log(pageName)
	
	if (typeof routes[pageName] === "undefined") {
		console.log("page name is undefined so 404")
		// Si la page demandée n'existe pas
		// routes[404](); // Charger la page 404
		mountComponent(Page404)
		history.pushState({ page: "page404" }, "", "/404"); // Ajoute à l'historique

		return;
	}
	console.log("what is being pushed", pageName)

	routes[pageName](); // Charge la page demandée
	let urlMap = {
		'home': '/pong/home/',
		'play': '/pong/play/',
		// 'profile': '/profile/',
		// 'logout': '/logout/',
		// 'user_list': '/user_list/'
	};
	console.log("urlMap[pageName]", urlMap[pageName])
	history.pushState({ page: pageName }, "", urlMap[pageName]); // Ajoute à l'historique
	// history.pushState({ page: pageName }, "", `/${pageName}`); // Ajoute à l'historique

}
// Gérer l'événement `popstate`
window.onpopstate = function(event) {
	const page = event.state ? event.state.page : '404';
	console.log("in onpopstate",page)
	if (routes[page]) {
		routes[page](); // Appeler la fonction appropriée pour monter le composant
	} else {
		routes[404](); // Si la route n'existe pas, afficher la page 404
	}
};

// Fonction pour monter un composant
function mountComponent(componentFunction, data) {
	// Fonction pour charger un composant dans le div app
	document.getElementById("app").innerHTML = componentFunction(data);
}


// // Initialiser l'application
// document.addEventListener('DOMContentLoaded', () => {
// 	changePage('home'); // Charger la page d'accueil par défaut
// });


/////////////////////////////////////////////////////////////////////////////////////////////////

const home = document.getElementById()