var registerState = {
	isLoaded:false
}
// Fonction pour afficher le formulaire d'inscription
function Register() {

	if (!registerState.isLoaded) {
		bindEvent(registerState, "#showLogin", "click", (event)=>{
			event.preventDefault()
			
			changePage("#login")
			return
		})

		bindEvent(registerState, "#registerForm", "submit", handleRegister)

		registerState.isLoaded = true
	}

	return `
		<form id="registerForm">
			<h1>Register</h1> 
			<div class="mb-3">
				<input type="text" class="form-control" name="username" placeholder="Username" required>
			</div>
			<div class="mb-3">
				<input type="email" class="form-control" name="email" placeholder="Email" required>
			</div>
			<div class="mb-3">
				<input type="password" class="form-control" name="password1" placeholder="Password" required>
			</div>
			<div class="mb-3">
				<input type="password" class="form-control" name="password2" placeholder="Confirm Password" required>
			</div>
			<button type="submit" class="btn btn-primary">Register</button>
		</form>

 		<button href="#" id="showLogin">Go back to login</button>
	`;
}



// Fonction pour gerer la soumission du formulaire d'inscription
function handleRegister(event) {
	event.preventDefault(); // Empecher le comportement par defaut du formulaire
	const username = event.target.elements.username.value; // Obtenir le nom d'utilisateur
	const email = event.target.elements.email.value; // Obtenir l'email
	const password1 = event.target.elements.password1.value; // Obtenir le mot de passe
	const password2 = event.target.elements.password2.value; // Obtenir la confirmation du mot de passe
	let url = `/pong/api/register/`; 

	fetch(url, {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json', // Type de contenu JSON
			'X-CSRFToken': getCookie('csrftoken') // Ajouter le token CSRF aux headers. todo : a garder ou pas
		},
		body: JSON.stringify({ username, email, password1, password2 }), // Corps de la requete avec les informations d'inscription
		credentials: 'include' // Inclure les cookies pour l'authentification
	})
	.then(response => response.json()) // Convertir la reponse en JSON
	.then(data => {
		if (data.status === 'success') {
			alert('Registration successful!'); 
			changePage('#login');
		} else {
			alert('Registration failed: ' + JSON.stringify(data.message));
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred during registration. Please try again.');
	});
}
