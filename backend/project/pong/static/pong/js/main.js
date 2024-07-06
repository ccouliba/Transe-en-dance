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
		console.log(cssSelector)
		document.querySelector(cssSelector).addEventListener(event, callback)
		return	
	}

	setTimeout(() => bindEvent(state, cssSelector, event, callback), 500)	
}


function resetLoaded(){

	Object.keys(routes).forEach(url => {
		let stateName = url.split("#")[1]
		
		stateName += "State"
		if (typeof window[stateName] !== "undefined"){
			window[stateName].isLoaded = false
		}
	})


}

let routes = {
	"#home": () => mountComponent(Home),
	"#play": () => mountComponent(Play),
	"#profile": () => mountComponent(Profile),
	"#404":() => mountComponent(Page404)
	// login: () => mountComponent(Login),
};


// Fonction pour changer de page
window.changePage = function (url) {

	resetLoaded()
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
	resetLoaded()
	const page = event.state ? event.state.page : '404';
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

