let playState = {
	player1Email: "",
	player2Email: "",
	player1Score: 0,
	player2Score: 0,
	gameStarted: false,
	gameId: null,
	isLoaded: false,
	gameOver: false
};

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 600;
const WINNING_SCORE = 5; //A CHANGER OU PAS

let paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

function Play() {
	if (playState.gameOver || !playState.isLoaded) {
		playState.isLoaded = false;
	}

	if (!playState.isLoaded) {
		loadPlayState();
	}

	let content = '';

	if (playState.gameOver) {
		content = `
			<div class="container">
				<h1>Game ended. Bye !</h1>
				<div>
					<h2>Final scores:</h2>
					<p>${playState.player1Email}: ${playState.player1Score}</p>
					<p>${playState.player2Email}: ${playState.player2Score}</p>
				</div>
				<button id="restartGameBtn" class="btn btn-primary mt-3">You want to restart a game ?</button>
			</div>
		`;
	} else if (!playState.gameStarted) {
		content = `
			<div class="container">
				<h1>Pong game</h1>
				<div id="instructions" class="card">
					<h2 class="card-title">Instructions</h2>
					<br/>
					<p>
						The objective of the game is to score points by hitting the ball into the opponent's court.<br/><hr>
						Player 1 controls their paddle using the W (up) and S (down) keys.<br/><hr>
						Player 2 controls their paddle using the Up (↑) and Down (↓) arrow keys.<br/><hr>
						The first player to reach a set number of points wins the game.<br/><hr>
						Good luck and have fun!<br/>
					</p>
				</div>
				<form id="start-game-form">
					<div>
						<label for="player1Email" class="form-label">First player's email</label>
						<input type="email" class="form-control" id="player1Email" required>
					</div>
					<div>
						<label for="player2Email" class="form-label">Second player's email</label>
						<input type="email" class="form-control" id="player2Email" required>
					</div>
					<button type="submit" class="btn btn-primary">Start game</button>
				</form>
			</div>
		`;
	} else {
		content = `
	<div class="container">
		<h1 class="text-center">Pong Game</h1>

		<canvas id="pongCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
	</div>
		`;
	}

	return `
		
		${content}
	`;
}

function loadPlayState() {
	// Verifie si l'etat du jeu n'a pas deja ete charge
	if (!playState.isLoaded) {
		// Attache l'evenement de soumission du formulaire pour demarrer le jeu
		bindEvent(playState, "#start-game-form", "submit", startGame);

		// Attache l'evenement de clic sur le bouton pour redemarrer le jeu
		bindEvent(playState, "#restartGameBtn", "click", restartGame);

		// Marque l'etat du jeu comme charge
		playState.isLoaded = true;
	}

	// Verifie si le jeu a commence mais n'est pas encore termine
	if (playState.gameStarted && !playState.gameOver) {
		// Initialise le jeu de maniere asynchrone
		setTimeout(initializeGame, 0); // donc place l'initialisation du jeu a la fin de la file d'attente des evenements
	}
}

function startGame(event) {
	// Empeche le comportement par defaut du formulaire (rechargement de la page)
	event.preventDefault();

	// Recupere les adresses email des joueurs depuis le formulaire
	playState.player1Email = document.getElementById("player1Email").value;
	playState.player2Email = document.getElementById("player2Email").value;

	// Initialise l'etat du jeu
	playState.gameStarted = true;  // Indique que le jeu a commence
	playState.player1Score = 0;    // Reinitialise le score du joueur 1
	playState.player2Score = 0;    // Reinitialise le score du joueur 2
	playState.gameOver = false;    // S'assure que l'etat de fin de jeu est false

	playState.isLoaded = false; 
	// Cree une nouvelle partie dans la base de donnees
	createGameInDatabase();

	// Change la page vers l'ecran de jeu
	changePage("#play");

	// Initialise le jeu (configuration du canvas, evenements, etc.)
	initializeGame();
}


function createGameInDatabase() {
	// Envoie une requete POST a l'API pour creer une nouvelle partie
	fetch('/pong/api/games/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json', // Indique que le corps de la requete est en JSON
		},
		
		// Convertit les donnees en JSON et les ajoute au corps de la requete
		body: JSON.stringify({
			player1Email: playState.player1Email,
			player2Email: playState.player2Email
		}),
		
		// inclut les cookies dans la requete pour l'authentification
		credentials: 'include'
	})
	.then(response => response.json()) // Parse la reponse JSON
	.then(data => {
		// Stocke l'ID de la partie retourne par le serveur
		playState.gameId = data.gameId;
	})
	.catch(error => console.error('Error:', error)); 
}

function restartGame() {
	playState.gameStarted = false;
	playState.gameOver = false;
	playState.player1Score = 0;
	playState.player2Score = 0;
	playState.isLoaded = false; // Réinitialiser isLoaded pour forcer le rechargement des event listeners 

	// Réinitialiser les positions des raquettes et de la balle
	paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
	paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
	ballX = CANVAS_WIDTH / 2;
	ballY = CANVAS_HEIGHT / 2;
	let ballSpeedX = 5;
	let ballSpeedY = 3;
	
	// Utiliser changePage pour revenir à l'écran de démarrage du jeu
	changePage("#play");
}

function initializeGame() //appelee apres que le DOM soit charge et que le canvas existe
{
	const canvas = document.getElementById('pongCanvas');
	const ctx = canvas.getContext('2d');

	function drawRect(x, y, width, height, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	}

	function drawCircle(x, y, radius, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, true);
		ctx.fill();
	}

	function drawGame() {
		drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black');
		drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
		drawRect(CANVAS_WIDTH - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
		drawCircle(ballX, ballY, BALL_SIZE, 'white');

		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText(playState.player1Score, 100, 50);
		ctx.fillText(playState.player2Score, CANVAS_WIDTH - 100, 50);
	}

	function moveBall() {
		// deplacer la balle
		ballX += ballSpeedX;
		ballY += ballSpeedY;
	
		// pour le rebond sur les bords superieur et inferieur (ne pas faire glisse la balle sur le paddle)
		if (ballY < 0 || ballY > CANVAS_HEIGHT) {
			ballSpeedY = -ballSpeedY;
		}
	
		// gerer la collision avec le paddle gauche ( pour le joueur 1)
		if (ballX < PADDLE_WIDTH && ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			if (ballSpeedX < 0) {  // Seulement si la balle se dirige vers la gauche
				ballSpeedX = -ballSpeedX;
			}
		}
	
		// gerer la collision avec le paddle droit (pour le joueur 2)
		if (ballX > CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			if (ballSpeedX > 0) {  // seulement si la balle se dirige vers la droite
				ballSpeedX = -ballSpeedX;
			}
		}
	
		// Vérification des points marques par les joueurs
		if (ballX < 0) {
			playState.player2Score++;
			resetBall();
		} else if (ballX > CANVAS_WIDTH) {
			playState.player1Score++;
			resetBall();
		}
	
		if (playState.player1Score >= WINNING_SCORE || playState.player2Score >= WINNING_SCORE) {
			endGame();
		}
	}
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
			requestAnimationFrame(update); // methode JS qui demande au navigateur d'executer une fonction specifique avant le prochain rafraichissement de l'ecran (generalement 60 fps)
		} else {
			changePage("#play"); //si jeu est termine => forcer le rechargement de la page
		}
	}

	function preventDefaultForScrollKeys(e) {
		// Verifie si le code de la touche pressee est 'ArrowUp' ou 'ArrowDown'
		if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
			// Si c'est le cas, empeche le comportement par defaut (defilement)
			e.preventDefault();
			// Retourne false pour indiquer que l'evenement a ete traite
			return false;
		}
	}
	

	document.addEventListener('keydown', function(event) {
		// Verifie si le jeu n'est pas termine
		if (!playState.gameOver) {
			switch(event.code) {
				case 'KeyW':
					// Deplace la raquette 1 vers le haut
					// paddle1Y = Math.max(paddle1Y - 20, 0);
					paddle1Y = Math.max(paddle1Y - 30, 0);
					break;
				case 'KeyS':
					// Deplace la raquette 1 vers le bas
					// paddle1Y = Math.min(paddle1Y + 20, CANVAS_HEIGHT - PADDLE_HEIGHT);
					paddle1Y = Math.min(paddle1Y + 30, CANVAS_HEIGHT - PADDLE_HEIGHT);
					break;
				case 'ArrowUp':
					// Deplace la raquette 2 vers le haut
					// paddle2Y = Math.max(paddle2Y - 20, 0);
					paddle2Y = Math.max(paddle2Y - 30, 0);
					preventDefaultForScrollKeys(event);
					break;
				case 'ArrowDown':
					// Deplace la raquette 2 vers le bas
					// paddle2Y = Math.min(paddle2Y + 20, CANVAS_HEIGHT - PADDLE_HEIGHT);
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

function endGame() {
	playState.gameOver = true;
	const winner = playState.player1Score > playState.player2Score ? playState.player1Email : playState.player2Email;
	
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
		playState.isLoaded = false; // Forcer le rechargement pour la prochaine partie
		changePage("#play");
	})
	.catch(error => console.error('Error:', error));
}
