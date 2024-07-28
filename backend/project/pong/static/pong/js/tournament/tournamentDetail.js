
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


function addParticipantForm() {
	if (tournamentState.tournament.is_started){

	     return '';
	}
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
	if (tournamentState.tournament.is_started){
		return '';
	} 
	
	return `
		<div class="mt-4">
		<h2 class="mt-4">Add alias</h2>
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

