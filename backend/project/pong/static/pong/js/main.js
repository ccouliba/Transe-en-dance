// Fonction pour charger un fichier CSS
function loadCSS(filename) {
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = filename;
	document.getElementsByTagName('head')[0].appendChild(link);
}

// Appel de la fonction pour charger le CSS
loadCSS("{% static 'pong/css/style.css' %}"); 

let routes = {
	home: () => mountComponent(Home),
	play: () => mountComponent(Play),
	// login: () => mountComponent(Login),
	404: () => mountComponent(Page404),
};

function Menu() {
	return `
		<div class="navbar">
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

// function Login() {
// 	return `
// 	<div>
// 		<h1>Login</h1>
// 		<form>
// 			<label for="username">Username:</label>
// 			<input type="text" id="username" name="username"><br><br>
// 			<label for="password">Password:</label>
// 			<input type="password" id="password" name="password"><br><br>
// 			<input type="submit" value="Login">
// 		</form>
// 	</div>`;
// }


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
	if (typeof routes[pageName] === "undefined") {
		console.log("page name is undefined so 404")
		mountComponent(Page404)
		history.pushState({ page: "page404" }, "", "/404"); // Ajoute à l'historique
		return;
	}
	console.log("what is being pushed", pageName)

	routes[pageName](); // Charge la page demandée
	let urlMap = {
		'home': '/pong/home/',
		'play': '/pong/play/',
		// 'login' : '/pong/login',
		// 'profile': '/profile/',
		// 'logout': '/logout/',
		// 'user_list': '/user_list/'
	};
	console.log("urlMap[pageName]", urlMap[pageName])
	history.pushState({ page: pageName }, "", urlMap[pageName]); // Ajoute à l'historique

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

// // Vérifier l'URL au chargement de la page
// window.onload = function() {
// 	// Vérifier si l'URL est '/pong/'
// 	if (window.location.pathname === '/pong/') {
// 		changePage('login'); // Afficher la page de login par défaut
// 	} else {
// 		// Extraire la dernière partie de l'URL pour déterminer la page à afficher
// 		const path = window.location.pathname.split('/').filter(part => part).pop();
// 		changePage(path || '404'); // Afficher la page correspondante ou la 404 si la route n'existe pas
// 	}
// };
