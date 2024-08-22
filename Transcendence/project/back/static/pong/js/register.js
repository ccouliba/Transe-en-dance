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
		<div class="container text-center mt-5">
			<h1>${window.trans.register}</h1>
			<div class="row justify-content-center">
				${registerState.showForm ? RegisterForm() : showRegisterButton()}
				<div class="col-md">
					<button class="btn btn-link mt-2" id="showLogin">${window.trans.backToLogin}</button>
				</div>
			</div>
		</div>
		${GDPRModal()}
	`;
}



// Fonction pour gerer la soumission du formulaire d'inscription
function handleRegister(event) {
	event.preventDefault(); // Empecher le comportement par defaut du formulaire

	if (localStorage.getItem('gdprConsent') !== 'true') {
		alert(`${window.trans.mustAcceptPP}.`);
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
			alert(`${window.trans.registerSuccess}`); 
			changePage('#login');
		} else {
			alert(`${window.trans.errorRegistration}: ` + JSON.stringify(data.message));
		}
	})
	.catch(error => {


		console.error(`${window.trans.error}`, error);
		alert(`${window.trans.errorRegistrationRetry}.`);
	});
}

function showRegisterButton() {
	return `
		<div class="col-md mt-1">
			<button class="btn btn-secondary" id="showRegisterForm">${window.trans.createAccount}</button>
		</div>
	`;
}


function RegisterForm() {
	return `
		<form id="registerForm">
			<div class="form-floating mt-3">
				<input type="text" class="form-control" name="username" id="username" autocomplete="username" placeholder="${window.trans.username}" required>
				<label for="username" class="form-label">${window.trans.username}</label>
			</div>
			<div class="form-floating mt-3">
				<input type="email" class="form-control" name="email" id="email" placeholder="${window.trans.email}" required>
				<label for="email" class="form-label">${window.trans.email}</label>
			</div>
			<div id="passwordHelpBlock" class="form-text mt-5">
				${window.trans.passwordSecurity}
			</div>
			<div class="form-floating mt-3">
				<input type="password" class="form-control" name="password1" id="password1" autocomplete="current-password" placeholder="${window.trans.password}" required>
				<label for="password1" class="form-label">${window.trans.password}</label>
			</div>
			<div class="form-floating mt-3">
				<input type="password" class="form-control" name="password2" id="password2" autocomplete="current-password" placeholder="${window.trans.confirmPassword}" required>
				<label for="password2" class="form-label">${window.trans.confirmPassword}</label>
			</div>
			<button type="submit" class="btn btn-secondary mt-2">${window.trans.register}</button>
		</form>
	`;
}



function GDPRModal() {
	return `
		<div class="modal fade" id="gdprModal" tabindex="-1" aria-labelledby="gdprModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="gdprModalLabel">${window.trans.ppAndConsent}</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>${window.trans.dearUser},</p>
						<p>${window.trans.informYou}:</p>
						<ul>
							<li>${window.trans.yourData}.</li>
							<li>${window.trans.noProcess}.</li>
							<li>${window.trans.rightToObject}.</li>
						</ul>
						<p>${window.trans.exerciseRight}.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="gdprDecline">${window.trans.decline}</button>
						<button type="button" class="btn btn-secondary" id="gdprAccept">${window.trans.iAccept}</button>
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
		alert(`${window.trans.weCantProceed}.`);
		bootstrap.Modal.getInstance(document.getElementById('gdprModal')).hide();
	});
}
