// Cette fonction attache un evenement a un element DOM de maniere asynchrone
// Pourquoi ? car addEventListener fonctionne sur des elements deja presents dans le DOM
// Il gere les cas ou l'element n'existe pas encore dans le DOM.
function bindEvent(state, cssSelector, event, callback) {

	// Fonction interne pour attacher l'evenement aux elements correspondant au selecteur CSS
	function attachEvent() {
		// utilise querySelectorAll pour obtenir tous les elements correspondant au selecteur CSS
		let targets = document.querySelectorAll(cssSelector);
		// Verifie si des elements sont trouves et si l'etat est charge
		if (targets.length > 0 && state.isLoaded) {
			// Attache l'evenement a tous les elements trouves
			targets.forEach((target) => {
				// Verifie si l'evenement n'est pas deja attache
				if (!target.hasAttribute("data-event-attached")) {
					// Attache l'evenement
					target.addEventListener(event, callback);
					target.setAttribute("data-event-attached", "true"); //data-event-attached est ajouté à chaque target pour marquer que l'événement a été attaché
				}
			});
			return;
		}

		// Si les elements n'existent pas ou si l'etat n'est pas charge,
		// programme une nouvelle tentative dans 500 millisecondes
		setTimeout(attachEvent, 500);
	}

	// Demarre le processus d'attachement en appelant attachEvent
	attachEvent();

	// Ajoute un ecouteur pour les changements futurs du DOM

	// Ecoute l'evenement 'DOMContentLoaded'. Se declenche lorsque le HTML est completement charge
	// Cela signifie que tous les elements du DOM sont disponibles pour la manipulation
	document.addEventListener("DOMContentLoaded", attachEvent);

	// Verifie si le navigateur supporte l'API MutationObserver. The MutationObserver interface provides the ability to watch for changes being made to the DOM tree
	if (window.MutationObserver) {
		// Si le navigateur supporte MutationObserver, cree une instance de MutationObserver
		// MutationObserver surveille les changements dans le DOM, comme l'ajout ou la suppression d'elements
		const observer = new MutationObserver(attachEvent);

		// Configure l'observateur pour surveiller les changements dans le corps du document
		// childList: true -> surveille les ajouts et suppressions directs d'elements enfants
		// subtree: true -> surveille les changements dans tous les descendants de document.body
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
}

// Cette fonction reinitialise l'etat 'isLoaded' de tous les composants enregistres dans les routes
function resetLoaded() {
	// Parcourt toutes les cles (URLs) de l'objet routes ci-dessous
	Object.keys(routes).forEach((url) => {
		// Extrait le nom du composant de l'URL en supprimant le '#' et en prenant la partie apres
		let stateName = url.split("#")[1];
		
		// Ajoute "State" a la fin du nom du composant pour obtenir le nom de l'objet d'etat
		stateName += "State";
		// Verifie si un objet d'etat correspondant existe dans l'objet global window
		if (typeof window[stateName] !== "undefined") {
			// Si l'objet d'etat existe, reinitialise sa propriete isLoaded a false
			console.log(stateName, "fdf")
			window[stateName].isLoaded = false;
		}
	});
}

let routes = {
	"#home": () => mountComponent(Home),
	"#play": () => mountComponent(Play),
	"#profile": () => mountComponent(Profile),
	"#friends": () => mountComponent(FriendsList),
	"#404": () => mountComponent(Page404),
	"#tournament": () => mountComponent(Tournament),
	"#logout": () => mountComponent(Logout),
	"#login": () => mountComponent(Login),
	"#register": () => mountComponent(Register),
	"#match_history": () => mountComponent(MatchHistory)

};

function cleanStates(){
	if (friendsState.friendStatusInterval){
		clearInterval(friendsState.friendStatusInterval)
	}

	if (playState.checkInterval){
		clearInterval(playState.checkInterval)
	}

	resetLoaded()
}

function checkAuth(){
	return 	fetch("/pong/api/check_auth/")
	// Transformer la reponse en JSON
	.then((response) => response.json())
}

// Variable pour eviter plusieurs verifications d'authentification en meme temps
let isCheckingAuth = false;

// Fonction pour changer de page
window.changePage = function (url) {
	
	cleanStates()
	if (url === ''){
		changePage("#login")
		return 
	}
	if (url === "#login" || url === "#register"  ){
		url = "#login"
		routes[url]();
		// Mettre a jour l'historique du navigateur avec la nouvelle page
		history.pushState({
			page: url
		}, "", url);
		return
	}

	// Faire une requete pour verifier l'authentification de l'utilisateur
	checkAuth()
		.then((data) => {
			// La verification est terminee
		
			// Si l'utilisateur est authentifie
			if (data.is_authenticated) {
				// Stocker un token et le nom d'utilisateur dans le localStorage (=> une fonctionnalité de l'API Web Storage qui permet de stocker des données de manière persistante dans le navigateur)
				localStorage.setItem("userToken", "true");
				localStorage.setItem("username", data.username);
			} else {
				// Si l'utilisateur n'est pas authentifie, supprimer les infos du localStorage
				localStorage.removeItem("userToken");
				localStorage.removeItem("username");

				updateMenu();
				changePage("#login")
				return
			}

			if (url === "#play") {
				playState.isLoaded = false;
			}

				// Si l'URL n'existe pas dans les routes definies
			if (typeof routes[url] === "undefined") {
				// Afficher la page 404
				mountComponent(Page404);
				// Mettre a jour l'historique du navigateur avec la page 404
				history.pushState({
					page: "#404"
				}, "", "#404");
				return;
			}

				// Charger la nouvelle page selon l'URL
			routes[url]();
			// Mettre a jour l'historique du navigateur avec la nouvelle page
			history.pushState({
				page: url
			}, "", url);
			
		})
		.catch((error) => {
			// La verification est terminee meme en cas d'erreur
		
			// Afficher l'erreur dans la console
			console.error("Error:", error);
			
			
		});
};

// Gérer l'événement `popstate`
window.onpopstate = function (event) {
	const page = event.state ? event.state.page : "404";
	if (routes[page]) {
		routes[page](); // Appeler la fonction appropriée pour monter le composant
	} else {
		mountComponent(Page404); // Si la route n'existe pas, afficher la page 404
	}
};

// Fonction pour monter un composant
function mountComponent(componentFunction, data) {
	const appContainer = document.getElementById("app");
	appContainer.innerHTML = componentFunction(data);
	updateMenu(); //pour ne pas avoir le menu en double
}

// Fonction pour obtenir la valeur d'un cookie par son nom
// Utiliser pour recuperer le token CSRF necessaire pour les requetes securisees vers le backend
function getCookie(name) {
	// Initialiser la variable qui contiendra la valeur du cookie
	let cookieValue = null;

	// Verifier si document.cookie contient des cookies
	if (document.cookie && document.cookie !== "") {
		// Diviser tous les cookies en un tableau, chaque cookie est separe par ";"
		const cookies = document.cookie.split(";");

		// Parcourir tous les cookies
		for (let i = 0; i < cookies.length; i++) {
			// Supprimer les espaces au debut et a la fin du cookie
			const cookie = cookies[i].trim();

			// Verifier si le cookie commence par le nom recherche suivi d'un signe "="
			if (cookie.substring(0, name.length + 1) === name + "=") {
				// Extraire la valeur du cookie en decodant la partie apres le signe "="
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				// Arreter la boucle car le cookie a ete trouve
				break;
			}
		}
	}

	// Retourner la valeur du cookie, ou null si le cookie n'a pas ete trouve
	return cookieValue;
}

// Fonction pour mettre a jour le menu de navigation
function updateMenu() {
	// Trouver l'element du DOM qui contient le menu de navigation
	const menuContainer = document.getElementById("menu-container");

	// Verifier si l'element menu-container existe dans le DOM
	if (menuContainer) {
		// Mettre a jour le contenu HTML de l'element menu-container avec le nouveau menu genere par la fonction Menu
		menuContainer.innerHTML = Menu();
	}
}


