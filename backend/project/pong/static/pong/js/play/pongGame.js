// constantes pour les dimensions du jeu
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 600;
const WINNING_SCORE = 5; // a changer ou pas


// positions initiales des raquettes et de la balle
let paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;


function resetBall() {
	ballX = CANVAS_WIDTH / 2;
	ballY = CANVAS_HEIGHT / 2;
	ballSpeedX = -ballSpeedX;
	ballSpeedY = Math.random() * 4 - 2;
}

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

// fonction pour initialiser le jeu
function initializeGame() {
	// selectionner le canvas et son contexte de dessin
	const canvas = document.getElementById('pongCanvas');
	if (canvas == null)
		return
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


	function update() {

		if (!playState.isLoaded){
			return
		}

		if (!playState.gameOver) {
			moveBall();
			drawGame();
			requestAnimationFrame(update); // methode js qui demande au navigateur d'executer une fonction specifique avant le prochain rafraichissement de l'ecran (generalement 60 fps)
		} else {
			changePage("#play"); // si jeu est termine => forcer le rechargement de la page
		}
	}

		// ajoute un ecouteur d'evenement global pour empecher le defilement de la page
	window.addEventListener('keydown', preventDefaultForScrollKeys, false);

	// demarre la boucle du jeu
	update();
	
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


function bindKeyboardEvents(){
		// ecouter les evenements de touche pour deplacer les raquettes
	document.addEventListener('keydown', function(event) {
		
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

	playState.isKeyboardBind = true
}



// fonction pour terminer le jeu
function endGame() {
	playState.gameOver = true; // indique que le jeu est termine
	// determine le gagnant
	const winner = playState.player1Score > playState.player2Score ? playState.player1Email : playState.player2Email;
	finishGame(playState.gameId, winner); //pour les stats
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



function finishGame(gameId, winnerEmail) {
	fetch(`/pong/api/games/finish_game/${gameId}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ winner: winnerEmail }),
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
		console.log('Game finished:', data);
	})
	.catch(error => console.error('Error finishing game:', error));
}




// fonction pour creer une nouvelle partie dans la base de donnees
function createGameInDatabase() {
	// envoie une requete post a l'api pour creer une nouvelle partie
	fetch('/pong/api/games/create_game/', {
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
	.then(response => {
		return response.json().then(data => {
			return { status: response.status, body: data };
		});
	}) // parse la reponse json
	// .then(data => {
	// 	// stocke l'id de la partie retourne par le serveur
	// 	playState.gameId = data.gameId;
	// })
	.then(({ status, body }) => {
		if (status === 201) {
			playState.gameId = body.gameId;
		} else if (status === 404 && body.error === 'One or both players not found') {
			// affiche une alerte si un ou les deux joueurs ne sont pas trouvés
			alert('One or both players not found');
			playState.gameStarted = false; 
		} else {
			// gere les autres erreurs
			console.error('Error:', body.error);
		}
	})
	.catch(error => console.error('error:', error));
}