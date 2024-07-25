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
	isKeyboardBind:false

};


function Play() {

	// verifier si le jeu est termine ou non charge
	if (playState.gameOver || !playState.isLoaded) {
		playState.isLoaded = false;
	}

	// charger la page si pas chargee
	if (!playState.isLoaded) {
		loadPlayState();
	}
	
	
	let content = '';

	// si le jeu est termine => afficher les scores finaux
	if (playState.gameOver) {
		clearInterval(playState.checkInterval)
		content = `
			<div class="container mt-5">
				<h1>game ended. bye !</h1>
				<div class="mt-4">
					<h2>final scores:</h2>
					<p>${playState.player1Email}: ${playState.player1Score}</p>
					<p>${playState.player2Email}: ${playState.player2Score}</p>
				</div>
				<button id="restartGameBtn" class="btn btn-primary mt-3">you want to restart a game ?</button>
			</div>
		`;
	} else if (!playState.gameStarted) {
		// si le jeu n'a pas commence => afficher le formulaire pour demarrer le jeu
		content = `
			<div class="container mt-5">
				<h1>pong game</h1>
				<form id="start-game-form">
					<div class="mb-3">
						<label for="player1Email" class="form-label">first player's email</label>
						<input type="email" class="form-control" id="player1Email" required>
					</div>
					<div class="mb-3">
						<label for="player2Email" class="form-label">second player's email</label>
						<input type="email" class="form-control" id="player2Email" required>
					</div>
					<button type="submit" class="btn btn-primary">start game</button>
				</form>
				<div id="instructions" class="card p-3 mb-4">
					<h2 class="card-title">instructions</h2>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">the objective of the game is to score points by hitting the ball into the opponent's court.</li>
						<li class="list-group-item">player 1 controls their paddle using the w (up) and s (down) keys.</li>
						<li class="list-group-item">player 2 controls their paddle using the up (↑) and down (↓) arrow keys.</li>
						<li class="list-group-item">the first player to reach a set number of points wins the game.</li>
						<li class="list-group-item">a player cannot play against themselves.</li>
						<li class="list-group-item">good luck and have fun!</li>
					</ul>
				</div>
			</div>
		`;
	} else {
		// sinon -> afficher le canvas pour le jeu
		content = `
		<div class="container mt-5">
			<h1 class="text-center">pong game</h1>
			<canvas id="pongCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
		</div>
		`;
	}

	return `${content}`;
}

// fonction pour charger la page du jeu
function loadPlayState() {
	// verifier si la page n'a pas ete chargee deja
	 if (!playState.checkInterval){
	 	playState.checkInterval = setInterval(checkAuth, 5 * 1000)
	}

	if (!playState.isLoaded) {

		bindEvent(playState, "#start-game-form", "submit", startGame);
		bindEvent(playState, "#restartGameBtn", "click", restartGame);	
	}

	if (!playState.isKeyboardBind){
		bindKeyboardEvents()
	}
	
	if (playState.gameStarted && !playState.gameOver) {
		setTimeout(initializeGame, 0); // donc place l'initialisation du jeu a la fin de la file d'attente des evenements
	}

	playState.isLoaded = true;
}


function startGame(event) {
	
	// empecher le comportement par defaut du formulaire (rechargement de la page)
	event.preventDefault();

	// recuperer les adresses email des joueurs depuis le formulaire
	playState.player1Email = document.getElementById("player1Email").value;
	playState.player2Email = document.getElementById("player2Email").value;

	if (playState.player1Email === playState.player2Email) {
		alert("A player cannot play against themselves. Please enter different emails.");
		return;
	}
	
	// initialiser l'etat du jeu
	playState.gameStarted = true; // indique que le jeu a commence
	playState.player1Score = 0; // reinitialise le score du joueur 1
	playState.player2Score = 0; // reinitialise le score du joueur 2
	playState.gameOver = false; // s'assure que l'etat de fin de jeu est false


	createGameInDatabase();

	changePage("#play");
	initializeGame();
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
