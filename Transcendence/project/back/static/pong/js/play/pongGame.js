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

	let onlineStatusInterval;
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
			// clearInterval(onlineStatusInterval);
		}
	}
	// onlineStatusInterval = setInterval(updateOnlineStatus, 5000);

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

function updateProfileStats() {
	httpGetJson('/pong/api/profile')
	.then(response => response.json())
	.then(profile => {
		// Mettre à jour profileState avec les nouvelles stats
		profileState = {
			...profileState,
			...profile,
			total_games: profile.wins + profile.losses,
			win_rate: profile.total_games > 0 ? (profile.wins / profile.total_games) * 100 : 0
		};
		profileState.isLoaded = false; // Forcer le rechargement du profil
		// Si l'utilisateur est sur la page de profil : recharger le composant
		if (window.location.hash === '#profile') {
			mountComponent(Profile);
		}
	})
	.catch(error => console.error('Error updating profile stats:', error));
}




function finishGame(gameId, player1Score, player2Score, winnerUsername) {

	let url = `/pong/api/games/finish_game/${gameId}/` 
	let payload = { winner: winnerUsername, player1Score, player2Score }
	httpPostJson(url, payload)
	.then(response => response.json())
	.then(data => {
		console.log('Game finished:', data);
	})
	.catch(error => console.error('Error finishing game:', error));
}




// fonction pour creer une nouvelle partie dans la base de donnees
function createGameInDatabase() {
	// envoie une requete post a l'api pour creer une nouvelle partie
	return httpPostJson('/pong/api/games/create_game/', {
		// player1Username: playState.player1Username,
		player2Username: playState.player2Username
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
	
	.catch(error => console.error('error:', error));
}



function updateTournamentMatchScore(matchId, player1Score, player2Score, winner) {
	
	let url = `/pong/api/tournament/update_match_score/`
	return httpPostJson(url, {
		match_id: matchId,
		player1_score: player1Score,
		player2_score: player2Score,
		winner: winner
	})
	.then(response => {
		console.log('Server response status:', response.status);
		return response.json();
	})
	.then(data => {
		console.log('Server response data:', data);
		if (data.status === 'success') {
			console.log('Tournament match score updated successfully');
			return data;
		} else {
			console.error('Error updating tournament match score:', data.message);
			throw new Error(data.message);
		}
	})
	.catch(error => {
		console.error('Error in updateTournamentMatchScore:', error);
		throw error;
	});
}

function endGame() {
	playState.gameOver = true;
	const winnerUsername  = playState.player1Score > playState.player2Score ? playState.player1Username : playState.player2Username;
   
	if (playState.isTournamentMatch) {
		updateTournamentMatchScore(playState.gameId, playState.player1Score, playState.player2Score, winnerUsername)
			.then((payload) => {
				fetchMatchesAndRankings()
				return
				//changePage("#tournament");
			})
			.catch(error => {
				console.error('Error updating tournament data:', error);
				alert('An error occurred while updating the tournament. Please refresh the page.');
			});
	} else {
		finishGame(playState.gameId, playState.player1Score, playState.player2Score, winnerUsername);
		changePage("#play");
	}
	updateProfileStats();
}



function reloadTournamentData() {

	let url = `/pong/api/tournament/${tournamentState.tournament.id}/matchmaking/`
	return httpGetJson(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			if (data.status === 'success') {
				tournamentState.matches = data.matches;
				tournamentState.rankings = data.rankings;
				tournamentState.winner = data.winner;
				tournamentState.aliases = data.aliases || {};
			} else {
				throw new Error('Error fetching tournament data: ' + data.message);
			}
		});
}

function backToTournament() {
	playState.isTournamentMatch = false;
	playState.tournamentId = null;
	changePage("#tournamentmatchmaking");
}

function updateScore(gameId, player1Score, player2Score, winner) {
	// fetch('/pong/api/games/create_game/', {
	
	return httpPostJson(`/pong/api/games/update_score/`, {
		game_id: matchId,
		player1_score: player1Score,
		player2_score: player2Score,
		winner: winner
	})
	.then(response => {
		console.log('Server response status:', response.status);
		return response.json();
	})
	.then(data => {
		console.log('Server response data:', data);
		if (data.status === 'success') {
			console.log('Score updated successfully');
			return data;
		} else {
			console.error('Error score:', data.message);
			throw new Error(data.message);
		}
	})
	.catch(error => {
		console.error('Error in updateScore:', error);
		throw error;
	});
}