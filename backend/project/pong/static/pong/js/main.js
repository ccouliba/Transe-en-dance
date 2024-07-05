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


function bindEvent(state, cssSelector, event, callback){
   
	if (state.isLoaded){
		document.querySelector(cssSelector).addEventListener(event, callback)
		return	
    }

	setTimeout(() => bindEvent(state, cssSelector, event, callback), 500)
	
   
}



let routes = {
	home: () => mountComponent(Home),
	play: () => mountComponent(Play),
	profile: () => mountComponent(Profile),
	// login: () => mountComponent(Login),
	404: () => mountComponent(Page404),
};


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


// Fonction pour changer de page
window.changePage = function (pageName) {

	console.log("what is being pushed", pageName)
	console.log(routes)

	if (typeof routes[pageName] === "undefined") {
		console.log("page name is undefined so 404")
		mountComponent(Page404)
		history.pushState({ page: "page404" }, "", "/404"); // Ajoute à l'historique
		return;
	}
	
	routes[pageName](); // Charge la page demandée
	let urlMap = {
		'home': '/pong/home/',
		'play': '/pong/play/',
		'profile': '/pong/profile/',

		// 'login' : '/pong/login',
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
