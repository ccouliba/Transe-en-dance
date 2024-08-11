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
				<label for="username">${window.trans.username}</label>
			</div>
			<div class="form-floating">
				<input type="email" class="form-control" name="email" id="email" placeholder="Email" required>
				<label for="email">${window.trans.email}</label>
			</div>
			<div id="passwordHelpBlock" class="form-text">
				${window.trans.passwordSecurity}
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password1" id="password1" autocomplete="current-password" placeholder="Password" required>
				<label for="password1">${window.trans.password}</label>
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password2" id="password2" autocomplete="current-password" placeholder="Confirm Password" required>
				<label for="password2">${window.trans.confirmPassword}</label>
			</div>
			<button type="submit" class="btn btn-primary">${window.trans.register}</button>
		</form>

 		<button href="#" id="showLogin">${window.trans.backToLogin}</button>
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
			alert(`${window.trans.registerSuccess}`); 
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
