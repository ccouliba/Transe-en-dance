var friendsState = {
	friends: [], // Liste des amis
	sentRequests: [], // Demandes d'amis envoyees
	receivedRequests: [], // Demandes d'amis recues
	friendsStatus: [],
	friendStatusInterval: null,
	isLoaded: false, // indique si les donnees de cette page ont ete chargees (initialement faux)
};

function Friends() {
	if (!friendsState.isLoaded) {
		loadFriendsData();
		return `<div>${window.trans.loading}...</div>`;
	}

	return `
		<div class="container mt-5">
			<div id="friends-forms">
				${FriendsForms()}
			</div>
			<div id="friends-list">
				${FriendsList()}
			</div>
		</div>
	`;
}

function FriendsForms(){
	return `
	
		${AddFriendForm()}
		${AcceptFriendForm()}
		${RemoveFriendForm()}

	`
}
	
function FriendsList() {
	return `
		<h1 class="mb-4">${window.trans.friendsList}</h1>
		
		<button class="btn btn-primary mb-3" onclick="refreshFriendsList()">${window.trans.refreshList}</button>
		
		<h2>${window.trans.myFriends}</h2>
		<ul id="friends-status-list" class="list-group mb-4">
			${friendsState.friends.map(friend => `
				<li class="list-group-item d-flex justify-content-between align-items-center">
					${friend.username} (${friend.email}) - <span class="friend-status">${friend.isOnline ?  window.trans.online : window.trans.offline}</span>
				</li>
			`).join('')}
		</ul>
		
		<h2>${window.trans.friendRequestsSent}</h2>
		<ul class="list-group mb-4">
			${friendsState.sentRequests.map(request => `
				<li class="list-group-item">${request.username} (${request.email})</li>
			`).join('')}
		</ul>
		
		<h2>${window.trans.friendRequestsReceived}</h2>
		<ul class="list-group mb-4">
			${friendsState.receivedRequests.map(request => `
				<li class="list-group-item">
					${request.username} (${request.email})
				</li>
			`).join('')}
		</ul>
	`;
}


// Fonction pour charger les donnees des amis du backend
function loadFriendsData() {
	let url = `/pong/api/friends_data/`;
	httpGetJson(url)
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(data => {
			friendsState.friends = data.friends; // mise a jour de la liste des amis
			friendsState.sentRequests = data.sentRequests; // mise a jour des demandes envoyees
			friendsState.receivedRequests = data.receivedRequests; // mise a jour des demandes recues
			friendsState.isLoaded = true; // indiquer que les donnees sont chargees
			// mountComponent(FriendsList); // mise a jour de l'interface avec la liste des amis
			mountComponent(Friends); // mise a jour de l'interface avec la liste des amis
			// Démarrer l'intervalle pour la mise à jour du statut des amis
			// console.log("friendsState.friendStatusInterval", friendsState.friendStatusInterval)
			if (!friendsState.friendStatusInterval) {
				friendsState.friendStatusInterval = setInterval(getFriendsStatus, 5 * 1000);
			}
		})
		.catch(error => console.error(`${window.trans.error}:`, error));
}

// function getFriendsStatus(){
// 	// console.log("in getfriendstatus")
// 	let url = `/pong/api/friends/get-status/`;
	
// 	return httpGetJson(url)
// 		.then(response => response.json()) // Convertir la reponse en JSON
// 		.then(payload=>{
// 			payload.statuses.forEach((isOnline, i) => {
// 				friendsState.friends[i].isOnline = isOnline	
// 				// console.log(friendsState.friends[i].isOnline )

// 			});
// 			updateFriendsStatus();
// 			// mountComponent(FriendsList) 
			
// 		})
// 		.catch(error => console.error(`${window.trans.error}:`, error));
// }

function getFriendsStatus(){
	let url = `/pong/api/friends/get-status/`;
	
	return httpGetJson(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(payload => {
			if (payload.error) {
				console.error('Server error:', payload.error);
				return;
			}
			payload.statuses.forEach((isOnline, i) => {
				if (i < friendsState.friends.length) {
					friendsState.friends[i].isOnline = isOnline;
				}
			});
			updateFriendsStatus();
		})
		.catch(error => {
			console.error('Error fetching friends status:', error);
			// set all friends to offline when error
			friendsState.friends.forEach(friend => friend.isOnline = false);
			updateFriendsStatus();
		});
}


// function updateFriendsStatus() {
// 	const statusList = document.getElementById('friends-status-list');
// 	// console.log('window.trans:', window.trans);
// 	if (statusList) {
// 		const statusSpans = statusList.querySelectorAll('.friend-status');
// 		statusSpans.forEach((span, i) => {
// 			span.textContent = friendsState.friends[i].isOnline ? `${window.trans.online}` : `${window.trans.offline}`;
// 		});
// 	}
// }

function updateFriendsStatus() {
	const statusList = document.getElementById('friends-status-list');
	if (statusList) {
		const statusSpans = statusList.querySelectorAll('.friend-status');
		statusSpans.forEach((span, i) => {
			if (i < friendsState.friends.length) {
				span.textContent = friendsState.friends[i].isOnline ? `${window.trans.online}` : `${window.trans.offline}`;
			} else {
				span.textContent = `${window.trans.offline}`;
			}
		});
	}
}

// Fonction pour rafraichir la liste des amis
function refreshFriendsList() {
	friendsState.isLoaded = false; // indiquer que les donnees ne sont plus chargees
	loadFriendsData(); // recharger les donnees des amis
}

// Fonction pour envoyer une demande d'ami
function sendFriendRequest(email) {
	let url = `/pong/api/profile/send_friend_request/`;
	httpPostJson(url, { email })
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(data => {
			if (data.status === 'success') {
				alert(`${window.trans.friReqSentSuccess}`); // modale pour alerter l'utilisateur du succes
				refreshFriendsList(); // rafraichir la liste des amis !!! pas besoin de websockets ou autres
			} else {
				alert(data.message); // modale pour alerter l'utilisateur de l'echec
			}
		})
		.catch(error => console.error(`${window.trans.error}:`, error));
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
		<h2 class="mt-4 mb-3">${window.trans.addFriend}</h2>
		<form id="add-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" id="friendEmail" name="friendEmail" placeholder="${window.trans.friendEmailToAdd}"/>
				<button class="btn btn-primary" type="submit">${window.trans.add}</button>
			</div>
		</form>
	`;
}

// Fonction pour accepter une demande d'ami
function AcceptFriendRequest(email) {
	let url = `/pong/api/profile/accept_friend_request/`;
	httpPostJson(url, { email }) 
		.then(response => response.json()) // Convertir la reponse en JSON
		.then(data => {
			if (data.status === 'success') {
				alert(`${window.trans.friReqAccSuccess}`); //modale pour alerter l'utilisateur du succes
				refreshFriendsList(); // Rafraichir la liste des amis !
			} else {
				alert(data.message); // modale pour alerter l'utilisateur de l'echec
			}
		})
		.catch(error => console.error(`${window.trans.error}:`, error));
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
		<h2 class="mt-4 mb-3">${window.trans.acceptFriend}</h2>
		<form id="accept-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" id="friendEmail" name="friendEmail" placeholder="${window.trans.friendEmailToAccept}"/>
				<button class="btn btn-primary" type="submit">${window.trans.accept}</button>
			</div>
		</form>
	`;
}

// Fonction pour supprimer un ami
function removeFriend(email) {
	let url = `/pong/api/profile/remove_friend/`;
	httpPostJson(url, { email})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				alert(`${window.trans.friDelSuccess}`); // modale pour alerter l'utilisateur du succes
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
		<h2 class="mt-4 mb-3">${window.trans.deleteFriend}</h2>
		<form id="remove-friend-form" class="mt-3">
			<div class="input-group">
				<input type="text" class="form-control" id="friendEmail" name="friendEmail" placeholder="${window.trans.friendEmailToDelete}"/>
				<button class="btn btn-danger" type="submit">${window.trans.delete}</button>
			</div>
		</form>
	`;
}


