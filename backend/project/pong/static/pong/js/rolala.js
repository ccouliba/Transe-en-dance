// Fonction pour centrer le canvas
function centerCanvas() {
    const canvasWidth = 800; // Largeur souhaitée du canvas
    const canvasHeight = 400; // Hauteur souhaitée du canvas

    // Calculez la position horizontale et verticale pour centrer le canvas
    const horizontalCenter = (window.innerWidth - canvasWidth) / 2;
    const verticalCenter = (window.innerHeight - canvasHeight) / 2;

    // Appliquez le style pour centrer le canvas
    gameCanvas.style.position = 'absolute';
    gameCanvas.style.left = horizontalCenter + 'px';
    gameCanvas.style.top = verticalCenter + 'px';
}

// Sélectionnez votre canvas
const gameCanvas = document.getElementById('pong');

// Définissez les dimensions de votre canvas
const canvasWidth = 800; // Largeur souhaitée
const canvasHeight = 400; // Hauteur souhaitée

// Assurez-vous que le canvas a les bonnes dimensions
gameCanvas.width = canvasWidth;
gameCanvas.height = canvasHeight;

// Appelez la fonction pour centrer le canvas au chargement initial
centerCanvas();

// Écoutez l'événement de redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    // Recalculez et centrez le canvas lorsque la fenêtre est redimensionnée
    centerCanvas();
});

// Obtenez le contexte du canvas pour le dessin
const gameCtx = gameCanvas.getContext('2d');











const config = {
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Remplacer par une couleur transparente
    paddleColor: 'white',
    ballColor: 'white',
    speedIncrement: 0.1,
    paddleWidth: 10,
    paddleHeight: 100,
    ballRadius: 10,
    initialBallSpeedX: 4,
    initialBallSpeedY: 4,
    scoreLimit: 5
};

const KEYS = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    W: 'w',
    S: 's'
};


const leftScoreElement = document.getElementById('leftScore');
const rightScoreElement = document.getElementById('rightScore');

let leftScore = 0;
let rightScore = 0;
let leftPaddle, rightPaddle, ball;
let animationFrameId;

window.onload = function() {
    setupGame();
    startMultiplayer();
};

function setupGame() {
    leftPaddle = createPaddle(10, gameCanvas.height / 2 - config.paddleHeight / 2);
    rightPaddle = createPaddle(gameCanvas.width - 20, gameCanvas.height / 2 - config.paddleHeight / 2);
    ball = createBall(gameCanvas.width / 2, gameCanvas.height / 2);
    updateScoreDisplay();
}

function resetGame() {
    leftScore = 0;
    rightScore = 0;
    resetBall();
    leftPaddle.y = gameCanvas.height / 2 - config.paddleHeight / 2;
    rightPaddle.y = gameCanvas.height / 2 - config.paddleHeight / 2;
    updateScoreDisplay();
    cancelAnimationFrame(animationFrameId);
}

function createPaddle(x, y) {
    return { x, y, width: config.paddleWidth, height: config.paddleHeight, dy: 0 };
}

function createBall(x, y) {
    let dx = config.initialBallSpeedX * (Math.random() > 0.5 ? 1 : -1);
    let dy = config.initialBallSpeedY * (Math.random() > 0.5 ? 1 : -1);
    return { x, y, radius: config.ballRadius, dx, dy };
}

function resetBall() {
    ball.x = gameCanvas.width / 2;
    ball.y = gameCanvas.height / 2;
    ball.dx = config.initialBallSpeedX * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = config.initialBallSpeedY * (Math.random() > 0.5 ? 1 : -1);
}

function startGameLoop() {
    function gameLoop() {
        updateAndRender();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

function updateAndRender() {
    updateGame();
    renderGame();
}

function updateGame() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    leftPaddle.y = Math.max(Math.min(leftPaddle.y, gameCanvas.height - config.paddleHeight), 0);
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, gameCanvas.height - config.paddleHeight), 0);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > gameCanvas.height) {
        ball.dy *= -1;
    }

    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
        ball.dx += Math.sign(ball.dx) * config.speedIncrement;
        ball.dy += Math.sign(ball.dy) * config.speedIncrement;
    }

    if (ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.radius;
        ball.dx += Math.sign(ball.dx) * config.speedIncrement;
        ball.dy += Math.sign(ball.dy) * config.speedIncrement;
    }

    if (ball.x - ball.radius < 0) {
        updateScores(false);
        resetBall();
    } else if (ball.x + ball.radius > gameCanvas.width) {
        updateScores(true);
        resetBall();
    }
}

function renderGame() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    gameCtx.fillStyle = config.paddleColor;
    gameCtx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    gameCtx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    gameCtx.beginPath();
    gameCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    gameCtx.fillStyle = config.ballColor;
    gameCtx.fill();

    gameCtx.fillStyle = 'white';
    gameCtx.font = '24px Arial';
    gameCtx.fillText(leftScore, gameCanvas.width / 4, 50);
    gameCtx.fillText(rightScore, 3 * gameCanvas.width / 4, 50);
}

function updateScores(leftPlayerScored) {
    if (leftPlayerScored) {
        leftScore++;
    } else {
        rightScore++;
    }
    updateScoreDisplay();

    if (leftScore >= config.scoreLimit || rightScore >= config.scoreLimit) {
        cancelAnimationFrame(animationFrameId);
        const winner = leftScore >= config.scoreLimit ? 'Left player wins!' : 'Right player wins!';
        currentGameMode = 0;
        humanVsHuman = 0;
        alert(winner);
        returnToMainMenu();
        resetGame();
    }
}

function updateScoreDisplay() {
    leftScoreElement.textContent = leftScore;
    rightScoreElement.textContent = rightScore;
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case KEYS.ARROW_UP:
            rightPaddle.dy = -5;
            break;
        case KEYS.ARROW_DOWN:
            rightPaddle.dy = 5;
            break;
        case KEYS.W:
            leftPaddle.dy = -5;
            break;
        case KEYS.S:
            leftPaddle.dy = 5;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case KEYS.ARROW_UP:
        case KEYS.ARROW_DOWN:
            rightPaddle.dy = 0;
            break;
        case KEYS.W:
        case KEYS.S:
            leftPaddle.dy = 0;
            break;
    }
});

function returnToMainMenu() {
    // Hide the game canvas and scoreboard
    document.getElementById('pong').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'none';

    // Show the main menu
    document.getElementById('menu').classList.remove('hidden');
}


function startMultiplayer() {
    console.log('je rentre bien dans ma fonction.');
    resetGame();
    if (currentGameMode === 1 && humanVsHuman === 1) {
        rightPaddle.isComputer = false;
        startGameLoop();
    }
    else
        console.log('Cannot start multiplayer game.');
}