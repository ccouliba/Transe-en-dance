// Declare un objet 'profileState' pour stocker les informations du profil utilisateur
var profileState = {
	username:"",
	email:"",
	firstname:"",
	lastname:"",
	id:"",
	isLoaded:false  // indique si les donnees du profil ont ete chargees (initialement faux)
}

function checkAuth() {
	fetch('/pong/api/check_auth/', {
		method: 'GET',
		credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (!data.isAuthenticated) {
			changePage('#login');
		}
	});
}

function Profile() {

	// Charge les donnees du profil depuis le backend
	loadProfileFromBackend() //get

	// Retourne une chaine de caracteres contenant le HTML du composant Profile :
	// - inclut le menu de navigation
	// - affiche les informations du profil en utilisant les donnees de profileState
	// - sections pour modifier les informations du profil
	return `
		
		<div id="profilePage">
			<h1 class="mb-4">Profil</h1>
			<div class="card">
				<div class="card-body">
					<div class="row mb-3">
						<div class="col-sm-3"><strong>Username :</strong></div>
						<div class="col-sm-9">${profileState.username}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>Email :</strong></div>
						<div class="col-sm-9">${profileState.email}</div>
					</div>
						<div class="row mb-3">
							<div class="col-sm-3"><strong>First name :</strong></div>
							<div class="col-sm-9">${profileState.firstname}</div>
						</div>
						<div class="row mb-3">
							<div class="col-sm-3"><strong>Last name :</strong></div>
							<div class="col-sm-9">${profileState.lastname}</div>
						</div>
					<div class="row">
						<div class="col-sm-3"><strong>ID :</strong></div>
						<div class="col-sm-9">${profileState.id}</div>
					</div>
				</div>
			</div>
			
			<h2 class="mt-4 mb-3">Modify username</h2>
			${EditUsername()}
			<h2 class="mt-4 mb-3">Modify email</h2>
			${EditEmail()}
			<h2 class="mt-4 mb-3">Modify first name</h2>
			
			${EditFirstname()}
			<h2 class="mt-4 mb-3">Modify last name</h2>
			${EditLastname()}

			<h2 class="mt-4 mb-3">Modify password</h2>
			${EditPassword()}



		</div>
	`;
}


async function loadProfileFromBackend(){
	
	if (profileState.isLoaded == true){ //pour eviter des fetch infinis au backend
		return 
	}

	let url = `/pong/api/profile` //calling my django views here thanks to urls.py
	fetch(url, { //envoyer une requette http au backend (vue)
		"credentials": "include" //pour envoyer les cookies au backend car fetch ne le fait pas automatiquement (ex : pour authentification si login required)
	}).then(response => {
		return response.json()//transformer mon json en objet js (y'a le username a l'interieur)
	}).then(profile => { //promesse
		profileState = {...profileState, ...profile}// utilisation d'un spread operator. Cree un nouvel objet profileState en combinant deux objets existants
		mountComponent(Profile) //ce qui provoque la boucle infinie (cela se produirait si la fonction Profile() appelle a son tour loadProfileFromBackend())
		profileState.isLoaded = true // hyper important car : 
			// Lors du premier appel, isLoaded est false, donc la fonction continue.
			// Apres avoir charge les donnees, profileState.isLoaded est mis a true.
			// Lors des appels suivants, la condition if (profileState.isLoaded) est vraie, ce qui fait sortir immediatement de la fonction 
	
	})
}

// envoie des donnees de mise a jour du profil au backend
// function sendProfileToBackend(payload) { //payload = un objet contenant les donnees a mettre a jour dans le profil
// 	console.log("Authenticated:", !!localStorage.getItem('userToken'));
// 	let url = `/pong/api/profile/update`;
	
// 	fetch(url, {
// 		method: "POST",
// 		credentials: "include", 
// 		headers: { 
// 			'Content-Type': 'application/json', 
// 		},
// 		body: JSON.stringify(payload) // convertit l'objet payload en chaine JSON
// 	})
// 	.then(response => response.json())  
// 	.then(data => console.log('Success:', data))
// 	.catch(error => console.error('Error:', error));
// }

function sendProfileToBackend(payload) {
	console.log("Authenticated:", !!localStorage.getItem('userToken'));
	let url = `/pong/api/profile/update`;
	
	fetch(url, {
		method: "POST",
		credentials: "include",// envoie les cookies avec la requete = important pour l'authentification
		headers: { 
			'Content-Type': 'application/json',// specifie que le contenu envoye est au format JSON
			'Authorization': `Bearer ${localStorage.getItem('userToken')}`
		},
		body: JSON.stringify(payload)
	})
	.then(response => {
		if (!response.ok) {
			return response.text().then(text => {
				throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
			});
		}
		return response.json();
	})
	.then(data => console.log('Success:', data))
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while updating the profile. Please try again.');
	});
}

function EditUsername(){
	// ceci ne fonctionnerait pas :
	// document.querySelector("#edit-username").addEventListener("submit", event => { ... })
	
	// on utilise bindEvent a la place :
	bindEvent(profileState, "#edit-username", "submit", event => {
		event.preventDefault() //pour ne pas que l'evenement submit soit execute par defaut
		const usernameInput = event.target.elements.username.value
		
		profileState.username = usernameInput
		sendProfileToBackend({'username': usernameInput})
		profileState.isLoaded = false
		mountComponent(Profile)
	})

	return `
		<form id="edit-username" class="mt-3">
			<div class="input-group">
				<input 
					type="text" 
					class="form-control" 
					name="username" 
					value="${profileState.username}" 
				/>
				<button class="btn btn-primary" type="submit">Modify</button>
			</div>
		</form>
	`
}

function EditEmail()
{
	bindEvent(profileState, "#edit-email", "submit", event => {
		event.preventDefault()
		const emailInput = event.target.elements.email.value
		profileState.email = emailInput
		sendProfileToBackend({'email': emailInput})
		profileState.isLoaded = false
		mountComponent(Profile)
	})
	return `
		<form id="edit-email" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="email" value="${profileState.email}" aria-label="New email">
				<button class="btn btn-primary" type="submit">Modifier</button>
			</div>
		</form>
	`	
}

function EditFirstname()
{
	bindEvent(profileState, "#edit-first-name", "submit", event =>
	{
		event.preventDefault()
		const firstnameInput = event.target.elements.firstname.value
		profileState.firstname = firstnameInput
		sendProfileToBackend({'firstname':firstnameInput})
		profileState.isLoaded = false
		mountComponent(Profile)
	})
	return `
	<form id="edit-first-name" class="mt-3">
		<div class="input-group">
			<input 
				type="text" 
				class="form-control" 
				name="firstname" 
				value="${profileState.firstname}" 
				aria-label="New first name"
			/>
			<button class="btn btn-primary" type="submit">Modifier</button>
		</div>
	</form>
`	
}

function EditLastname()
{
	bindEvent(profileState, "#edit-last-name", "submit", event =>
	{
		event.preventDefault()
		const lastnameInput = event.target.elements.lastname.value
		profileState.lastname = lastnameInput
		sendProfileToBackend({'lastname': lastnameInput})
		profileState.isLoaded = false
		mountComponent(Profile)
	})
	return `
	<form id="edit-last-name" class="mt-3">
		<div class="input-group">
			<input 
				type="text" 
				class="form-control" 
				name="lastname" 
				value="${profileState.lastname}" 
				aria-label="New last name"
			/>
			<button class="btn btn-primary" type="submit">Modifier</button>
		</div>
	</form>
`	
}

function EditPassword() {
	// Attache un evenement submit au formulaire avec l'id => edit-password-form
	bindEvent(profileState, "#edit-password-form", "submit", event => {
		// Empeche le comportement par defaut du formulaire ie soumission et rechargement de la page
		event.preventDefault();
		// Recupere la valeur du champ 'old_password' du formulaire
		const oldPassword = event.target.elements.old_password.value;
		// Recupere la valeur du champ 'new_password1' du formulaire
		const newPassword1 = event.target.elements.new_password1.value;
		// Recupere la valeur du champ 'new_password2' du formulaire
		const newPassword2 = event.target.elements.new_password2.value;

		let url = `/pong/api/profile/change-password`;
						
		// Envoie une requete POST a l'API pour changer le mot de passe
		fetch(url, {
			method: 'POST',
			// Headers de la requete en incluant le type de contenu et le token CSRF
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			},
			// Corps de la requete converti en JSON
			body: JSON.stringify({
				old_password: oldPassword,
				new_password1: newPassword1,
				new_password2: newPassword2
			}),
			// Inclut les cookies avec la requete pour l'authentification
			credentials: 'include'
		})
		// Parse la reponse en JSON
		.then(response => response.json())
		// Traite les donnees recues de l'API
		.then(data => {
			// Si le changement de mot de passe est reussi
			if (data.status === 'success') {
				alert('Password changed successfully');
				// Marque les donnees de profil comme non chargees
				profileState.isLoaded = false;
				// Recharge le composant du profil
				mountComponent(Profile);
			} else {
				// Prepare un message d'erreur en cas d'echec
				let errorMessage = "There were errors changing your password:\n\n";
				// Si l'ancien mot de passe est incorrect
				if (data.errors.old_password) {
					errorMessage += "- Your old password was entered incorrectly. Please try again.\n";
				}
				// Si le nouveau mot de passe ne repond pas aux criteres de securite
				if (data.errors.new_password2) {
					errorMessage += "- Please choose a more secure password.\n";
					errorMessage += "\nFor a strong password:\n";
					errorMessage += "- Use a mix of uppercase and lowercase letters, numbers, and symbols\n";
					errorMessage += "- Avoid using personal information like birthdates or names\n";
					errorMessage += "- Make it at least 12 characters long\n";
				}
				// Affiche le message d'erreur
				alert(errorMessage);
			}
		})
		// Traite les erreurs de la requete
		.catch(error => {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		});
	});

	// Retourne le formulaire HTML pour changer le mot de passe
	return `
	<form id="edit-password-form" class="mt-3">
		<div class="input-group mt-3">
			<input 
				type="password" 
				class="form-control" 
				name="old_password" 
				placeholder="Old password" 
				required
			/>
		</div>
		<div class="input-group mt-3">
			<input 
				type="password" 
				class="form-control" 
				name="new_password1" 
				placeholder="New password" 
				required
			/>
		</div>
		<div class="input-group mt-3">
			<input 
				type="password" 
				class="form-control" 
				name="new_password2" 
				placeholder="Confirm new password" 
				required
			/>
		</div>
		<button class="btn btn-primary mt-3" type="submit">Change Password</button>
	</form>

	`;
}




