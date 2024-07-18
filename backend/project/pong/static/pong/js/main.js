// Cette fonction attache un evenement a un element DOM de maniere asynchrone
// Pourquoi ? car addEventListener fonctionne sur des elements deja presents dans le DOM
// Il gere les cas ou l'element n'existe pas encore dans le DOM 
function bindEvent(state, cssSelector, event, callback){
   
	// Recherche l'element DOM correspondant au selecteur CSS
	let target = document.querySelector(cssSelector)

	// Verifie si l'element existe et si l'etat du composant est charge
	if (target && state.isLoaded){
		// Si les conditions sont remplies, attache l'evenement a l'element
		target.addEventListener(event, callback)
		// Termine l'execution de la fonction
		return  
	}
   
	// Si l'element n'existe pas ou si l'etat n'est pas charge,
	// programme une nouvelle tentative dans 500 millisecondes
	setTimeout(() => bindEvent(state, cssSelector, event, callback), 500)  
}

// Cette fonction reinitialise l'etat 'isLoaded' de tous les composants enregistres dans les routes
function resetLoaded(){
	// Parcourt toutes les cles (URLs) de l'objet routes
	Object.keys(routes).forEach(url => {
		// Extrait le nom du composant de l'URL en supprimant le '#' et en prenant la partie apres
		let stateName = url.split("#")[1]
	   
		// Ajoute "State" a la fin du nom du composant pour obtenir le nom de l'objet d'etat
		stateName += "State"

		// Verifie si un objet d'etat correspondant existe dans l'objet global window
		if (typeof window[stateName] !== "undefined"){
			// Si l'objet d'etat existe, reinitialise sa propriete isLoaded a false
			window[stateName].isLoaded = false
		}
	})
}

let routes = {
	"#home": () => mountComponent(Home),
	"#play": () => mountComponent(Play),
	"#profile": () => mountComponent(Profile),
	"#friends": () => mountComponent(FriendsList),
	"#404":() => mountComponent(Page404),
	"#tournament":() => mountComponent(Tournament),
	"#logout":() => mountComponent(Logout),
	"#login": () => mountComponent(Login),
	"#register": () => mountComponent(Register),
};


// Fonction pour changer de page
// window.changePage = function (url) {
// 	if (url === "#play") {
// 		playState.isLoaded = false;
// 	  }
// 	if (typeof routes[url] === "undefined") {
// 		mountComponent(Page404)
// 		history.pushState({ page: "#404" }, "", "#404"); // Ajoute à l'historique
// 		return;
// 	}
	
// 	routes[url](); // Charge la page demandée
	
// 	history.pushState({ page: url }, "", url); // Ajoute à l'historique

// }

window.changePage = function (url) {
	fetch('/pong/api/check_auth')
		.then(response => response.json())
		.then(data => {
			if (data.is_authenticated) {
				localStorage.setItem('userToken', 'true');
				localStorage.setItem('username', data.username);
			} else {
				localStorage.removeItem('userToken');
				localStorage.removeItem('username');
			}
			updateMenu(); 
			if (!data.is_authenticated && url !== "#login" && url !== "#register") {
				changePage("#login");
			} else {
				if (url === "#play") {
					playState.isLoaded = false;
				}
				if (typeof routes[url] === "undefined") {
					mountComponent(Page404);
					history.pushState({ page: "#404" }, "", "#404");
					return;
				}
				routes[url]();
				history.pushState({ page: url }, "", url);
			}
			updateMenu();
		})
		.catch(error => {
			console.error('Error:', error);
			changePage("#login");
		});
}

// Gérer l'événement `popstate`
window.onpopstate = function(event) {
//	resetLoaded()
	const page = event.state ? event.state.page : '404';
	if (routes[page]) {
		routes[page](); // Appeler la fonction appropriée pour monter le composant
	} else {
		mountComponent(Page404); // Si la route n'existe pas, afficher la page 404
	}
};

// Fonction pour monter un composant
// function mountComponent(componentFunction, data) {
// 	// Fonction pour charger un composant dans le div app qui se trouve dans base.html
// 	document.getElementById("app").innerHTML = componentFunction(data);

// }

function mountComponent(componentFunction, data) {
	const appContainer = document.getElementById("app");
	appContainer.innerHTML = componentFunction(data);
	updateMenu();  //pour ne pas avoir le menu en double
}

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function updateMenu() {
	const menuContainer = document.getElementById('menu-container');
	if (menuContainer) {
		menuContainer.innerHTML = Menu();
	}
}

