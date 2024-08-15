
var matchmakingState = {
	isLoaded:false,
	 matches: [],
	 rankings: [],
	 winner : null,
	 aliases : {},
	 tournamentId : null,
	 tournamentFinished : false
}

function TournamentMatchmaking() {
	
	if (!matchmakingState.isLoaded){
	
		fetchMatchesAndRankings();
	
		return `
		<div class="container mt-5">
			<h1>${window.trans.tournamentMatchmaking}</h1>
			<p>${window.trans.loadTournamentData}...</p>
		</div>
		`;
	}		
	return TournamentDetail()
}

function MatchList() {
  
	return `
		<h2>${window.trans.matches}</h2>
		<ul id="matchesList">
			${matchmakingState.matches.map(match => `
				<li class="match-item">
					<span class="match-players">
						${getDisplayName(match.player1.username, match.player1.alias)} vs ${getDisplayName(match.player2.username, match.player2.alias)}
					</span>
					<span class="match-score">
						${match.player1_score} - ${match.player2_score}
					</span>
					${match.status === 'pending' ?
						`<button onclick="startMatch(${match.id}, '${match.player1.username}', '${match.player2.username}')" class="btn btn-primary btn-sm">${window.trans.btnStartMatch}</button>` :
						`<span class="match-status">${match.status}</span>`
					}
				</li>
			`).join('')}
		</ul>
	`;
}

// function TournamentDetail() {
//     let winner
//     let winner_html = ''
//     if (Tournament.enddate)
//     {
// 	    winner = matchmakingState.rankings[0].username
//         winner_html = `<h2>Winner: ${winner}</h2>`
//     }
//     return `
//         <h1>Tournament matchmaking</h1>
//         ${MatchList()}

		
//         ${winner_html}
		
//         <h2>Rankings</h2>
//         <ul id="rankingsList">
//             ${matchmakingState.rankings.map(player => `
//                 <li>${getDisplayName(player.username, player.alias)}: ${player.wins} wins, Total score: ${player.total_score}</li>
//             `).join('')}
//         </ul>
		
// 		${matchmakingState.tournamentFinished && matchmakingState.rankings.length > 0 ?
//             `<h2>Winner: ${getDisplayName(matchmakingState.rankings[0].username, matchmakingState.aliases[matchmakingState.rankings[0].username])}</h2>` :
//             ''
//         }
//         ${!matchmakingState.tournamentFinished ?
//             `<button onclick="finishTournament()" class="btn btn-danger mt-4">Finish tournament</button>` :
//             `<button onclick="startNewTournament()" class="btn btn-primary mt-4">Start New Tournament</button>`
//         }
//     `;
// }
function TournamentDetail() {
	let winnerHtml = '';
	// console.log("coucou")
	// console.log(matchmakingState.tournamentFinished, matchmakingState.rankings.length)
	if (matchmakingState.tournamentFinished && matchmakingState.rankings.length > 0) {
		const winner = matchmakingState.rankings[0];
		winnerHtml = `
			<div class="winner-announcement">
				<h2>${window.trans.tournamentWinner}</h2>
				<p>${window.trans.winnerIs} : ${getDisplayName(winner.username, matchmakingState.aliases[winner.username])}</p>
				<p>${window.trans.wins}: ${winner.wins}, ${window.trans._totalScore}: ${winner.total_score}</p>
			</div>
		`;
	}

	return `
		<h1>${window.trans.tournamentMatchmaking}</h1>
		${MatchList()}
		${winnerHtml}
		<h2>${window.trans.rankings}</h2>
		<ul id="rankingsList">
			${matchmakingState.rankings.map(player => `
				<li>${getDisplayName(player.username, matchmakingState.aliases[player.username])}: ${player.wins} ${window.trans._wins}, ${window.trans._totalScore}: ${player.total_score}</li>
			`).join('')}
		</ul>
		${!matchmakingState.tournamentFinished ?
			`<button onclick="finishTournament()" class="btn btn-danger mt-4">${window.trans.finishTournament}</button>` :
			`<button onclick="startNewTournament()" class="btn btn-primary mt-4">${window.trans.startNewTournament}</button>`
		}
	`;
}

function getDisplayName(username, alias) {
	return alias ? `${username} (${alias})` : username;
}




function getMatchMakingFromBackend(){
	let url = `/pong/api/tournament/${tournamentState.tournament.id}/matchmaking/` 

	return httpGetJson(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`${window.trans.httpError} status: ${response.status}`);
			}
			return response.json();
		})
}


function fetchMatchesAndRankings() {
	return getMatchMakingFromBackend().then(data => {
		if (data.status === 'success') {
			// Mise à jour de matchmakingState
			matchmakingState.matches = data.matches;
			matchmakingState.rankings = data.rankings;
			matchmakingState.winner = data.winner;
			matchmakingState.aliases = data.aliases || {};
			matchmakingState.tournamentId = tournamentState.tournament.id;
			matchmakingState.tournamentFinished = data.tournament_finished;
			matchmakingState.isLoaded = true;  // Indique que les données sont chargées

			mountComponent(TournamentMatchmaking);
		} else {
			throw new Error('Error fetching tournament data: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred while fetching tournament data: ' + error.message);
		document.querySelector('.container').innerHTML = `
			<h1>${window.trans.tournamentMatchmaking}</h1>
			<p>Error loading tournament data: ${error.message}</p>
		`;
	});
}

