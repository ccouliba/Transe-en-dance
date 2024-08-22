var playState = {
	player1Username: "", 
	player2Username: "", 
	player1Score: 0, 
	player2Score: 0, 
	gameStarted: false,
	gameId: null, 
	isLoaded: false, 
	gameOver: false, 
	checkInterval: null,
	isKeyboardBind:false,
	isTournamentMatch: false,
	tournamentId: null,
};

function GameInstructions(){
	return `
	<div id="instructions" class="card p-3 mb-4">
		<h2 class="card-title">${window.trans.instructions}</h2>
		<ul class="list-group list-group-flush">
			<li class="list-group-item">${window.trans.rule1}</li>
			<li class="list-group-item">${window.trans.rule2}</li>
			<li class="list-group-item">${window.trans.rule3}</li>
			<li class="list-group-item">${window.trans.rule4}</li>
			<li class="list-group-item">${window.trans.rule5}</li>
			<li class="list-group-item">${window.trans.goodLuck}</li>
		</ul>
	</div>`
}


function GameEnd(){
	return `
	<div class="container mt-5">
		<h1>${window.trans.gameEnded}!</h1>
		<div class="mt-4">
			<h2>${window.trans.finalScores}:</h2>
			<p>${playState.player1Username}: ${playState.player1Score}</p>
			<p>${playState.player2Username}: ${playState.player2Score}</p>
		</div>
		${playState.isTournamentMatch 
			? `<button id="backToTournamentBtn" class="btn btn-secondary mt-3">${window.trans.backToTournament}</button>`
			: `<button id="restartGameBtn" class="btn btn-secondary mt-3">${window.trans.playAnotherGame}</button>`
		}
	</div>
	`
}

function OneVersusOnePregame(){

	bindEvent(playState, "#start-game-form", "submit", startNonTournamentGame);

	return `
	<div class="container mt-5">
		<h1>${window.trans.pongGame}</h1>
		<form id="start-game-form">
			<div class="mb-3">
				<p id="player1Username">${window.trans.firstPlayerUsername} : ${playState.player1Username || `${window.trans.loading}...`}</p>
			</div>
			<div class="mb-3">
				<label for="player2Username" class="form-label">${window.trans.secondPlayerUsername}</label>
				<input type="text" class="form-control" id="player2Username" required>
			</div>
			<button type="submit" class="btn btn-secondary">${window.trans.btnStartGame}</button>
		</form>
		${GameInstructions()}
	</div>
	`
}



function startNonTournamentGame(event){
	
	event.preventDefault()
	playState.player2Username = document.getElementById("player2Username").value;

	if (playState.player1Username === playState.player2Username) {
		alert(`${window.trans.cantPlayAgainstYourself}.`);
		return;
	}

	createGameInDatabase()
		.then(( body ) => {


			if (body.error == "oneOrTwoPlayersNotFound"){
				throw new Error()
			}

			playState.gameId = body.gameId;
			playState.player1Username = body.player1Username;
			playState.player2Username = body.player2Username;
			playState.gameStarted = true
			playState.gameOver = false
			playState.tournamentId = null
			playState.player1Score = 0
			playState.player2Score = 0
			
			tournamentState.tournament = null
			mountComponent(Play);
			return
		
		})
		.catch(error => {
			alert(`${window.trans.oneOrTwoPlayersNotFound}`);
		})
}


function Play() {

	if (!playState.isLoaded) {
		loadPlayState();
		return `Loading`
	}

	if (!playState.gameStarted) {

		return OneVersusOnePregame();

	 }

	if (playState.gameOver) {
		clearInterval(playState.checkInterval);
		return GameEnd();	
	}
	
	return PongGame()

}


function loadPlayState() {
		
	playState.isLoaded = true
	bindEvent(playState, "#restartGameBtn", "click", restartGame);
	bindEvent(playState, "#backToTournamentBtn", "click", backToTournament);
	bindEvent(playState, "#startTournamentMatchBtn", "click", startTournamentMatch);
	
	if (!playState.isKeyboardBind) {
		bindKeyboardEvents();
	}
	

	
	
	//pas en mode tournoi
	getCurrentUser().then(user => {
		playState.player1Username = user.username;	
		mountComponent(Play)
	});	
}




function startTournamentMatch(matchId, player1Username, player2Username) {
	// Set up the play state for the tournament match
	playState.gameStarted = true;
	playState.gameOver = false;
	playState.isTournamentMatch = true;
	playState.isLoaded = true;

	playState.player1Username = player1Username;
	playState.player2Username = player2Username;
	
	// const player1Alias = tournamentState.tournament.aliases[player1Username] || '';
	// const player2Alias = tournamentState.tournament.aliases[player2Username] || '';
	// console.log(tournamentState.tournament.aliases[player1Username] )
	// playState.player1Username = player1Username + (player1Alias ? ` (${player1Alias})` : '');
	// playState.player2Username = player2Username + (player2Alias ? ` (${player2Alias})` : '');


	playState.player1Score = 0;
	playState.player2Score = 0;
	playState.gameId = matchId;
	mountComponent(Play);
	
}
	

// fonction pour redemarrer le jeu
function restartGame() {

	playState.gameStarted = false; // indique que le jeu n'a pas commence
	playState.gameOver = false; // indique que le jeu n'est pas termine
	playState.player1Score = 0; // reinitialise le score du joueur 1
	playState.player2Score = 0; // reinitialise le score du joueur 2
	
	// reinitialiser les positions des raquettes et de la balle
	paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
	paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
	ballX = CANVAS_WIDTH / 2;
	ballY = CANVAS_HEIGHT / 2;
	
	changePage("#play");
}

function getCurrentUser() {
	return httpGetJson('/pong/api/games/get_current_user/')
	.catch(error => {
		console.error(`${window.trans.error}: `, error);
		return null;
	});
}
