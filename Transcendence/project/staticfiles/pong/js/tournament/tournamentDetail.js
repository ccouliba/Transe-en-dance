
function Participants() {

	let tournament = tournamentState.tournament;
	if (!tournament){
		return ``
	}
		
	
	const participantsList = tournament.participants && tournament.participants.length > 0
		? tournament.participants.map(p => `<li>${p.username} (${p.alias || "no alias"})</li>`).join('')
		: `<li>${window.trans.noParticipants}</li>`;

	return `
	<div class="tournament-details">
		<h3>${window.trans.participants}:</h3>
		<ul id="participantsList">
			${participantsList}
		</ul>
		
	</div>
	`;
}


function createTournamentForm() {

	// <label for="tournamentName" class="form-label">${window.trans.tournamentName} :</label>
	return `
		<form id="createTournamentForm">
			<div class="mb-3 input-group">
				<input type="text" class="form-control" id="tournamentName" placeholder="${window.trans.tournament}" required>
				<button type="submit" class="btn btn-secondary">${window.trans.createTournament}</button>
			</div>
		</form>
	`;
}


function addParticipantForm() {
	if (tournamentState.tournament && tournamentState.tournament.is_started){

	     return '';
	}
	// <label for="participant" class="form-label">${window.trans.add} ${window.trans._participant} :</label>
	return `
		<div class="mt-4">
		<h2 class="mt-4">${window.trans.add} ${window.trans._participants}</h2>
			<form id="addParticipantForm">
				<div class="mb-3 input-group">
					<input type="text" class="form-control" id="participant" placeholder="${window.trans.participant}" required>
					<button type="submit" class="btn btn-secondary">${window.trans.add}</button>
				</div>
			</form>
		</div>
	`;
}



function addAliasForm() {
	if (tournamentState.tournament && tournamentState.tournament.is_started){
		return '';
	} 
	
	// <label for="alias" class="form-label">${window.trans.alias} :</label>
	// <label for="username" class="form-label">${window.trans.username} :</label>
	return `
		<div class="mt-4">
		<h2 class="mt-4">${window.trans.add} ${window.trans._aliases}</h2>
			<form id="addAliasForm">
				<div class="mb-3">
					<input type="text" class="form-control" id="username" placeholder="${window.trans.username}" required>
				</div>
				<div class="mb-3 input-group">
					<input type="text" class="form-control" id="alias" placeholder="${window.trans.alias}" required>
					<button type="submit" class="btn btn-secondary">${window.trans.add}</button>
				</div>
			</form>
		</div>
	`;
}

