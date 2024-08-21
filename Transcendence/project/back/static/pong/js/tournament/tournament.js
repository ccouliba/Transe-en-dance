var tournamentState = {
	isLoaded: false,
	tournament: null,
	showAddParticipants: false,
};


function Tournament() {

	let tournament = tournamentState.tournament

	if (!tournamentState.isLoaded) {
		loadTournamentState();
		return `<div class="container mt-5"><p>${window.trans.loadTournamentData}...</p></div>`;
	}
	
	if (tournament && tournament.is_started && !tournament.end_date) {
		return TournamentMatchmaking();
	}

	// let tournamentStatus = getTournamentStatus(tournament)
	// <h1>Latest tournament name : ${tournament.name} - status : ${tournamentStatus}</h1>
	let lastTournament = ""
	// if (tournament){
	// 	lastTournament = `<h1>${window.trans.latestTournament} : ${tournament.name}</h1>`
	// }

	return `<div class="container mt-5">
			${lastTournament}	
			${Participants()}
			<h2 class="mt-4">${window.trans.createTournament}</h2>
			${createTournamentForm()}
			
			${addParticipantForm()}
			
			${addAliasForm()}
			${startTournamentButton()}
		</div>
	`;
}


function isTournamentFinished(matches) {
	return matches.every(match => match.status === "finished");
}

function startTournamentButton() {
	 if (tournamentState.tournament && tournamentState.tournament.is_started) {
	 	return '';
	 }
	return `
		<div class="mt-4">
			<button id="startTournamentBtn" class="btn btn-secondary">${window.trans._btnStartTournament}</button>
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
			console.error(`${window.trans.errorLoadiTournament}: `, error);
			tournamentState.isLoaded = true;
			tournamentState.error = error.message;
			mountComponent(Tournament); // Monter le composant Tournament même en cas d'erreur
		});
}

function createTournament(event) {
	event.preventDefault();
	const name = document.getElementById('tournamentName').value;
	// console.log(name)
	if (!name) {
		alert(`${window.trans.tournamentNameReq}.`);
		return;
	}
	let url = '/pong/api/tournament/create/'
	httpPostJson(url, {name: name})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			alert(`${window.trans.successCreateTournament}`);
			tournamentState.tournament = data.tournament
			changePage("#tournament")
		} else {
			alert(`${window.trans.errCreateTournament}: ` + data.message);
		}
	})
	.catch(error => {
		console.error(`${window.trans.error}:`, error);
		alert(`${window.trans.errCreatingTournament}.`);
	});
}

function addParticipant(event) {
	event.preventDefault();
	if (!tournamentState.tournament || !tournamentState.tournament.id) {
		alert(`${window.trans.mustCreateTournament}`);
		return;
	}
	const participant = document.getElementById('participant').value.trim();

	if (!participant) {
		alert(`${window.trans.enterUsername}.`);
		return;
	}

	const currentParticipantsCount = tournamentState.tournament.participants ? tournamentState.tournament.participants.length : 0;
	console.log("currentParticipantsCount",currentParticipantsCount)
	if (currentParticipantsCount >= 3) {
		alert(`${window.trans.participantLimitReached}`);
		return;
	}


	let url = `/pong/api/tournament/${tournamentState.tournament.id}/add_participants/` 
	let payload = { participants: [participant] }

	httpPostJson(url, payload)
	.then(response => {
		if (!response.ok) {
			throw new Error(`${window.trans.httpError} status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success' || data.status === 'warning') {
			if (data.added_participants.length > 0) {
				alert(`${window.trans.participant} ${participant} ${window.trans.addedSuccessfully}!`);
				document.getElementById('participant').value = '';  // Clear the input field
				updateParticipantsList(data.added_participants[0]);
			} else if (data.already_in_tournament.length > 0) {
				alert(`${participant} ${window.trans.alreadyInTournament}.`);
			} else if (data.not_found_participants.length > 0) {
				alert(`${window.trans.user} ${participant} ${window.trans.notFound}. ${window.trans.checkRegister}.`);
			}
		} else {
			alert(`${window.trans.errAddPart}: ` + data.message);
		}
	})
	.catch(error => {
		console.error(`${window.trans.error}:`, error);
		alert(`${window.trans.errorAddingParticipant}.`);
	});
}




function addAlias(event) {
	event.preventDefault();
	if (!tournamentState.tournament || !tournamentState.tournament.id) {
		alert(`${window.trans.mustCreateTournament}`);
		return;
	}
	const username = document.getElementById('username').value.trim();
	const alias = document.getElementById('alias').value.trim();

	if (!username || !alias) {
		alert(`${window.trans.bothUsernameAndAlias}`);
		return;
	}
	if (!tournamentState.tournament.participants.includes(username)) {
		alert(`${window.trans.notAParticipant}.`);
		return;
	}
	
	let url = `/pong/api/tournament/${tournamentState.tournament.id}/add_alias/`
	httpPostJson(url, { username: username, alias: alias })
	.then(response => {
		if (!response.ok) {
			throw new Error(`${window.trans.httpError} status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert(`${window.trans.alias} "${alias}" ${window.trans.addSuccessFor} "${username}"!`);
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
			alert(`${window.trans.errAddAlias}: ` + data.message);
		}
	})
	.catch(error => {
		console.error(`${window.trans.error}:`, error);
		alert(`${window.trans.errAddingAlias}:` + error.message);
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
		console.error(`${window.trans.participantsListElemNotFound}`);
	}

	// Update the tournamentState
	if (!tournamentState.tournament.participants.includes(newParticipant)) {
		tournamentState.tournament.participants.push(newParticipant);
	}
}

function startTournament() {

	if (!tournamentState.tournament) {
		alert(`${window.trans.noTournamentAvail}.`);
		return;
	}

	if (!tournamentState.tournament.participants || tournamentState.tournament.participants.length < 2) {
		alert(`${window.trans.needAtLeastTwoParticipants}.`);
		return;
	}

	let url = `/pong/api/tournament/${tournamentState.tournament.id}/start/` 
	httpPostJson(url, {})
	.then(response => {
		if (!response.ok) {
			throw new Error(`${window.trans.httpError} status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert(`${window.trans.startTournamentSuccess}`);
			tournamentState.tournament.is_started = true;
			mountComponent(TournamentMatchmaking);
		} else {
			alert(`${window.trans.errStartTournament}` + data.message);
		}
	})
	.catch(error => {
		console.error(`${window.trans.error}`, error);
		alert(`${window.trans.errStartingTournament}: ` + error.message);
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
		alert(`${window.trans.cantFinishTournament}`)
		return
	}

	if (!tournamentState.tournament || !tournamentState.tournament.is_started) {
		alert(`${window.trans.noActiveTournament}.`);
		return;
	}


	let url = `/pong/api/tournament/${tournamentState.tournament.id}/finish/` 
	httpPostJson(url, {})
	.then(response => {
		if (!response.ok) {
			throw new Error(`${window.trans.httpError} status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.status === 'success') {
			alert(`${window.trans.successFinishTournament}`);
			// tournamentState.tournament.is_started = false;
			// console.log("finishtournament noramelemnt")
			matchmakingState.tournamentFinished = true;
			playState.isTournamentMatch = false;
			// changePage("#tournament");
			if (data.rankings) {
				matchmakingState.rankings = data.rankings;
			}
			mountComponent(TournamentMatchmaking);

		} else {
			alert(`${window.trans.errFinishTournament}: ` + data.message);
		}
	})
	.catch(error => {
		console.error(`${window.trans.error}:`, error);
		alert(`${window.trans.errFinishingTournament}: ` + error.message);
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
	playState.isLoaded = false;
	mountComponent(Play);
}
