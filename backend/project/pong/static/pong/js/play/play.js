var playState = {
	player1Email: "", // email du joueur 1
	player2Email: "", // email du joueur 2
	player1Score: 0, // score du joueur 1
	player2Score: 0, // score du joueur 2
	gameStarted: false, // indique si le jeu a commence
	gameId: null, // identifiant de la partie
	isLoaded: false, // indique si la page est chargee
	gameOver: false, // indique si le jeu est termine,
	checkInterval: null,
	isKeyboardBind:false,
	isTournamentMatch: false,
	tournamentId: null,
};

function Play() {
	if (playState.gameOver || !playState.isLoaded) {
		playState.isLoaded = false;
	}

	if (!playState.isLoaded) {
		loadPlayState();
	}
	
	let content = '';

	if (playState.gameOver) {
		clearInterval(playState.checkInterval);
		content = `
			<div class="container mt-5">
				<h1>Game ended!</h1>
				<div class="mt-4">
					<h2>Final scores:</h2>
					<p>${playState.player1Email}: ${playState.player1Score}</p>
					<p>${playState.player2Email}: ${playState.player2Score}</p>
				</div>
				${playState.isTournamentMatch 
					? `<button id="backToTournamentBtn" class="btn btn-primary mt-3">Back to Tournament</button>`
					: `<button id="restartGameBtn" class="btn btn-primary mt-3">Play another game</button>`
				}
			</div>
		`;
	} else if (!playState.gameStarted) {
		content = playState.isTournamentMatch
			? `
				<div class="container mt-5">
					<h1>Tournament Match</h1>
					<p>Waiting for game to start...</p>
					<p>${playState.player1Email} vs ${playState.player2Email}</p>
					<button id="startTournamentMatchBtn" class="btn btn-primary mt-3">Start Match</button>
				</div>
			`
			: `
				<div class="container mt-5">
					<h1>${window.trans.pongGame}
					</h1>
					<form id="start-game-form">
						<div class="mb-3">
							<label for="player1Email" class="form-label">${window.trans.firstPlayerEmail}</label>
							<input type="email" class="form-control" id="player1Email" required>
						</div>
						<div class="mb-3">
							<label for="player2Email" class="form-label">${window.trans.secondPlayerEmail}</label>
							<input type="email" class="form-control" id="player2Email" required>
						</div>
						<button type="submit" class="btn btn-primary">${window.trans.btnStartGame}</button>
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
			<h1 class="text-center">Pong Game</h1>
			<canvas id="pongCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
		</div>
		`;
	}

	return `${content}`;
}


function loadPlayState() {


	if (!playState.isLoaded) {
		bindEvent(playState, "#start-game-form", "submit", startGame);
		bindEvent(playState, "#restartGameBtn", "click", restartGame);
		bindEvent(playState, "#backToTournamentBtn", "click", backToTournament);
		bindEvent(playState, "#startTournamentMatchBtn", "click", startTournamentMatch);
	}

	if (!playState.isKeyboardBind) {
		bindKeyboardEvents();
	}
	
	if (playState.gameStarted && !playState.gameOver) {
		setTimeout(initializeGame, 0);
	}

	playState.isLoaded = true;
}



function startGame(event) {
	if (event) event.preventDefault();

	if (!playState.isTournamentMatch) {
		playState.player1Email = document.getElementById("player1Email").value;
		playState.player2Email = document.getElementById("player2Email").value;

		if (playState.player1Email === playState.player2Email) {
			alert("A player cannot play against themselves. Please enter different emails.");
			return;
		}
	}
	
	playState.gameStarted = true;
	playState.player1Score = 0;
	playState.player2Score = 0;
	playState.gameOver = false;

	if (!playState.isTournamentMatch) {
		createGameInDatabase();
	}

	changePage("#play");
	initializeGame();
}

function startTournamentMatch() {
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
