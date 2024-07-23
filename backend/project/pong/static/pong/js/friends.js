var friendsState = {
	friends: [], // Liste des amis
	sentRequests: [], // Demandes d'amis envoyees
	receivedRequests: [], // Demandes d'amis recues
	friendsStatus: [],
	isLoaded: false // indique si les donnees de cette page ont ete chargees (initialement faux)
};

// Fonction pour charger les donnees des amis du backend
function loadFriendsData() {
	let url = `/pong/api/friends_data/`;
	fetch(url, {
			credentials: "include" // inclure les cookies pour l'authentification
		})
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(data => {
			friendsState.friends = data.friends; // mise a jour de la liste des amis
			friendsState.sentRequests = data.sentRequests; // mise a jour des demandes envoyees
			friendsState.receivedRequests = data.receivedRequests; // mise a jour des demandes recues
			friendsState.isLoaded = true; // indiquer que les donnees sont chargees
			mountComponent(FriendsList); // mise a jour de l'interface avec la liste des amis
		})
		.catch(error => console.error('Error:', error));
}

function getFriendsStatus(){
	let url = `/pong/api/friends/get-status/`;
	return fetch(url, {
			credentials: "include" // inclure les cookies pour l'authentification
		})
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(payload=>{
			payload.statuses.forEach((isOnline, i) => {
				friendsState.friends[i].isOnline = isOnline	
			});

			mountComponent(FriendsList)
			
		})
		.catch(error => console.error('Error:', error));
}

// Fonction pour rafraichir la liste des amis
function refreshFriendsList() {
	friendsState.isLoaded = false; // indiquer que les donnees ne sont plus chargees
	loadFriendsData(); // recharger les donnees des amis
}

// Fonction pour envoyer une demande d'ami
function sendFriendRequest(email) {
	let url = `/pong/api/profile/send_friend_request/`;
	fetch(url, {
			method: "POST",
			credentials: "include", // Inclure les cookies pour l'authentification
			headers: {
				'Content-Type': 'application/json', // Type de contenu JSON
			},
			body: JSON.stringify({
				email: email
			}) // Corps de la requete avec l'email de l'ami
		})
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(data => {
			if (data.status === 'success') {
				alert("Demande d'ami envoyee avec succes!"); // modale pour alerter l'utilisateur du succes
				refreshFriendsList(); // rafraichir la liste des amis !!! pas besoin de websockets ou autres
			} else {
				alert(data.message); // modale pour alerter l'utilisateur de l'echec
			}
		})
		.catch(error => console.error('Error:', error));
}

// Fonction pour afficher le formulaire d'ajout d'ami
function AddFriendForm() {

	// Attacher l'evenement submit au formulaire d'ajout d'ami
	bindEvent(friendsState, "#add-friend-form", "submit", event => {
		event.preventDefault(); // Empecher le comportement par defaut du formulaire
		const friendEmail = event.target.elements.friendEmail.value; // Obtenir l'email de l'ami
		sendFriendRequest(friendEmail); // Envoyer la demande d'ami
		event.target.reset(); // Reinitialiser le formulaire apres l'envoi
	});

	// Retourner le HTML du formulaire d'ajout d'ami
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

// Fonction pour accepter une demande d'ami
function AcceptFriendRequest(email) {
	let url = `/pong/api/profile/accept_friend_request/`;
	fetch(url, {
			method: "POST",
			credentials: "include", // Inclure les cookies pour l'authentification
			headers: {
				'Content-Type': 'application/json', // Type de contenu JSON
			},
			body: JSON.stringify({
				email: email
			}) // Corps de la requete avec l'email de l'ami
		})
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(data => {
			if (data.status === 'success') {
				alert("Demande d'ami acceptee avec succes!"); //modale pour alerter l'utilisateur du succes
				refreshFriendsList(); // Rafraichir la liste des amis !
			} else {
				alert(data.message); // modale pour alerter l'utilisateur de l'echec
			}
		})
		.catch(error => console.error('Error:', error));
}

// Fonction pour afficher le formulaire d'acceptation d'ami
function AcceptFriendForm(email) {

	// Attacher l'evenement submit au formulaire d'acceptation d'ami
	bindEvent(friendsState, "#accept-friend-form", "submit", event => {
		event.preventDefault(); // Empecher le comportement par defaut du formulaire
		const friendEmail = event.target.elements.friendEmail.value; // Obtenir l'email de l'ami
		AcceptFriendRequest(friendEmail); // Accepter la demande d'ami
		event.target.reset(); // Reinitialiser le formulaire apres l'envoi
	});

	// Retourner le HTML du formulaire d'acceptation d'ami
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

// Fonction pour supprimer un ami
function removeFriend(email) {
	let url = `/pong/api/profile/remove_friend/`;
	fetch(url, {
			method: "POST",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				alert("Ami supprime avec succes!"); // modale pour alerter l'utilisateur du succes
				refreshFriendsList(); // Rafraichir la liste des amis
			} else {
				alert(data.message); // modale pour alerter l'utilisateur de l'echec
			}
		})
		.catch(error => console.error('Error:', error));
}

// Fonction pour afficher le formulaire de suppression d'ami
function RemoveFriendForm() {
	// Attacher l'evenement submit au formulaire de suppression d'ami
	bindEvent(friendsState, "#remove-friend-form", "submit", event => {
		event.preventDefault(); // Empecher le comportement par defaut du formulaire
		const friendEmail = event.target.elements.friendEmail.value; // Obtenir l'email de l'ami
		removeFriend(friendEmail); // Supprimer l'ami
		event.target.reset(); // Reinitialiser le formulaire apres l'envoi
	});

	// Retourner le HTML du formulaire de suppression d'ami
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

function FriendsList() {
	if (!friendsState.isLoaded) {
		setInterval(getFriendsStatus, 10 * 1000)
		
		loadFriendsData();
		return `<div>Loading...</div>`;
	}

	return `
		
		<div class="container mt-5">
			${AddFriendForm()}
			${AcceptFriendForm()}
			${RemoveFriendForm()}

			<h1 class="mb-4">Friends list</h1>
			
			<button class="btn btn-primary mb-3" onclick="refreshFriendsList()">Refresh list</button>
			
			<h2>My friends</h2>
			<ul class="list-group mb-4">
				${friendsState.friends.map(friend => {
					return `
						<li class="list-group-item d-flex justify-content-between align-items-center">
							${friend.username} (${friend.email}) - ${friend.isOnline ? "online":"offline"}
						</li>
					`;
				}).join('')}
			</ul>
			
			<h2>Friend requests sent</h2>
			<ul class="list-group mb-4">
				${friendsState.sentRequests.map(request => `
					<li class="list-group-item">${request.username} (${request.email})</li>
				`).join('')}
			</ul>
			
			<h2>Friend requests received</h2>
			<ul class="list-group mb-4">
				${friendsState.receivedRequests.map(request => `
					<li class="list-group-item">
						${request.username} (${request.email})
					</li>
				`).join('')}
			</ul>
		</div>
	`;
}


