var logoutState = {
	isLoggedOut: false, // indique si l'utilisateur est deconnecte
	//pas besoin de isLoaded ici car deconnexion est une action immediate
};

// fonction pour gerer la deconnexion
function logout() {
	// verifier si l'utilisateur est deja deconnecte ou pas
	if (logoutState.isLoggedOut) {
		console.log("deja deconnecte");
		return; // sortir de la fonction si deja deconnecte
	}
	let url = `/pong/api/logout/`; 
	// fetch(url, {
	// 	method: "POST", 
	// 	credentials: "include", 
	// 	headers: {
	// 		'Content-Type': 'application/json', 
	// 		'X-CSRFToken': getCookie('csrftoken') 
	// 	},
	// })
	httpPostJson(url, {})
	.then(response => {
		if (!response.ok) {
			throw new Error(`http error! status: ${response.status}`); // verifier si la reponse est ok
		}
		return response.json(); // convertir la reponse en json
	})
	.then(data => {
		if (data.status === 'success') {
			console.log('deconnexion reussie');
			logoutState.isLoggedOut = true; // mettre a jour le boolean de logoutstate
			localStorage.clear(); // effacer le localstorage
			sessionStorage.clear(); // effacer le sessionstorage
			resetAllStates(); // reinitialiser tous les etats
			updateMenu(); // mettre a jour le menu
			changePage('#home'); // rediriger vers la page d'accueil
		} else {
			console.error('echec de la deconnexion:', data.message); // afficher un message d'erreur
			alert('echec de la deconnexion: ' + data.message); 
		}
	})
	.catch(error => {
		console.error('erreur lors de la deconnexion:', error); // afficher une erreur en cas d'echec
		alert('une erreur est survenue lors de la deconnexion. veuillez reessayer.'); // alerter l'utilisateur de l'erreur
	});
}

// fonction pour reinitialiser tous les etats
function resetAllStates() {
	// reinitialiser l'etat du profil utilisateur
	profileState = {
		username: "", // reinitialiser le nom d'utilisateur
		email: "", // reinitialiser l'email
		firstname: "", // reinitialiser le prenom
		lastname: "", // reinitialiser le nom de famille
		id: "", // reinitialiser l'id
		friends: [], // reinitialiser la liste d'amis
		isLoaded: false // indiquer que les donnees ne sont pas chargees
	};
	logoutState.isLoggedOut = false; // reinitialiser l'etat de deconnexion
}

// fonction pour afficher le message de deconnexion
function Logout() {
	logout(); // appeler la fonction de deconnexion
	return `
		<div>
			<h2>vous etes deconnecte</h2>
			<p>cliquez <a href="#login" onclick="changePage('#login')">ici</a> pour vous reconnecter.</p>
		</div>
	`;
}
