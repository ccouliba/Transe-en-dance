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
const WINNING_SCORE = 10; //A CHANGER OU PAS

let paddle1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let paddle2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = 5;
let ballSpeedY = 2;

function Play() {
    if (!playState.isLoaded) {
        loadPlayState();
    }

    let content = '';

    if (playState.gameOver) {
        content = `
            <div class="container mt-5">
                <h1>Game ended. Bye !</h1>
                <div class="mt-4">
                    <h2>Final Scores:</h2>
                    <p>${playState.player1Email}: ${playState.player1Score}</p>
                    <p>${playState.player2Email}: ${playState.player2Score}</p>
                </div>
                <button id="restartGameBtn" class="btn btn-primary mt-3">You want to restart a game ?</button>
            </div>
        `;
    } else if (!playState.gameStarted) {
        content = `
            <div class="container mt-5">
                <h1>Pong game</h1>
                <form id="start-game-form">
                    <div class="mb-3">
                        <label for="player1Email" class="form-label">First player's email</label>
                        <input type="email" class="form-control" id="player1Email" required>
                    </div>
                    <div class="mb-3">
                        <label for="player2Email" class="form-label">Second player's email</label>
                        <input type="email" class="form-control" id="player2Email" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Start game</button>
                </form>
				        <div id="instructions" class="card p-3 mb-4">
            <h2 class="card-title">Instructions </h2>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">The objective of the game is to score points by hitting the ball into the opponent's court.</li>
                <li class="list-group-item">Player 1 controls their paddle using the W (up) and S (down) keys.</li>
                <li class="list-group-item">Player 2 controls their paddle using the Up (↑) and Down (↓) arrow keys.</li>
                <li class="list-group-item">The first player to reach a set number of points wins the game.</li>
                <li class="list-group-item">Good luck and have fun!</li>
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

    return `
        ${Menu()}
        ${content}
    `;
}

function loadPlayState() {
    if (!playState.isLoaded) {
        bindEvent(playState, "#start-game-form", "submit", startGame);
        bindEvent(playState, "#restartGameBtn", "click", restartGame);
        playState.isLoaded = true;
    }

    if (playState.gameStarted && !playState.gameOver) {
        setTimeout(initializeGame, 0);
    }
}
function loadPlayState() {
	bindEvent(playState, "#start-game-form", "submit", startGame);
	bindEvent(playState, "#restartGameBtn", "click", restartGame);
	playState.isLoaded = true;
}

function startGame(event) {
    event.preventDefault();
    playState.player1Email = document.getElementById("player1Email").value;
    playState.player2Email = document.getElementById("player2Email").value;
    playState.gameStarted = true;
    playState.player1Score = 0;
    playState.player2Score = 0;
    playState.gameOver = false;

    createGameInDatabase();
    changePage("#play");
    // mountComponent(Play);
    initializeGame();
}

function createGameInDatabase() {
	fetch('/pong/api/games/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			player1Email: playState.player1Email,
			player2Email: playState.player2Email
		}),
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data => {
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
    ballSpeedX = 5;
    ballSpeedY = 2;

    // Utiliser changePage pour revenir à l'écran de démarrage du jeu
    changePage("#play");
}

function initializeGame() {
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
		ballX += ballSpeedX;
		ballY += ballSpeedY;

		if (ballY < 0 || ballY > CANVAS_HEIGHT) {
			ballSpeedY = -ballSpeedY;
		}

		if (
			(ballX < PADDLE_WIDTH && ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) ||
			(ballX > CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT)
		) {
			ballSpeedX = -ballSpeedX;
		}

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

	function update() {
		if (!playState.gameOver) {
			moveBall();
			drawGame();
			requestAnimationFrame(update);
		}
	}

	function preventDefaultForScrollKeys(e) {
		if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
			e.preventDefault();
			return false;
		}
	}

	document.addEventListener('keydown', function(event) {
		if (!playState.gameOver) {
			switch(event.code) {
				case 'KeyW':
					paddle1Y = Math.max(paddle1Y - 20, 0);
					break;
				case 'KeyS':
					paddle1Y = Math.min(paddle1Y + 20, CANVAS_HEIGHT - PADDLE_HEIGHT);
					break;
				case 'ArrowUp':
					paddle2Y = Math.max(paddle2Y - 20, 0);
					preventDefaultForScrollKeys(event);
					break;
				case 'ArrowDown':
					paddle2Y = Math.min(paddle2Y + 20, CANVAS_HEIGHT - PADDLE_HEIGHT);
					preventDefaultForScrollKeys(event);
					break;
			}
		}
	});

	window.addEventListener('keydown', preventDefaultForScrollKeys, false);

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
		mountComponent(Play);
	})
	.catch(error => console.error('Error:', error));
}

