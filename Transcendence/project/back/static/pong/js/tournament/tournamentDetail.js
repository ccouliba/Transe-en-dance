
function Participants() {

	let tournament = tournamentState.tournament;
	if (!tournament){
		return ``
	}
		
	const participantsList = tournament.participants && tournament.participants.length > 0
		? tournament.participants.map(p => `<li>${p}</li>`).join('')
		: '<li>No participants yet</li>';

	const aliasesList = tournament.aliases && tournament.aliases.length > 0
		? tournament.aliases.map(a => `<li>${a.username}: ${a.alias}</li>`).join('')
		: '<li>No aliases yet</li>';

	return `
	<div class="tournament-details">
		<h3>${window.trans.participants}:</h3>
		<ul id="participantsList">
			${participantsList}
		</ul>
		<h3>${window.trans.aliases}:</h3>
		<ul id="aliasesList">
			${aliasesList}
		</ul>
	</div>
	`;
}


function createTournamentForm() {

	return `
		<form id="createTournamentForm">
			<div class="mb-3">
				<label for="tournamentName" class="form-label">${window.trans.tournamentName} :</label>
				<input type="text" class="form-control" id="tournamentName" required>
			</div>
			<button type="submit" class="btn btn-primary">${window.trans.createTournament}</button>
		</form>
	`;
}


function addParticipantForm() {
	if (tournamentState.tournament && tournamentState.tournament.is_started){

	     return '';
	}
	return `
		<div class="mt-4">
		<h2 class="mt-4">${window.trans.add} ${window.trans._participants}</h2>
			<form id="addParticipantForm">
				<div class="mb-3">
					<label for="participant" class="form-label">${window.trans.add} ${window.trans._participant} :</label>
					<input type="text" class="form-control" id="participant" required>
				</div>
				<button type="submit" class="btn btn-primary">${window.trans.add}</button>
			</form>
		</div>
	`;
}



function addAliasForm() {
	if (tournamentState.tournament && tournamentState.tournament.is_started){
		return '';
	} 
	
	return `
		<div class="mt-4">
		<h2 class="mt-4">${window.trans.add} ${window.trans._aliases}</h2>
			<form id="addAliasForm">
				<div class="mb-3">
					<label for="username" class="form-label">${window.trans.username} :</label>
					<input type="text" class="form-control" id="username" required>
				</div>
				<div class="mb-3">
					<label for="alias" class="form-label">${window.trans.alias} :</label>
					<input type="text" class="form-control" id="alias" required>
				</div>
				<button type="submit" class="btn btn-primary">${window.trans.add}</button>
			</form>
		</div>
	`;
}

