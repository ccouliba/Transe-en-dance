let inGame = false;
let intergame;
let interia;


function IA() {

	setTimeout(toggleCanvas, 200)
	return `
	<div id="ia-page">
		<h1>${window.trans.goodLuck}</h1>
	</div>`;
}

function clearIAGame(){
	let canvas = document.getElementById("myCanvas")
	if (!canvas){
		return
	}
	canvas.remove()
}

function initializeGameIA() {
	// Création du canvas
	var canvas = document.createElement("canvas");
	//console.log("Canvas créé:", canvas);
	canvas.id = "myCanvas";
	canvas.width = 600;
	canvas.height = 300;
	//console.log("Dimensions du canvas:", canvas.width, canvas.height);

	// Style pour centrer le canvas
	canvas.style.display = "block";
	canvas.style.margin = "auto";
	//canvas.style.position = "relative";
   // canvas.style.top = "100px"
	// canvas.style.left = "33vh"
	// Ajout du canvas au DOM
	let holder = document.getElementById("ia-page") 
	if (!holder){
		return
	}
	holder.appendChild(canvas);
	
	const ctx = canvas.getContext('2d');
	//console.log("Contexte 2D obtenu:", ctx);

	// Définition des dimensions des paddles et initialisation des positions
	const paddleWidth = 10;
	const paddleHeight = canvas.height / 5;
	//console.log("Dimensions des paddles:", paddleWidth, paddleHeight);

	const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
	const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
	const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2, radius: 7, speed: 2 };
	//console.log("Positions initiales:", "Player:", player, "AI:", ai, "Ball:", ball);

	// Couleurs
	const playerColor = '#00f';
	const aiColor = '#f00';
	const ballColor = '#0f0';
	const backgroundColor = '#000';
	//console.log("Couleurs définies:", "Player:", playerColor, "AI:", aiColor, "Ball:", ballColor, "Background:", backgroundColor);

	// Variables de score
	let playerScore = 0;
	let aiScore = 0;
	const maxScore = 5;
	//console.log("Scores initiaux:", "Player:", playerScore, "AI:", aiScore);

	// Gestion des événements de pression de touche
	document.addEventListener('keydown', function(e) {
		//console.log("Touche pressée:", e.key);
		if (e.key === 'ArrowUp') player.dy = -8;
		if (e.key === 'ArrowDown') {
			player.dy = 8;
			e.preventDefault()
		}
		if (e.key === '+') ai.dy = -8;
		if (e.key === '-') ai.dy = 8;
		if (e.key === 'Enter' && gameOver) resetGame();
	});

	document.addEventListener('keyup', function(e) {
		//console.log("Touche relâchée:", e.key);
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
		if (e.key === '+' || e.key === '-') ai.dy = 0;
	});

	function simulateKey(key, isKeyDown = true) {
		const eventType = isKeyDown ? 'keydown' : 'keyup';
		const event = new KeyboardEvent(eventType, { key });
		//console.log("Simulation de touche:", eventType, key);
		document.dispatchEvent(event);
	}

	function update() {
		if (gameOver) return;

		//console.log("Mise à jour des positions:", "Player Y:", player.y, "AI Y:", ai.y, "Ball:", ball);

		player.y += player.dy;
		if (player.y < 0) player.y = 0;
		if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;

		ai.y += ai.dy;
		if (ai.y < 0) ai.y = 0;
		if (ai.y + paddleHeight > canvas.height) ai.y = canvas.height - paddleHeight;

		ball.x += ball.dx * ball.speed / 2;
		ball.y += ball.dy * ball.speed / 2;

		if (ball.y + ball.radius > canvas.height) {
			ball.y = canvas.height - ball.radius;
			ball.dy *= -1;
		} else if (ball.y - ball.radius < 0) {
			ball.y = ball.radius;
			ball.dy *= -1;
		}

		if (checkCollision(ball, player)) {
			//console.log("Collision avec le joueur");
			ball.x = player.x + paddleWidth + ball.radius;
			ball.dx *= -1;
			ball.dy = (ball.y - (player.y + paddleHeight / 2)) * 0.2;
			ball.speed = Math.min(ball.speed + 0.2, 6);
		}

		if (checkCollision(ball, ai)) {
			//console.log("Collision avec l'IA");
			ball.x = ai.x - ball.radius;
			ball.dx *= -1;
			ball.dy = (ball.y - (ai.y + paddleHeight / 2)) * 0.2;
			ball.speed = Math.min(ball.speed + 0.2, 6);
		}

		if (ball.x + ball.radius > canvas.width) {
			playerScore++;
			//console.log("But! Score du joueur:", playerScore);
			if (playerScore >= maxScore) {
				gameOver = true;
				winner = `${window.trans.player}`;
				//console.log("Le joueur gagne!");
			} else {
				resetBall();
			}
		} else if (ball.x - ball.radius < 0) {
			aiScore++;
			//console.log("But! Score de l'IA:", aiScore);
			if (aiScore >= maxScore) {
				gameOver = true;
				winner = 'AI';
				//console.log("L'IA gagne!");
			} else {
				resetBall();
			}
		}
	}

	let animatingAiPaddle = false;
	let gameOver = false;
	let winner = '';

	function animateCenteringAiPaddle(pos) {
		if (!animatingAiPaddle) {
			animatingAiPaddle = true;
			//console.log("Centrage du paddle de l'IA vers la position:", pos);

			let targetY;
			if (pos === 0)
				targetY = canvas.height / 2 - paddleHeight / 2 - (paddleHeight * 2);
			else if (pos === 1)
				targetY = canvas.height / 2 - paddleHeight / 2 - paddleHeight;
			else if (pos === 2)
				targetY = canvas.height / 2 - paddleHeight / 2;
			else if (pos === 3)
				targetY = canvas.height / 2 - paddleHeight / 2 + paddleHeight;
			else
				targetY = canvas.height / 2 - paddleHeight / 2 + (paddleHeight * 2);

			let startY = ai.y;
			//console.log("Début de l'animation du paddle IA de", startY, "vers", targetY);

			function animateStep() {
				if (startY <= targetY) {
					simulateKey('-');
					if (ai.y >= targetY) {
						simulateKey('-', false);
						animatingAiPaddle = false;
						//console.log("Fin de l'animation du paddle IA.");
						return;
					}
				} else {
					simulateKey('+');
					if (ai.y <= targetY) {
						simulateKey('+', false);
						animatingAiPaddle = false;
						//console.log("Fin de l'animation du paddle IA.");
						return;
					}
				}
	
				if (inGame)
					requestAnimationFrame(animateStep);
			}
	
			animateStep();
		}
	}

	function centerAiPaddle(pos) {
		simulateKey('+', false);
		simulateKey('-', false);
		animateCenteringAiPaddle(pos);
	}

	function updateAI() {
		//console.log("Mise à jour de l'IA");
		if (ball.dx < 0) 
			centerAiPaddle(2);
		else if (ball.x < canvas.width / 2 + ((canvas.width / 2) / 3))
			centerAiPaddle(getBallSection(ball.y));
		else
			centerAiPaddle(predictBallY());
	}

	interia = setInterval(updateAI, 1000);

	function checkCollision(ball, paddle) {
		return ball.x - ball.radius < paddle.x + paddleWidth &&
			ball.x + ball.radius > paddle.x &&
			ball.y > paddle.y &&
			ball.y < paddle.y + paddleHeight;
	}

	function resetBall() {
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
		ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1);
		ball.speed = 2;
		//console.log("Balle réinitialisée:", ball);
	}

	function draw() {
		// Remplir le fond du canvas
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Dessiner les paddles
		ctx.fillStyle = playerColor;
		ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
		
		ctx.fillStyle = aiColor;
		ctx.fillRect(ai.x, ai.y, paddleWidth, paddleHeight);

		// Dessiner la balle
		ctx.fillStyle = ballColor;
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fill();

		// Dessiner la ligne centrale
		ctx.fillStyle = '#fff';
		ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);

		// Afficher le score
		ctx.fillStyle = '#fff';
		ctx.font = '24px Arial';
		ctx.textAlign = 'center';

		const textPlayer = `${playerScore}`;
		const textAI = `${aiScore}`;

		// Calculer la largeur du texte
		const playerTextWidth = ctx.measureText(textPlayer).width;
		const aiTextWidth = ctx.measureText(textAI).width;

		// Positionner le texte
		ctx.fillText(textPlayer, canvas.width / 4 - playerTextWidth / 2, 30);
		ctx.fillText(textAI, canvas.width * 3 / 4 - aiTextWidth / 2, 30);

		// Afficher message de fin de jeu
		if (gameOver) {
			ctx.font = '48px Arial';
			ctx.textAlign = 'center';
			ctx.fillText(winner + ` ${window.trans._won}!`, canvas.width / 2, canvas.height / 2);
			ctx.font = '24px Arial';
			ctx.fillText(`${window.trans.pressEnter}`, canvas.width / 2, canvas.height / 2 + 40);
		}
	}

	function gameLoop() {
		update();
		draw();
	}
	
	function getBallSection(ballY) {
		const sectionHeight = canvas.height / 5;
		//console.log("Section de la balle:", ballY, "Section:", Math.floor(ballY / sectionHeight));
		if (ballY < sectionHeight) return 0;
		if (ballY < sectionHeight * 2) return 1;
		if (ballY < sectionHeight * 3) return 2;
		if (ballY < sectionHeight * 4) return 3;
		return 4;
	}

	function predictBallY() {
		let tempBall = { ...ball };
		while (tempBall.x + tempBall.radius < canvas.width && tempBall.x - tempBall.radius > 0) {
			tempBall.x += tempBall.dx * tempBall.speed / 2;
			tempBall.y += tempBall.dy * tempBall.speed / 2;
			if (tempBall.y + tempBall.radius > canvas.height || tempBall.y - tempBall.radius < 0) {
				tempBall.dy *= -1;
			}
		}
		//console.log("Prédiction de la position Y de la balle:", tempBall.y);
		return getBallSection(tempBall.y);
	}

	function resetGame() {
		playerScore = 0;
		aiScore = 0;
		gameOver = false;
		winner = '';
		resetBall();
		//console.log("Jeu réinitialisé.");
	}

	intergame = setInterval(gameLoop, 1000 / 60);
}

function toggleCanvas() {
	
	clearInterval(intergame);
	inGame = true;
	var canvas = document.getElementById('myCanvas');
	//if (canvas) {
		//resetGame();
	//} 
	if (!canvas) {
		initializeGameIA();
	}
}

function hideCanvas() {
	if (interia)
		clearInterval(interia);
	if (intergame)
		clearInterval(intergame);
	inGame = false;
	//console.log("out game");
	//console.log(inGame);
	var canvas = document.getElementById('myCanvas');
	if (canvas) {
		document.body.removeChild(canvas);
	}
}
