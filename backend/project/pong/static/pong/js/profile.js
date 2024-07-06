var profileState = {
	username:"",
	email:"",
	first_name:"",
	last_name:"",
	id:"",
	isLoaded:false
}

const updateTypes = {
	username: 'username',
	email: 'email'
};

function sendProfileToBackend(type, value) {
	if (!updateTypes[type]) {
		console.error('Type de mise à jour non valide');
		return;
	}

	let url = `/pong/api/profile/update`;
	let payload = { [type]: value };

	fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload)
	})
	.then(response => response.json())
	.then(data => console.log('Success:', data))
	.catch(error => console.error('Error:', error));
}

function EditUsername(){
	
	//ne peut pas utiliser addeventlistener. 
	bindEvent(profileState, "#edit-username", "submit", event => {
		event.preventDefault()
		//const usernameInput = document.querySelector("#edit-username").value
		const usernameInput = event.target.elements.username.value
		console.log(usernameInput)
		// alert("envoie " + usernameInput)
		profileState.username = usernameInput
		sendProfileToBackend('username', usernameInput)
		mountComponent(Profile)
	})

	return `
		<form id="edit-username" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="username" value="${profileState.username}" placeholder="Nouveau nom d'utilisateur" aria-label="Nouveau nom d'utilisateur">
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
		sendProfileToBackend('email', emailInput)
		mountComponent(Profile)
	})
	return `
		<form id="edit-email" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" name="email" value="${profileState.email}" placeholder="Nouvel email" aria-label="Nouvel email">
				<button class="btn btn-primary" type="submit">Modifier</button>
			</div>
		</form>
	`	
}
async function loadProfileFromBackend(){
	
	if (profileState.isLoaded){ //pour eviter des fetch infinis au backend
		return 
	}

	let url = `/pong/api/profile` //calling my django views here thanks to urls.py
	fetch(url, { //envoyer une requette http au backend (vue)
		"credentials": "include" //pour envoyer les cookies au backend car fetch ne le fait pas automatiquement (ex : pour authentification si login required)
	}).then(response => {
		return response.json()//transformer mon json en objet js (y'a le username a l'interieur)
	}).then(profile => { //promesse
		profileState.username = profile.username
		console.log(profile.username, profile.email)
		profileState.email = profile.email
		profileState.first_name = profile.first_name
		profileState.last_name = profile.last_name
		profileState.id = profile.id
		profileState.isLoaded = true
	
		mountComponent(Profile) //ce qui provoque la boucle infinie 

		//repasse dans Profile avec isLoaded a true
	
	})
}

function Profile() {

	loadProfileFromBackend() //get

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
							<div class="col-sm-9">${profileState.first_name}</div>
						</div>
						<div class="row mb-3">
							<div class="col-sm-3"><strong>Nom :</strong></div>
							<div class="col-sm-9">${profileState.last_name}</div>
						</div>
					<div class="row">
						<div class="col-sm-3"><strong>ID :</strong></div>
						<div class="col-sm-9">${profileState.id}</div>
					</div>
				</div>
			</div>
			
			<h2 class="mt-4 mb-3">Modifier le nom d'utilisateur</h2>
			${EditUsername()}
			<h2 class="mt-4 mb-3">Modifier l'email</h2>
			${EditEmail()}
			

		</div>
	`;
}