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

function Play() {
	if (!playState.isLoaded) {
		loadPlayState();
	}

	let content = '';

	console.log("playState.isTournamentMatch", playState.isTournamentMatch)
	if (playState.gameOver) {
		clearInterval(playState.checkInterval);
		content = `
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
		`;
	} else if (!playState.gameStarted) {
		content = playState.isTournamentMatch
			? `
				<div class="container mt-5">
					<h1>${window.trans.tournamentInProgress}</h1>
				</div>
			`
			: `
				<div class="container mt-5">
					<h1>${window.trans.pongGame}</h1>
					<form id="start-game-form">
						<div class="mb-3">
							<label for="player1Username" class="form-label">${window.trans.firstPlayerUsername}</label>
							<p id="player1Username">${playState.player1Username || `${window.trans.loading}...`}</p>
						</div>
						<div class="mb-3">
							<label for="player2Username" class="form-label">${window.trans.secondPlayerUsername}</label>
							<input type="text" class="form-control" id="player2Username" required>
						</div>
						<button type="submit" class="btn btn-secondary">${window.trans.btnStartGame}</button>
					</form>
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
					</div>
				</div>
			`;
	} else {
		content = `
		<div class="container mt-5">
			<h1 class="text-center">${window.trans.pongGame}</h1>
			<canvas id="pongCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
		</div>
		`;
	}

	return `${content}`;
}


function loadPlayState() {
		
	playState.isLoaded = true
	bindEvent(playState, "#start-game-form", "submit", startGame);
	bindEvent(playState, "#restartGameBtn", "click", restartGame);
	bindEvent(playState, "#backToTournamentBtn", "click", backToTournament);
	bindEvent(playState, "#startTournamentMatchBtn", "click", startTournamentMatch);
	
	if (!playState.isKeyboardBind) {
		bindKeyboardEvents();
	}
	
	if (playState.gameStarted && !playState.gameOver) {
		setTimeout(initializeGame, 0);
	}

	if (playState.isTournamentMatch){
		return
	}
	
	//pas en mode tournoi
	getCurrentUser().then(user => {
		playState.player1Username = user.username;	
		mountComponent(Play)
	});	
}



function startGame(event) {
	console.log("startGame", event)
	if (event) 
		event.preventDefault();

	if (!playState.isTournamentMatch) {
		playState.player2Username = document.getElementById("player2Username").value;

		if (playState.player1Username === playState.player2Username) {
			alert(`${window.trans.cantPlayAgainstYourself}.`);
			return;
		}
	}
	
	playState.gameStarted = true;
	playState.player1Score = 0;
	playState.player2Score = 0;
	playState.gameOver = false;

	 if (!playState.isTournamentMatch) {
		createGameInDatabase()
		.then(({ status, body }) => {
			if (status === 201) {
				playState.gameId = body.gameId;
				playState.player1Username = body.player1Username;
				playState.player2Username = body.player2Username;
				mountComponent(Play);
				initializeGame();
			} else if (status === 404 && body.error === "One or both players not found") {
				alert(`${window.trans.oneOrTwoPlayersNotFound}`);
				playState.gameStarted = false; 
				
			} else {
				console.error(`${window.trans.error}: `, body.error);
			}
		})
	}
	else{
		initializeGame();
	}

}
	
function startTournamentMatch() {
	console.log("startTournamentMatch")
	startGame();
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
	
	// utiliser changePage pour revenir a l'ecran de demarrage du jeu
	changePage("#play");
}

function getCurrentUser() {
	return httpGetJson('/pong/api/games/get_current_user/')
	.catch(error => {
		console.error(`${window.trans.error}: `, error);
		return null;
	});
}
