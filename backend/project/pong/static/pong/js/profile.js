
// Declare un objet 'profileState' pour stocker les informations du profil utilisateur
var profileState = {
	username:"",
	email:"",
	firstname:"",
	lastname:"",
	id:"",
	friends: [],
	isLoaded:false  // indique si les donnees du profil ont ete chargees (initialement faux)
}


function Profile() {

	// Charge les donnees du profil depuis le backend
	loadProfileFromBackend() //get

	// Retourne une chaine de caracteres contenant le HTML du composant Profile :
	// - inclut le menu de navigation
	// - affiche les informations du profil en utilisant les donnees de profileState
	// - sections pour modifier les informations du profil
	return `
		${Menu()}
		<div class="container mt-5">
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
					<div class="row">
						<div class="col-sm-3"><strong>My friends :</strong></div>
						<div class="col-sm-9">${profileState.friends}</div>
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

			${AddFriendForm()}
			${AcceptFriendForm()}
			${RemoveFriendForm()}

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
function sendProfileToBackend(payload) { //payload = un objet contenant les donnees a mettre a jour dans le profil
	
	let url = `/pong/api/profile/update`;
	
	fetch(url, {
		method: "POST",
		credentials: "include", // envoie les cookies avec la requete = important pour l'authentification
		headers: { 
			'Content-Type': 'application/json', // specifie que le contenu envoye est au format JSON
		},
		body: JSON.stringify(payload) // convertit l'objet payload en chaine JSON
	})
	.then(response => response.json())  // parse la reponse du serveur en JSON
	.then(data => console.log('Success:', data))
	.catch(error => console.error('Error:', error));
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
	bindEvent(profileState, "#edit-password-form", "submit", event => {
		event.preventDefault();
		const oldPassword = event.target.elements.old_password.value;
		const newPassword1 = event.target.elements.new_password1.value;
		const newPassword2 = event.target.elements.new_password2.value;
		let url = `/pong/api/profile/change-password`;
						
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			},
			body: JSON.stringify({
				old_password: oldPassword,
				new_password1: newPassword1,
				new_password2: newPassword2
			}),
			credentials: 'include'
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				alert('Password changed successfully');
				profileState.isLoaded = false;
				mountComponent(Profile);
			} else {
				let errorMessage = "There were errors changing your password:\n\n";
				if (data.errors.old_password) {
					errorMessage += "- Your old password was entered incorrectly. Please try again.\n";
				}
				if (data.errors.new_password2) {
					errorMessage += "- Please choose a more secure password.\n";
					errorMessage += "\nFor a strong password:\n";
					errorMessage += "- Use a mix of uppercase and lowercase letters, numbers, and symbols\n";
					errorMessage += "- Avoid using personal information like birthdates or names\n";
					errorMessage += "- Make it at least 12 characters long\n";
				}
				alert(errorMessage);
			}
		})
		.catch(error => {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		});
	});

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





function sendFriendRequest(email) {

	let url = `/pong/api/profile/send_friend_request/`;
	fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email: email })
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert("Demande d'ami envoyée avec succès!");
			profileState.isLoaded = false;
			loadProfileFromBackend();
		} else {
			alert(data.message);
		}
	})
	.catch(error => console.error('Error:', error));
}

function AddFriendForm() {

	bindEvent(profileState, "#add-friend-form", "submit", event => {
		event.preventDefault();
		const friendEmail = event.target.elements.friendEmail.value;
		sendFriendRequest(friendEmail);
		event.target.reset(); // reinitialise le formulaire apres l'envoi
	});

	return `
		<h2 class="mt-4 mb-3">Add a friend</h2>
		<form id="add-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="friendEmail" placeholder="Friend's email" />
				<button class="btn btn-primary" type="submit">Add</button>
			</div>
		</form>
	`;
}

function AcceptFriendRequest(email) {

	let url = `/pong/api/profile/accept_friend_request/`;
	fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email: email })
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert("Demande d'ami acceptée avec succès!");
			profileState.isLoaded = false;
			loadProfileFromBackend();
		} else {
			alert(data.message);
		}
	})
	.catch(error => console.error('Error:', error));
}

// Fonction pour accepter une demande d'ami
function AcceptFriendForm(email) {

	bindEvent(profileState, "#accept-friend-form", "submit", event => {
		event.preventDefault();
		const friendEmail = event.target.elements.friendEmail.value;
		AcceptFriendRequest(friendEmail);
		event.target.reset(); // reinitialise le formulaire apres l'envoi
	});

	return `
		<h2 class="mt-4 mb-3">Accept a friend</h2>
		<form id="accept-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="friendEmail" placeholder="Friend's email" />
				<button class="btn btn-primary" type="submit">Accept</button>
			</div>
		</form>
	`;
}


function removeFriend(email) {
	let url = `/pong/api/profile/remove_friend/`;
	fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email: email })
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert("Ami supprimé avec succès!");
			profileState.isLoaded = false;
			loadProfileFromBackend();
		} else {
			alert(data.message);
		}
	})
	.catch(error => console.error('Error:', error));
}

function RemoveFriendForm() {
	bindEvent(profileState, "#remove-friend-form", "submit", event => {
		event.preventDefault();
		const friendEmail = event.target.elements.friendEmail.value;
		removeFriend(friendEmail);
		event.target.reset(); 
	});

	return `
		<h2 class="mt-4 mb-3">Delete a friend</h2>
		<form id="remove-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="friendEmail" placeholder="Friend's email to delete" />
				<button class="btn btn-danger" type="submit">Delete</button>
			</div>
		</form>
	`;
}

