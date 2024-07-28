
var matchmakingState = {
	isLoaded:false,
	 matches: [],
	 standings: [],
	 winner : null,
	 aliases : {},
	 tournamentId : null,
	 tournamentFinished : false
}

function TournamentMatchmaking() {
	
	if (!matchmakingState.isLoaded){
	
		fetchMatchesAndStandings();
	
		return `
		<div class="container mt-5">
			<h1>Tournament matchmaking</h1>
			<p>Loading tournament data...</p>
		</div>
		`;
	}		
	return TournamentDetail()
}

function MatchList() {
  
    return `
        <h2>Matches</h2>
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
                        `<button onclick="startMatch(${match.id}, '${match.player1.username}', '${match.player2.username}')" class="btn btn-primary btn-sm">Start match</button>` :
                        `<span class="match-status">${match.status}</span>`
                    }
                </li>
            `).join('')}
        </ul>
    `;
}

function TournamentDetail() {

	let winner = matchmakingState.standings[0].username
    return `
        <h1>Tournament matchmaking</h1>
        ${MatchList()}

        
        <h2>Winner: ${winner}</h2>
		
        <h2>Standings</h2>
        <ul id="standingsList">
            ${matchmakingState.standings.map(player => `
                <li>${getDisplayName(player.username, player.alias)}: ${player.wins} wins, Total score: ${player.total_score}</li>
            `).join('')}
        </ul>
        
		${matchmakingState.tournamentFinished && matchmakingState.standings.length > 0 ?
            `<h2>Winner: ${getDisplayName(matchmakingState.standings[0].username, matchmakingState.aliases[matchmakingState.standings[0].username])}</h2>` :
            ''
        }
        ${!matchmakingState.tournamentFinished ?
            `<button onclick="finishTournament()" class="btn btn-danger mt-4">Finish tournament</button>` :
            `<button onclick="startNewTournament()" class="btn btn-primary mt-4">Start New Tournament</button>`
        }
    `;
}


function getDisplayName(username, alias) {
	return alias ? `${username} (${alias})` : username;
}




function getMatchMakingFromBackend(){
	let url = `/pong/api/tournament/${tournamentState.tournament.id}/matchmaking/` 

	return fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
}


function fetchMatchesAndStandings() {
    return getMatchMakingFromBackend().then(data => {
        if (data.status === 'success') {
            // Mise à jour de matchmakingState
            matchmakingState.matches = data.matches;
            matchmakingState.standings = data.standings;
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
            <h1>Tournament matchmaking</h1>
            <p>Error loading tournament data: ${error.message}</p>
        `;
    });
}

