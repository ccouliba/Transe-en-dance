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
		bindEvent(registerState, "#showRegisterForm", "click", showGDPRModal);
		handleGDPRConsent();
		handleGDPRConsent();
		registerState.isLoaded = true
	}

	return `
		<div class="container mt-5">
			<h1>Register</h1>
			${registerState.showForm ? RegisterForm() : showRegisterButton()}
			<button class="btn btn-link" id="showLogin">Go back to login</button>
		</div>
		${GDPRModal()}
	`;
}



// Fonction pour gerer la soumission du formulaire d'inscription
function handleRegister(event) {
	event.preventDefault(); // Empecher le comportement par defaut du formulaire

	if (localStorage.getItem('gdprConsent') !== 'true') {
		alert("You must accept the privacy policy to register.");
		showGDPRModal();
		return;
	}

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

function showRegisterButton() {
	return `
		<button class="btn btn-primary" id="showRegisterForm">Create an account</button>
	`;
}


function RegisterForm() {
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
				Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password1" id="password1" autocomplete="new-password" placeholder="Password" required>
				<label for="password1">Password</label>
			</div>
			<div class="form-floating">
				<input type="password" class="form-control" name="password2" id="password2" autocomplete="new-password" placeholder="Confirm Password" required>
				<label for="password2">Confirm password</label>
			</div>
			<button type="submit" class="btn btn-primary">Register</button>
		</form>
	`;
}



function GDPRModal() {
	return `
		<div class="modal fade" id="gdprModal" tabindex="-1" aria-labelledby="gdprModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="gdprModalLabel">Privacy Policy and Consent</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Dear user,</p>
						<p>We want to inform you about the use of your personal data:</p>
						<ul>
							<li>Your data will be used solely for the operation of the application.</li>
							<li>No processing of your data will be carried out for specific purposes such as direct marketing.</li>
							<li>You have the right to object to the processing of your data and request its deletion.</li>
						</ul>
						<p>To exercise your rights or for any questions, please contact us via the dedicated form.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="gdprDecline">I decline</button>
						<button type="button" class="btn btn-primary" id="gdprAccept">I accept</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

function showGDPRModal() {
	const modal = new bootstrap.Modal(document.getElementById('gdprModal'));
	modal.show();
}

function handleGDPRConsent() {
	bindEvent(registerState, "#gdprAccept", "click", () => {
		localStorage.setItem('gdprConsent', 'true');
		bootstrap.Modal.getInstance(document.getElementById('gdprModal')).hide();
		registerState.showForm = true;
		// Re-rendre la page d'inscription
		document.querySelector('#app').innerHTML = Register();
	});

	bindEvent(registerState, "#gdprDecline", "click", () => {
		alert("We cannot proceed with your registration without your consent.");
		bootstrap.Modal.getInstance(document.getElementById('gdprModal')).hide();
	});
}
