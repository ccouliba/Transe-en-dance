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
				${friendsState.friends.map(friend => `
					<li class="list-group-item">${friend.username} (${friend.email})</li>
				`).join('')}
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

function refreshFriendsList() {
	friendsState.isLoaded = false;
	loadFriendsData();
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
			refreshFriendsList();
		} else {
			alert(data.message);
		}
	})
	.catch(error => console.error('Error:', error));
}


function AddFriendForm() {

	bindEvent(friendsState, "#add-friend-form", "submit", event => {
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
			refreshFriendsList();
		} else {
			alert(data.message);
		}
	})
	.catch(error => console.error('Error:', error));
}


// Fonction pour accepter une demande d'ami
function AcceptFriendForm(email) {

	bindEvent(friendsState, "#accept-friend-form", "submit", event => {
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
			refreshFriendsList();
		} else {
			alert(data.message);
		}
	})
	.catch(error => console.error('Error:', error));
}
function RemoveFriendForm() {
	bindEvent(friendsState, "#remove-friend-form", "submit", event => {
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



