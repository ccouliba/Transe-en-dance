var logoutState = {
	isLoggedOut: false,
};

function logout() {
	if (logoutState.isLoggedOut) {
		console.log("Already logged out");
		return;
	}

	let url = `/pong/api/logout`;
	fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			console.log('Successfully logged out');
			logoutState.isLoggedOut = true;
			changePage("#login");
			
		} else {
			console.error('Logout failed:', data.message);
			alert('Logout failed: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error during logout:', error);
		alert('An error occurred during logout. Please try again.');
	});
}

function Logout() {
	return `
		<div>
			<h2>You have been logged out</h2>
			<p>Click <a href="#login" onclick="changePage('#login')">here</a> to log in again.</p>
		</div>
	`;
}