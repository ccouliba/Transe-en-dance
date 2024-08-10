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
			<div class="form-floating">
				<input type="text" class="form-control" name="username" id="username" autocomplete="username" placeholder="Username" required>
				<label for="username">Username</label>
			</div>
			<div class="form-floating">
				<input type="email" class="form-control" name="email" id="email" placeholder="Email" required>
				<label for="email">Email</label>
			</div>
			<div id="passwordHelpBlock" class="form-text">
				Your password must be at least 8 characters long, can contain letters and numbers, and must not contain spaces, special characters, or emoji.
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password1" id="password1" autocomplete="current-password" placeholder="Password" required>
				<label for="password1">Password</label>
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password2" id="password2" autocomplete="current-password" placeholder="Confirm Password" required>
				<label for="password2">Confirm password</label>
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

	httpPostJson(url, { username, email, password1, password2 })
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
