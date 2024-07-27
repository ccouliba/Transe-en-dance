var tournamentState = {
	isLoaded: false,
	tournaments: [],
	currentTournament: null
};

function Tournament() {
	if (!tournamentState.isLoaded) {
		loadTournamentState();
	}

	return `
		<div class="container mt-5">
			<h1>Tournaments</h1>
			<h2 class="mt-4">Create a new tournament</h2>
			${createTournamentForm()}
		</div>
	`;
}

function createTournamentForm() {
	return `
		<form id="createTournamentForm">
			<div class="mb-3">
				<label for="tournamentName" class="form-label">Tournament Name</label>
				<input type="text" class="form-control" id="tournamentName" required>
			</div>

			<button type="submit" class="btn btn-primary">Create Tournament</button>
		</form>
	`;
}

function loadTournamentState() {
	bindEvent(tournamentState, "#createTournamentForm", "submit", createTournament);

	fetch('/pong/api/tournament/tournaments/')
		.then(response => response.json())
		.then(data => {
			tournamentState.tournaments = data;
			tournamentState.isLoaded = true;
			mountComponent(Tournament);
		})
		.catch(error => {
			console.error('Error loading tournaments:', error);
		});
}

function createTournament(event) {
	event.preventDefault();
	const name = document.getElementById('tournamentName').value;

	if (!name) {
		alert('The tournament name is required.');
		return;
	}

	fetch('/pong/api/tournament/create/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name }),
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert('Tournament created successfully!');
			console.log('Tournament details:', data.tournament);
		} else {
			alert('Error creating tournament: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while creating the tournament.');
	});
}
