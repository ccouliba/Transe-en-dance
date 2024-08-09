var tournamentState = {
	isLoaded: false,
	tournament: null,
	showAddParticipants: false
};

function isTournamentFinished(matches) {
    return matches.every(match => match.status === "finished");
}

function Tournament() {

	let tournament = tournamentState.tournament
	if (!tournamentState.isLoaded) {
		loadTournamentState();
		return `<div class="container mt-5"><p>Loading tournament data...</p></div>`;
	}

	
	
	if (tournament && tournament.is_started && !tournament.end_date) {
		return TournamentMatchmaking();
	}

	// let tournamentStatus = getTournamentStatus(tournament)
	// <h1>Latest tournament name : ${tournament.name} - status : ${tournamentStatus}</h1>
	let lastTournament = ""
	if (tournament){
		lastTournament = `<h1>Latest tournament name : ${tournament.name}</h1>`
	}

	return `<div class="container mt-5">
			${lastTournament}	
			${Participants()}
			<h2 class="mt-4">Create a new tournament</h2>
			${createTournamentForm()}
			
			${addParticipantForm()}
			
			${addAliasForm()}
			${startTournamentButton()}
		</div>
	`;
}

function startTournamentButton() {
	 if (tournamentState.tournament && tournamentState.tournament.is_started) {
	 	return '';
	 }
	return `
		<div class="mt-4">
			<button id="startTournamentBtn" class="btn btn-primary">Start tournament</button>
		</div>
	`;
}

function loadTournamentState() {
	// Lier les événements aux formulaires et boutons
	bindEvent(tournamentState, "#createTournamentForm", "submit", createTournament);
	bindEvent(tournamentState, "#addParticipantForm", "submit", addParticipant);
	bindEvent(tournamentState, "#addAliasForm", "submit", addAlias);
	bindEvent(tournamentState, "#startTournamentBtn", "click", startTournament);

	// Récupérer les données du dernier tournoi
	httpGetJson('/pong/api/tournament/latest_tournament/')
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
			mountComponent(Tournament);			
		})
		.catch(error => {
			console.error('Error loading tournaments:', error);
			tournamentState.isLoaded = true;
			tournamentState.error = error.message;
			mountComponent(Tournament); // Monter le composant Tournament même en cas d'erreur
		});
}

function createTournament(event) {
	event.preventDefault();
	const name = document.getElementById('tournamentName').value;

	if (!name) {
		alert('The tournament name is required.');
		return;
	}
	let url = '/pong/api/tournament/create/'
	httpPostJson(url, {name})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert('Tournament created successfully!');
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
	let url = `/pong/api/tournament/${tournamentState.tournament.id}/add_participants/` 
	let payload = { participants: [participant] }

	httpPostJson(url, payload)
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
	
	let url = `/pong/api/tournament/${tournamentState.tournament.id}/add_alias/`
	httpPostJson(url, { username: username, alias: alias })
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

	let url = `/pong/api/tournament/${tournamentState.tournament.id}/start/` 
	httpPostJson(url, {})
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




function startNewTournament() {
	// Reset tournament state
	tournamentState.tournament = null;
	tournamentState.isLoaded = false;
	matchmakingState.isLoaded = false
	changePage("#tournament");
}



function finishTournament() {
	console.log(isTournamentFinished(matchmakingState.matches), matchmakingState.matches)
	if (!isTournamentFinished(matchmakingState.matches))
	{
		alert("Can not finish tournament if there are remaining matches")
		return
	}

	if (!tournamentState.tournament || !tournamentState.tournament.is_started) {
		alert('No active tournament to finish.');
		return;
	}


	let url = `/pong/api/tournament/${tournamentState.tournament.id}/finish/` 
	httpPostJson(url, {})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert('Tournament finished successfully!');
			// tournamentState.tournament.is_started = false;
			// tournamentState.tournament = null;
			// console.log("finishtournament noramelemnt")
			matchmakingState.tournamentFinished = true;
			// changePage("#tournament");
			if (data.rankings) {
				matchmakingState.rankings = data.rankings;
			}
			mountComponent(TournamentMatchmaking);
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

	playState.player1Username = player1Username;
	playState.player2Username = player2Username;
	playState.player1Score = 0;
	playState.player2Score = 0;
	playState.gameOver = false;
	playState.gameId = matchId;
	playState.isTournamentMatch = true;

	// Navigate to the play page
	changePage("#play");
}