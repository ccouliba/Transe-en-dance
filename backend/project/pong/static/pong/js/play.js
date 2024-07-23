let playState = {
	player1Email: "", // email du joueur 1
	player2Email: "", // email du joueur 2
	player1Score: 0, // score du joueur 1
	player2Score: 0, // score du joueur 2
	gameStarted: false, // indique si le jeu a commence
	gameId: null, // identifiant de la partie
	isLoaded: false, // indique si la page est chargee
	gameOver: false // indique si le jeu est termine
};

// constantes pour les dimensions du jeu
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 600;
const WINNING_SCORE = 15; // a changer ou pas

// positions initiales des raquettes et de la balle
let paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// fonction pour afficher l'ecran de jeu
function Play() {

	// verifier si le jeu est termine ou non charge
	if (playState.gameOver || !playState.isLoaded) {
		playState.isLoaded = false;
	}

	// charger la page si pas chargee
	if (!playState.isLoaded) {
		loadPlayState();
	}
	
	setInterval(checkAuth, 5 * 1000)
	
	let content = '';

	// si le jeu est termine => afficher les scores finaux
	if (playState.gameOver) {
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
	if (!playState.isLoaded) {
		// attacher l'event de soumission du formulaire pour demarrer le jeu
		bindEvent(playState, "#start-game-form", "submit", startGame);

		// attacher l'event de clic sur le bouton pour redemarrer le jeu
		bindEvent(playState, "#restartGameBtn", "click", restartGame);

		// marquer la page comme charge
		playState.isLoaded = true;
	}

	// verifier si le jeu a commence mais n'est pas encore termine
	if (playState.gameStarted && !playState.gameOver) {
		// initialiser le jeu de maniere asynchrone
		setTimeout(initializeGame, 0); // donc place l'initialisation du jeu a la fin de la file d'attente des evenements
	}
}

// fonction pour demarrer le jeu
function startGame(event) {
	// empecher le comportement par defaut du formulaire (rechargement de la page)
	event.preventDefault();

	// recuperer les adresses email des joueurs depuis le formulaire
	playState.player1Email = document.getElementById("player1Email").value;
	playState.player2Email = document.getElementById("player2Email").value;

	// initialiser l'etat du jeu
	playState.gameStarted = true; // indique que le jeu a commence
	playState.player1Score = 0; // reinitialise le score du joueur 1
	playState.player2Score = 0; // reinitialise le score du joueur 2
	playState.gameOver = false; // s'assure que l'etat de fin de jeu est false

	playState.isLoaded = false;

	// creer une nouvelle partie dans la base de donnees
	createGameInDatabase();

	// change la page vers l'ecran de jeu
	changePage("#play");

	// initialise le jeu (configuration du canvas, evenements, etc)
	initializeGame();
}

// fonction pour creer une nouvelle partie dans la base de donnees
function createGameInDatabase() {
	// envoie une requete post a l'api pour creer une nouvelle partie
	fetch('/pong/api/games/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json', // indique que le corps de la requete est en json
		},
		// convertit les donnees en json et les ajoute au corps de la requete
		body: JSON.stringify({
			player1Email: playState.player1Email,
			player2Email: playState.player2Email
		}),
		// inclut les cookies dans la requete pour l'authentification
		credentials: 'include'
	})
	.then(response => response.json()) // parse la reponse json
	.then(data => {
		// stocke l'id de la partie retourne par le serveur
		playState.gameId = data.gameId;
	})
	.catch(error => console.error('error:', error));
}

// fonction pour redemarrer le jeu
function restartGame() {
	playState.gameStarted = false; // indique que le jeu n'a pas commence
	playState.gameOver = false; // indique que le jeu n'est pas termine
	playState.player1Score = 0; // reinitialise le score du joueur 1
	playState.player2Score = 0; // reinitialise le score du joueur 2
	playState.isLoaded = false; // reinitialise isLoaded pour forcer le rechargement des event listeners

	// reinitialiser les positions des raquettes et de la balle
	paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
	paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
	ballX = CANVAS_WIDTH / 2;
	ballY = CANVAS_HEIGHT / 2;
	ballSpeedX = 5;
	ballSpeedY = 3;

	// utiliser changePage pour revenir a l'ecran de demarrage du jeu
	changePage("#play");
}

// fonction pour initialiser le jeu
function initializeGame() {
	// selectionner le canvas et son contexte de dessin
	const canvas = document.getElementById('pongCanvas');
	const ctx = canvas.getContext('2d');

	// fonction pour dessiner un rectangle
	function drawRect(x, y, width, height, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	}

	// fonction pour dessiner un cercle
	function drawCircle(x, y, radius, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, true);
		ctx.fill();
	}

	// fonction pour dessiner le jeu
	function drawGame() {
		drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black'); // dessiner le fond
		drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // dessiner la raquette du joueur 1
		drawRect(CANVAS_WIDTH - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // dessiner la raquette du joueur 2
		drawCircle(ballX, ballY, BALL_SIZE, 'white'); // dessiner la balle

		// dessiner les scores
		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText(playState.player1Score, 100, 50);
		ctx.fillText(playState.player2Score, CANVAS_WIDTH - 100, 50);
	}

	// fonction pour deplacer la balle
	function moveBall() {
		// deplacer la balle
		ballX += ballSpeedX;
		ballY += ballSpeedY;

		// rebondir sur les bords superieur et inferieur
		if (ballY < 0 || ballY > CANVAS_HEIGHT) {
			ballSpeedY = -ballSpeedY;
		}

		// gerer la collision avec la raquette gauche
		if (ballX < PADDLE_WIDTH && ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			if (ballSpeedX < 0) { // seulement si la balle se dirige vers la gauche
				ballSpeedX = -ballSpeedX;
			}
		}

		// gerer la collision avec la raquette droite
		if (ballX > CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			if (ballSpeedX > 0) { // seulement si la balle se dirige vers la droite
				ballSpeedX = -ballSpeedX;
			}
		}

		// verifier les points marques par les joueurs
		if (ballX < 0) {
			playState.player2Score++;
			resetBall();
		} else if (ballX > CANVAS_WIDTH) {
			playState.player1Score++;
			resetBall();
		}

		// verifier si un joueur a gagne
		if (playState.player1Score >= WINNING_SCORE || playState.player2Score >= WINNING_SCORE) {
			endGame();
		}
	}

	// fonction pour reinitialiser la balle
	function resetBall() {
		ballX = CANVAS_WIDTH / 2;
		ballY = CANVAS_HEIGHT / 2;
		ballSpeedX = -ballSpeedX;
		ballSpeedY = Math.random() * 4 - 2;
	}

	// boucle de jeu
	function update() {
		if (!playState.gameOver) {
			moveBall();
			drawGame();
			requestAnimationFrame(update); // methode js qui demande au navigateur d'executer une fonction specifique avant le prochain rafraichissement de l'ecran (generalement 60 fps)
		} else {
			changePage("#play"); // si jeu est termine => forcer le rechargement de la page
		}
	}

	// fonction pour empecher le defilement de la page avec les touches de direction
	function preventDefaultForScrollKeys(e) {
		// verifier si le code de la touche pressee est 'arrowup' ou 'arrowdown'
		if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
			// si c'est le cas, empeche le comportement par defaut (defilement)
			e.preventDefault();
			// retourne false pour indiquer que l'evenement a ete traite
			return false;
		}
	}

	// ecouter les evenements de touche pour deplacer les raquettes
	document.addEventListener('keydown', function(event) {
		// verifier si le jeu n'est pas termine
		if (!playState.gameOver) {
			switch(event.code) {
				case 'KeyW':
					// deplace la raquette 1 vers le haut
					paddle1Y = Math.max(paddle1Y - 30, 0);
					break;
				case 'KeyS':
					// deplace la raquette 1 vers le bas
					paddle1Y = Math.min(paddle1Y + 30, CANVAS_HEIGHT - PADDLE_HEIGHT);
					break;
				case 'ArrowUp':
					// deplace la raquette 2 vers le haut
					paddle2Y = Math.max(paddle2Y - 30, 0);
					preventDefaultForScrollKeys(event);
					break;
				case 'ArrowDown':
					// deplace la raquette 2 vers le bas
					paddle2Y = Math.min(paddle2Y + 30, CANVAS_HEIGHT - PADDLE_HEIGHT);
					preventDefaultForScrollKeys(event);
					break;
			}
		}
	});

	// ajoute un ecouteur d'evenement global pour empecher le defilement de la page
	window.addEventListener('keydown', preventDefaultForScrollKeys, false);

	// demarre la boucle du jeu
	update();
}

// fonction pour terminer le jeu
function endGame() {
	playState.gameOver = true; // indique que le jeu est termine
	// determine le gagnant
	const winner = playState.player1Score > playState.player2Score ? playState.player1Email : playState.player2Email;

	// envoie une requete post a l'api pour mettre a jour la partie
	fetch(`/pong/api/games/${playState.gameId}/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			player1Score: playState.player1Score,
			player2Score: playState.player2Score,
			winner: winner
		}),
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		playState.isLoaded = false; // forcer le rechargement pour la prochaine partie
		changePage("#play");
	})
	.catch(error => console.error('error:', error));
}
