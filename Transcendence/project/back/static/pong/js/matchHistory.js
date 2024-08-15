var matchHistoryState = {
	history: [],
	isLoaded: false
};

function MatchHistory() {
	matchHistoryState.isLoaded = false;
	loadMatchHistory();
	let content = `
		<div class="container mt-5">
			<h2>${window.trans.matchHistory}</h2>
			<div id="match-history-content">
				${renderMatchHistory()}
			</div>
		</div>
	`;
	return content;
}
function renderMatchHistory() {
	if (!matchHistoryState.isLoaded) {
		// Removing <p></p> for text to display properky
		return `${window.trans.loading} ${window.trans._matchHistory}...`;
	}
	if (matchHistoryState.error) {
		return `<p>Error: ${matchHistoryState.error}</p>`;
	}
	if (matchHistoryState.history.length === 0) {
		// Removing <p></p> for text to display properky
		return `${window.trans.noMatchesFound}.`;
	}
	return `
		<table class="table table-dark table-striped table-hover">
			<thead>
				<tr>
					<th>${window.trans.date}</th>
					<th>${window.trans.opponent}</th>
					<th>${window.trans.score}</th>
					<th>${window.trans.result}</th>
				</tr>
			</thead>
			<tbody>
				${matchHistoryState.history.map(game => `
					<tr>
						<td>${game.date}</td>
						<td>${game.opponent}</td>
						<td>${game.user_score} - ${game.opponent_score}</td>
						<td>${game.result}</td>
						<td>${game.is_tournament ? `${window.trans.tournament}` : '1v1'}</td>
					</tr>
				`).join('')}
			</tbody>
		</table>
	`;
}
function loadMatchHistory() {
	let url = `/pong/api/games/match_history/`
	httpGetJson(url)
	.then(response => {
		if (!response.ok) {
			throw new Error(`${window.trans.httpError} status: ${response.status}`);
		}
		return response.text(); // Get the raw text instead of parsing JSON immediately
	})
	.then(text => {
		// console.log('Raw response:', text); // Log the raw response
		try {
			const data = JSON.parse(text); // Try to parse the JSON
			// matchHistoryState.history = data.match_history;
			matchHistoryState.history = data.match_history.map(game => ({
				...game,
				result: game.is_winner ? window.trans.wins : window.trans.losses 
			}));
			matchHistoryState.isLoaded = true;
		} catch (e) {
			console.error('JSON parsing error:', e);
			matchHistoryState.isLoaded = true;
			matchHistoryState.error = `${window.trans.errorParsingServerResp}`;
		}
		updateMatchHistoryContent();
	})
	.catch(error => {
		console.error('Fetch error:', error);
		matchHistoryState.isLoaded = true;
		matchHistoryState.error = `${window.trans.errorFetchingMatchHist}`;
		updateMatchHistoryContent();
	});
}

function updateMatchHistoryContent() {
	const matchHistoryContent = document.getElementById('match-history-content');
	if (matchHistoryContent) {
		matchHistoryContent.innerHTML = renderMatchHistory();
	}
}
