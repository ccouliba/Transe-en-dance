var profileState = {
	username:"",
	email:"",
	first_name:"",
	last_name:"",
	id:"",
	isLoaded:false
}

function sendProfileToBackend(usernameInput)
{
	let payload = {username:usernameInput}
	let url = `/pong/api/profile/update`
	fetch(url, {
		"method" : "POST",
		"credentials":"include", 
		"body": JSON.stringify(payload) //convertir objet JS en texte (donc du JSON)

	})

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
		sendProfileToBackend(usernameInput)
		mountComponent(Profile)
	})

	return `
		<form id="edit-username">
			<label>username</label>    
			<input name="username" value="${profileState.username}"/>
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
		<h1>Profile</h1>
		<p>hello ${profileState.username}</p>
		<p>Your email is ${profileState.email}</p>
		<p>if you have a last name, it is ${profileState.last_name}</p>
		<p>if your have a first name, it is ${profileState.first_name}</p>
		<p>your id ${profileState.id}</p>

		${EditUsername()}
	`;
}