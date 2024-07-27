var tournamentState = {
	isLoaded: false,
	tournament: null,
	currentTournament: null,
	showAddParticipants: false
};

// function TournamentDetail() {

// 	const tournament = tournamentState.tournament;
// 	// const startDate = tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'Non définie';
// 	if (!tournament)
// 		return ``
// 	return `
// 	<div class="tournament-details">
// 		<h2>Your latest tournament</h2>
// 		<p><strong>Nom:</strong> ${tournament.name}</p>
// 	</div>
// 	`;
// }

function TournamentDetail() {
    const tournament = tournamentState.tournament;
    if (!tournament)
        return ``
    
    const participantsList = tournament.participants && tournament.participants.length > 0
        ? tournament.participants.map(p => `<li>${p}</li>`).join('')
        : '<li>No participants yet</li>';
    
    return `
    <div class="tournament-details">
        <h2>Your latest tournament</h2>
        <p><strong>Name:</strong> ${tournament.name}</p>
        <h3>Participants:</h3>
        <ul id="participantsList">
            ${participantsList}
        </ul>
    </div>
    `;
}


function Tournament() {
	if (!tournamentState.isLoaded) {
		loadTournamentState();
	}

	return `
		<div class="container mt-5">
			<h1>Tournaments</h1>
			${TournamentDetail()}
			<h2 class="mt-4">Create a new tournament</h2>
			${createTournamentForm()}
			<h2 class="mt-4">Add participant</h2>
			${addParticipantForm()}
		</div>
	`;
}
function createTournamentForm() {
	return `
		<form id="createTournamentForm">
			<div class="mb-3">
				<label for="tournamentName" class="form-label">Tournament name</label>
				<input type="text" class="form-control" id="tournamentName" required>
			</div>
			<button type="submit" class="btn btn-primary">Create tournament</button>
		</form>
	`;
}

function loadTournamentState() {
    bindEvent(tournamentState, "#createTournamentForm", "submit", createTournament);
    bindEvent(tournamentState, "#addParticipantForm", "submit", addParticipant);
    fetch('/pong/api/tournament/latest_tournament/')
        .then(response => response.json())
        .then(data => {
            tournamentState.tournament = data.tournament;
            if (tournamentState.tournament && !Array.isArray(tournamentState.tournament.participants)) {
                tournamentState.tournament.participants = [];
            }
            tournamentState.isLoaded = true;
            mountComponent(Tournament);
        })
        .catch(error => {
            console.error('Error loading tournaments:', error);
        });
}




function addParticipantForm() {
	if (!tournamentState.tournament) return '';
	
	return `
		<div class="mt-4">
			<form id="addParticipantForm">
				<div class="mb-3">
					<label for="participant" class="form-label">Add one participant (enter your username, you must be registered to this app in order to play)</label>
					<input type="text" class="form-control" id="participant" required>
				</div>
				<button type="submit" class="btn btn-primary">Add participant</button>
			</form>
		</div>
	`;
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
			tournamentState.tournament = data.tournament
			changePage("#tournament")
		} else {
			alert('Error creating tournament: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while creating the tournament.');
	});
}

function addParticipant(event) {
    event.preventDefault();
    const participant = document.getElementById('participant').value.trim();

    if (!participant) {
        alert('Please enter a username.');
        return;
    }

    fetch(`/pong/api/tournament/${tournamentState.tournament.id}/add_participants/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participants: [participant] }),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success' || data.status === 'warning') {
            if (data.added_participants.length > 0) {
                alert(`Participant ${participant} added successfully!`);
                document.getElementById('participant').value = '';  // Clear the input field
                updateParticipantsList(data.added_participants[0]);
            } else if (data.already_in_tournament.length > 0) {
                alert(`${participant} is already in the tournament.`);
            } else if (data.not_found_participants.length > 0) {
                alert(`User ${participant} not found. Please make sure the user is registered.`);
            }
        } else {
            alert('Error adding participant: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the participant: ' + error.message);
    });
}


function updateParticipantsList(newParticipant) {
	const participantsList = document.getElementById('participantsList');
	if (participantsList) {
		// Check if the participant is already in the list
		const existingParticipants = Array.from(participantsList.children).map(li => li.textContent);
		if (!existingParticipants.includes(newParticipant)) {
			const newItem = document.createElement('li');
			newItem.textContent = newParticipant;
			participantsList.appendChild(newItem);
		}
	}
}