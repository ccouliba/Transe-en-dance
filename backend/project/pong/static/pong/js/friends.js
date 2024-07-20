var friendsState = {
	friends: [],
	sentRequests: [],
	receivedRequests: [],
	isLoaded: false
};

function loadFriendsData() {
	let url = `/pong/api/friends_data/`;
	fetch(url, {
		credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		friendsState.friends = data.friends;
		friendsState.sentRequests = data.sentRequests;
		friendsState.receivedRequests = data.receivedRequests;
		friendsState.isLoaded = true;
		mountComponent(FriendsList);
	})
	.catch(error => console.error('Error:', error));
}

function FriendsList() {
	if (!friendsState.isLoaded) {
		loadFriendsData();
		return `<div>Chargement...</div>`;
	}

	return `
		${Menu()}
		<div class="container mt-5">
			<h1 class="mb-4">Liste des amis</h1>
			
			<button class="btn btn-primary mb-3" onclick="refreshFriendsList()">Rafraîchir</button>
			
			<h2>Mes amis</h2>
			<ul class="list-group mb-4">
				${friendsState.friends.map(friend => `
					<li class="list-group-item">${friend.username} (${friend.email})</li>
				`).join('')}
			</ul>
			
			<h2>Demandes d'amis envoyées</h2>
			<ul class="list-group mb-4">
				${friendsState.sentRequests.map(request => `
					<li class="list-group-item">${request.username} (${request.email})</li>
				`).join('')}
			</ul>
			
			<h2>Demandes d'amis reçues</h2>
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

function refreshFriendsList() {
	friendsState.isLoaded = false;
	loadFriendsData();
}

// function acceptFriendRequest(email) {
// 	AcceptFriendRequest(email);
// }

// function rejectFriendRequest(email) {

// }