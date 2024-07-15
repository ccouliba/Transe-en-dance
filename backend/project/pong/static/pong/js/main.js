// // Fonction pour charger un fichier CSS. Pour l'instant le CSS est charge dans base.html

// function loadCSS(filename) {
// 	let link = document.createElement('link');
// 	link.rel = 'stylesheet';
// 	link.type = 'text/css';
// 	link.href = filename;
// 	document.getElementsByTagName('head')[0].appendChild(link);
// }

// Appel de la fonction pour charger le CSS
//loadCSS("{% static 'pong/css/style.css' %}"); 


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
	"#tournament":() => mountComponent(Tournament)
	// login: () => mountComponent(Login),
};


// Fonction pour changer de page
window.changePage = function (url) {
	if (url === "#play") {
		playState.isLoaded = false;
	  }
	if (typeof routes[url] === "undefined") {
		mountComponent(Page404)
		history.pushState({ page: "#404" }, "", "#404"); // Ajoute à l'historique
		return;
	}
	
	routes[url](); // Charge la page demandée
	
	history.pushState({ page: url }, "", url); // Ajoute à l'historique

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
function mountComponent(componentFunction, data) {
	// Fonction pour charger un composant dans le div app qui se trouve dans base.html
	document.getElementById("app").innerHTML = componentFunction(data);
}

