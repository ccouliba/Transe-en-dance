var matchHistoryState = {
	history: [],
	isLoaded: false
};

function MatchHistory() {
	matchHistoryState.isLoaded = false; //force rechargement de la page
	loadMatchHistory();

	let content = `
		<div class="container mt-5">
			<h2>Match history</h2>
			<div id="match-history-content">
				${renderMatchHistory()}
			</div>
		</div>
	`;

	return content;
}

function renderMatchHistory() {
	if (!matchHistoryState.isLoaded) {
		return '<p>Loading match history...</p>';
	}

	if (matchHistoryState.history.length === 0) {
		return '<p>No matches found.</p>';
	}

	return `
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Date</th>
					<th>Opponent</th>
					<th>Score</th>
					<th>Result</th>
				</tr>
			</thead>
			<tbody>
				${matchHistoryState.history.map(game => `
					<tr>
						<td>${game.date}</td>
						<td>${game.opponent}</td>
						<td>${game.user_score} - ${game.opponent_score}</td>
						<td>${game.result}</td>
					</tr>
				`).join('')}
			</tbody>
		</table>
	`;
}

function loadMatchHistory() {
	fetch('/pong/api/games/match_history/', {
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		matchHistoryState.history = data.match_history;
		matchHistoryState.isLoaded = true;
		updateMatchHistoryContent();
	})
	.catch(error => {
		console.error('Error:', error);
		matchHistoryState.isLoaded = true;
		updateMatchHistoryContent();
	});
}

function updateMatchHistoryContent() {
	const matchHistoryContent = document.getElementById('match-history-content');
	if (matchHistoryContent) {
		matchHistoryContent.innerHTML = renderMatchHistory();
	}
}