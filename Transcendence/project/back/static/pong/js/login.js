var loginState = {
	isLoaded: false, // indique si les donnees de cette page ont ete chargees (initialement faux)
	showRegister: false // Indique si le formulaire d'inscription est affiche
};

// Fonction pour charger la page
function loadLoginState() {
	// Attacher des evenements aux formulaires et liens
	bindEvent(loginState, "#loginForm", "submit", handleLogin); // Attacher l'evenement submit au formulaire de connexion
	
	
	bindEvent(loginState, "#showRegister", "click", (event)=>{
		event.preventDefault()
		
		changePage("#register")
		return
	})
	loginState.isLoaded = true; // indique que la page est chargee

}

// Fonction pour afficher le formulaire de connexion ou d'inscription 
// Par defaut =? loginState.showRegister = false. Donc affiche formulaire de connexion (LoginForm)
// a) Si le user clique sur le lien "Don't have an account? Register" alors loginState.showRegister = true grace a la fonction toggleRegister
// Donc le formulaire d'inscription (RegisterForm) sera affiche
// b) Si le user clique sur le lien "Already have an account? Login" alors loginState.showRegister = false grace a la fonction toggleRegister
// Donc le formulaire de connexion (LoginForm) sera affiche
function Login() {
	if (!loginState.isLoaded) {
		loadLoginState(); // Charger la page si non chargee
	}

	
	return `
		<div class="container text-center mt-5">
			<h1>${window.trans.btnLogin}</h1> 
			 ${LoginForm()}
			<p class="mt-3">
				${window.trans.noAccount} <a href="#" id="showRegister">${window.trans.register}</a>
			</p>
			${ExternalLoginButton()}
		</div>
	`;
}


// Fonction pour afficher le formulaire de connexion
function LoginForm() {
	return `
		<form id="loginForm">
			<div class="form-floating" id="profilePage">
				<input type="text" class="form-control" name="username" id="username" autocomplete="username" placeholder="Username" required>
				<label for="username">Username</label>
			</div>
			<div class="form-floating" id="profilePage">
				<input type="password" class="form-control" name="password" id="password" autocomplete="current-password" placeholder="Password" required>
				<label for="password">Password</label>
			</div>
			<button type="submit" class="btn btn-primary">Login</button>
		</form>
	`;
}


// Fonction pour afficher le bouton de connexion externe avec api 42
function ExternalLoginButton() {
	return `
		<div class="mt-3">
			<a href="/pong/external_login/" class="btn btn-secondary">${window.trans.login42}</a>
		</div>
	`;
}

// Fonction pour gerer la soumission du formulaire de connexion
function handleLogin(event) {
	event.preventDefault(); // empecher le comportement par defaut du formulaire
	const username = event.target.elements.username.value; // obtenir le nom d'utilisateur
	const password = event.target.elements.password.value; // obtenir le mot de passe
	
	let url = `/pong/api/login/`;
	httpPostJson(url, { username, password })
	.then(response => {
		if (!response.ok) throw new Error('Network response was not ok'); // Verifier si la reponse est OK
		return response.json(); // Convertir la reponse en JSON
	})
	.then(data => {
		if (data.status === 'success') {
			localStorage.setItem('userToken', 'true'); // Stocker le token de l'utilisateur
			alert('Login successful!'); 
			changePage('#home');
			// changePage('#profile'); // Rediriger vers la page de profil
		} else {
			alert('Login failed: ' + data.message); 
		}
	})
	.catch(error => {
		console.error('Error:', error); 
		alert('An error occurred during login. Please ensure that the information you provide is accurate and correct.'); 
	});
}


//Authentification externe : 
// - user clique sur bouton => declenche la vue external_login
// - la vue external_login redirige le user vers l'URL d'authentification de l'api de 42 avec les parametres => client_id, redirect_uri, response_type
// - si user est authentifie via l'api de 42 alors redirection vers l'url de callback specifiee (auth_callback)
// - la vue auth_callback traite le retour de l'apie, obtient le token d'acces, recupere les infos du user et connecte le user a l'app
// - lorsque l'utilisateur est redirige vers l'app apres un login réussi, l'url contient un login_success=true.
// - la fonction js attachée à l'event load verifie ce parametre pour effectuer les actions necessaires (stocker le token de session, redirection du user etc)

// Gestion du login externe : va verifier la valeur de login_success
window.addEventListener("load", function () {
	// Recuperer les parametres de l'URL
	const urlParams = new URLSearchParams(window.location.search);

	// Obtenir la valeur du parametre 'login_success' de l'URL
	const loginSuccess = urlParams.get("login_success");

	// Verifier si 'login_success' est egal a "true"
	if (loginSuccess === "true") {
		// Stocker un token de connexion dans le localStorage
		localStorage.setItem("userToken", "true");

		// Afficher une alerte pour informer l'utilisateur du succes de la connexion
		alert("Login successful!");

		// Verifier si la fonction changePage est definie
		if (typeof changePage === "function") {
			// Appeler la fonction changePage pour naviguer vers la page du profil
			// changePage("#profile");
			// console.log("hello")
			changePage("#home");

		} else {
			// Afficher une erreur dans la console si changePage n'est pas definie
			console.error("changePage function is not defined");

			// Fallback : Changer directement le hash de l'URL pour naviguer vers la page du profil
			window.location.hash = "#profile";
		}
	}
});