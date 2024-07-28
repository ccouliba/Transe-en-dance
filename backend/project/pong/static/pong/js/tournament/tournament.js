var tournamentState = {
	isLoaded: false,
	tournament: null,
	currentTournament: null,
	showAddParticipants: false
};

function TournamentDetail() {
	const tournament = tournamentState.tournament;
	if (!tournament)
		return ``
	
	const participantsList = tournament.participants && tournament.participants.length > 0
		? tournament.participants.map(p => `<li>${p}</li>`).join('')
		: '<li>No participants yet</li>';

	const aliasesList = tournament.aliases && tournament.aliases.length > 0
		? tournament.aliases.map(a => `<li>${a.username}: ${a.alias}</li>`).join('')
		: '<li>No aliases yet</li>';

	return `
	<div class="tournament-details">
		<h2>Your latest tournament</h2>
		<p><strong>Name:</strong> ${tournament.name}</p>
		<h3>Participants:</h3>
		<ul id="participantsList">
			${participantsList}
		</ul>
		<h3>Aliases:</h3>
		<ul id="aliasesList">
			${aliasesList}
		</ul>
	</div>
	`;
}



function Tournament() {
	if (!tournamentState.isLoaded) {
		loadTournamentState();
		return `<div class="container mt-5"><p>Loading tournament data...</p></div>`;
	}

	if (tournamentState.tournament && tournamentState.tournament.is_started) {
		return TournamentMatchmaking();
	}

	return `
		<div class="container mt-5">
			<h1>Tournaments</h1>
			${TournamentDetail()}
			<h2 class="mt-4">Create a new tournament</h2>
			${createTournamentForm()}
			<h2 class="mt-4">Add participant</h2>
			${addParticipantForm()}
			<h2 class="mt-4">Add alias</h2>
			${addAliasForm()}
			${startTournamentButton()}
		</div>
	`;
}
function startTournamentButton() {
	// if (!tournamentState.tournament || tournamentState.tournament.is_started) {
	// 	return '';
	// }
	return `
		<div class="mt-4">
			<button id="startTournamentBtn" class="btn btn-primary">Start tournament</button>
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
    // Lier les événements aux formulaires et boutons
    bindEvent(tournamentState, "#createTournamentForm", "submit", createTournament);
    bindEvent(tournamentState, "#addParticipantForm", "submit", addParticipant);
    bindEvent(tournamentState, "#addAliasForm", "submit", addAlias);
    bindEvent(tournamentState, "#startTournamentBtn", "click", startTournament);

    // Récupérer les données du dernier tournoi
    fetch('/pong/api/tournament/latest_tournament/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            tournamentState.tournament = data.tournament;
            if (tournamentState.tournament) {
                // S'assurer que is_started est bien un booléen
                tournamentState.tournament.is_started = Boolean(tournamentState.tournament.is_started);
                
                // Initialiser les listes si elles n'existent pas
                tournamentState.tournament.participants = tournamentState.tournament.participants || [];
                tournamentState.tournament.aliases = tournamentState.tournament.aliases || [];
            }
            tournamentState.isLoaded = true;
            
            // Monter le composant approprié en fonction de l'état du tournoi
            if (tournamentState.tournament && tournamentState.tournament.is_started) {
                mountComponent(TournamentMatchmaking);
            } else {
                mountComponent(Tournament);
            }

            // Mettre à jour la liste des alias
            updateAliasesList();
        })
        .catch(error => {
            console.error('Error loading tournaments:', error);
            tournamentState.isLoaded = true;
            tournamentState.error = error.message;
            mountComponent(Tournament); // Monter le composant Tournament même en cas d'erreur
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

function addAliasForm() {
	if (!tournamentState.tournament) return '';
	
	return `
		<div class="mt-4">
			<form id="addAliasForm">
				<div class="mb-3">
					<label for="username" class="form-label">Your username</label>
					<input type="text" class="form-control" id="username" required>
				</div>
				<div class="mb-3">
					<label for="alias" class="form-label">Add your alias</label>
					<input type="text" class="form-control" id="alias" required>
				</div>
				<button type="submit" class="btn btn-primary">Add alias</button>
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
		alert('An error occurred while adding the participant. Please try refreshing the page.');
	});
}


function addAlias(event) {
	event.preventDefault();
	const username = document.getElementById('username').value.trim();
	const alias = document.getElementById('alias').value.trim();

	if (!username || !alias) {
		alert('Please enter both username and alias.');
		return;
	}
	if (!tournamentState.tournament.participants.includes(username)) {
		alert('The entered username is not a participant in this tournament.');
		return;
	}
	fetch(`/pong/api/tournament/${tournamentState.tournament.id}/add_alias/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username: username, alias: alias }),
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert(`Alias "${alias}" added successfully for user "${username}"!`);
			document.getElementById('username').value = '';  // Clear the username input
			document.getElementById('alias').value = '';     // Clear the alias input
			
			// Update the local tournament state
			if (!Array.isArray(tournamentState.tournament.aliases)) {
				tournamentState.tournament.aliases = [];
			}
			tournamentState.tournament.aliases.push({ username: username, alias: alias });
			
			// Update the UI
			updateAliasesList();
		} else {
			alert('Error adding alias: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while adding alias: ' + error.message);
	});
}

function updateAliasesList() {
	const aliasesList = document.getElementById('aliasesList');
	if (aliasesList) {
		// Clear the current list
		aliasesList.innerHTML = '';
		
		// Repopulate the list with all aliases
		if (tournamentState.tournament.aliases && tournamentState.tournament.aliases.length > 0) {
			tournamentState.tournament.aliases.forEach(aliasObj => {
				const newItem = document.createElement('li');
				newItem.textContent = `${aliasObj.username}: ${aliasObj.alias}`;
				aliasesList.appendChild(newItem);
			});
		} else {
			// If there are no aliases, show the "No aliases yet" message
			const noAliasesItem = document.createElement('li');
			noAliasesItem.textContent = 'No aliases yet';
			aliasesList.appendChild(noAliasItem);
		}
	}
}

function updateAliasesList() {
	const aliasesList = document.getElementById('aliasesList');
	if (aliasesList) {
		// Clear the current list
		aliasesList.innerHTML = '';
		
		// Repopulate the list with all aliases
		if (tournamentState.tournament.aliases && tournamentState.tournament.aliases.length > 0) {
			tournamentState.tournament.aliases.forEach(aliasObj => {
				const newItem = document.createElement('li');
				newItem.textContent = aliasObj.username ? `${aliasObj.username}: ${aliasObj.alias}` : aliasObj.alias;
				aliasesList.appendChild(newItem);
			});
		} else {
			// If there are no aliases, show the "No aliases yet" message
			const noAliasesItem = document.createElement('li');
			noAliasesItem.textContent = 'No aliases yet';
			aliasesList.appendChild(noAliasesItem);
		}
	}
}

function updateParticipantsList(newParticipant) {
	const participantsList = document.getElementById('participantsList');
	if (participantsList) {
		// Check if 'No participants yet' is present and remove it
		const noParticipantsItem = participantsList.querySelector('li:only-child');
		if (noParticipantsItem && noParticipantsItem.textContent === 'No participants yet') {
			participantsList.removeChild(noParticipantsItem);
		}

		const existingParticipants = Array.from(participantsList.children).map(li => li.textContent);
		if (!existingParticipants.includes(newParticipant)) {
			const newItem = document.createElement('li');
			newItem.textContent = newParticipant;
			participantsList.appendChild(newItem);
		}
	} else {
		console.error('Participants list element not found');
	}

	// Update the tournamentState
	if (!tournamentState.tournament.participants.includes(newParticipant)) {
		tournamentState.tournament.participants.push(newParticipant);
	}
}

function startTournament() {
	if (!tournamentState.tournament) {
		alert('No tournament available to start.');
		return;
	}

	fetch(`/pong/api/tournament/${tournamentState.tournament.id}/start/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert('Tournament started successfully!');
			tournamentState.tournament.is_started = true;
			mountComponent(TournamentMatchmaking);
		} else {
			alert('Error starting tournament: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while starting the tournament: ' + error.message);
	});
}



function TournamentMatchmaking() {
    let matches = [];
    let standings = [];
    let winner = null;
    let aliases = {};
    let tournamentId = null;

    function fetchMatchesAndStandings() {
        fetch(`/pong/api/tournament/${tournamentState.tournament.id}/matchmaking/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    matches = data.matches;
                    standings = data.standings;
                    winner = data.winner;
                    aliases = data.aliases || {};
                    tournamentId = tournamentState.tournament.id;
                    renderTournamentMatchmaking();
                } else {
                    throw new Error('Error fetching tournament data: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while fetching tournament data: ' + error.message);
                document.querySelector('.container').innerHTML = `
                    <h1>Tournament matchmaking</h1>
                    <p>Error loading tournament data: ${error.message}</p>
                `;
            });
    }

    function getDisplayName(username, alias) {
        return alias ? `${username} (${alias})` : username;
    }

    function renderTournamentMatchmaking() {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <h1>Tournament matchmaking</h1>
            <h2>Matches</h2>
            <ul id="matchesList">
                ${matches.map(match => `
                    <li>
                        ${getDisplayName(match.player1.username, match.player1.alias)} vs ${getDisplayName(match.player2.username, match.player2.alias)}: 
                        ${match.player1_score} - ${match.player2_score}
                        ${match.status === 'pending' ? 
                            `<button onclick="startMatch(${match.id}, '${match.player1.username}', '${match.player2.username}')">Start match</button>` : 
                            ''
                        }
                    </li>
                `).join('')}
            </ul>
            <h2>Standings</h2>
            <ul id="standingsList">
                ${standings.map(player => `
                    <li>${getDisplayName(player.username, player.alias)}: ${player.wins} wins, Total score: ${player.total_score}</li>
                `).join('')}
            </ul>
            ${winner ? `<h2>Winner: ${getDisplayName(winner, aliases[winner])}</h2>` : ''}
            <button onclick="finishTournament()" class="btn btn-danger mt-4">Finish tournament</button>
        `;
    }

    fetchMatchesAndStandings();

    return `
        <div class="container mt-5">
            <h1>Tournament matchmaking</h1>
            <p>Loading tournament data...</p>
        </div>
    `;
}

function finishTournament() {
	if (!tournamentState.tournament || !tournamentState.tournament.is_started) {
		alert('No active tournament to finish.');
		return;
	}

	fetch(`/pong/api/tournament/${tournamentState.tournament.id}/finish/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert('Tournament finished successfully!');
			tournamentState.tournament.is_started = false;
			tournamentState.tournament = null;
			mountComponent(Tournament);
		} else {
			alert('Error finishing tournament: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while finishing the tournament: ' + error.message);
	});
}

function startMatch(matchId, player1Username, player2Username) {
    // Set up the play state for the tournament match
    playState.gameStarted = true;
    playState.player1Email = player1Username;
    playState.player2Email = player2Username;
    playState.player1Score = 0;
    playState.player2Score = 0;
    playState.gameOver = false;
    playState.gameId = matchId;
    playState.isTournamentMatch = true;

    // Navigate to the play page
    changePage("#play");
}