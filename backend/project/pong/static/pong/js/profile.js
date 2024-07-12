
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
						<div class="col-sm-3"><strong>Nom d'utilisateur :</strong></div>
						<div class="col-sm-9">${profileState.username}</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-3"><strong>Email :</strong></div>
						<div class="col-sm-9">${profileState.email}</div>
					</div>
						<div class="row mb-3">
							<div class="col-sm-3"><strong>Prénom :</strong></div>
							<div class="col-sm-9">${profileState.firstname}</div>
						</div>
						<div class="row mb-3">
							<div class="col-sm-3"><strong>Nom :</strong></div>
							<div class="col-sm-9">${profileState.lastname}</div>
						</div>
					<div class="row">
						<div class="col-sm-3"><strong>ID :</strong></div>
						<div class="col-sm-9">${profileState.id}</div>
					</div>
					<div class="row">
						<div class="col-sm-3"><strong>Mes amis :</strong></div>
						<div class="col-sm-9">${profileState.friends}</div>
					</div>
				</div>
			</div>
			
			<h2 class="mt-4 mb-3">Modifier le nom d'utilisateur</h2>
			${EditUsername()}
			<h2 class="mt-4 mb-3">Modifier l'email</h2>
			${EditEmail()}
			<h2 class="mt-4 mb-3">Modifier le prénom</h2>
			
			${EditFirstname()}
			<h2 class="mt-4 mb-3">Modifier le nom</h2>
			<h2 class="mt-4 mb-3">Modifier le mot de passe</h2>

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
				<button class="btn btn-primary" type="submit">Modifier</button>
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
				<input type="text" class="form-control" name="email" value="${profileState.email}" aria-label="Nouvel email">
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
		sendProfileToBackend({firstname:firstnameInput})
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
				aria-label="Nouveau prénom"
			/>
			<button class="btn btn-primary" type="submit">Modifier</button>
		</div>
	</form>
`	
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
		<h2 class="mt-4 mb-3">Ajouter un ami</h2>
		<form id="add-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="friendEmail" placeholder="Email de l'ami" />
				<button class="btn btn-primary" type="submit">Ajouter</button>
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
		<h2 class="mt-4 mb-3">Accepter un ami</h2>
		<form id="accept-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="friendEmail" placeholder="Email de l'ami" />
				<button class="btn btn-primary" type="submit">Accepter</button>
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
		<h2 class="mt-4 mb-3">Supprimer un ami</h2>
		<form id="remove-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="friendEmail" placeholder="Email de l'ami à supprimer" />
				<button class="btn btn-danger" type="submit">Supprimer</button>
			</div>
		</form>
	`;
}

