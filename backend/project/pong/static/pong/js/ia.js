
function IAcomponent() {
    return `

        <div>
     ${startGame()}
        </div>
    `;
}


window.onload = function() {
	// Initialisation de l'état IA
	var IAState = {}

	// // Fonction pour générer le menu de navigation
	// function Menu() {
	// 	return `
	// 		<nav>
	// 			<ul>
	// 				<li><a href="#home" onclick="changePage('#home')">Home</a></li>
	// 				<li><a href="#play" onclick="changePage('#play')">Play</a></li>
	// 				<li><a href="#profile" onclick="changePage('#profile')">Profile</a></li>
	// 				<li><a href="#friends" onclick="changePage('#friends')">Friends</a></li>
	// 				<li><a href="#ia" onclick="changePage('#ia')">IA</a></li>
	// 			</ul>
	// 		</nav>
	// 	`;
	// }

	// Fonction pour démarrer le jeu
	function startGame() {
		const canvas = document.getElementById('myCanvas');
		const ctx = canvas.getContext('2d');

		// Définition des dimensions des paddles et initialisation des positions
		const paddleWidth = 10, paddleHeight = myCanvas.height / 5;
		const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
		const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
		const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2, radius: 7, speed: 2 };

		// Gestion des événements de pression de touche
		document.addEventListener('keydown', function(e) {
			if (e.key === 'ArrowUp') player.dy = -8;
			if (e.key === 'ArrowDown') player.dy = 8;
			if (e.key === '+') ai.dy = -8;
			if (e.key === '-') ai.dy = 8;
		});

		document.addEventListener('keyup', function(e) {
			if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
			if (e.key === '+' || e.key === '-') ai.dy = 0;
		});

		// Fonction pour simuler la pression des touches
		function simulateKey(key, isKeyDown = true) {
			const eventType = isKeyDown ? 'keydown' : 'keyup';
			const event = new KeyboardEvent(eventType, { key });
			document.dispatchEvent(event);
		}

		// Fonction pour mettre à jour les positions du jeu
		function update() {
			player.y += player.dy;
			if (player.y < 0) player.y = 0;
			if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;

			ai.y += ai.dy;
			if (ai.y < 0) ai.y = 0;
			if (ai.y + paddleHeight > canvas.height) ai.y = canvas.height - paddleHeight;

			ball.x += ball.dx * ball.speed;
			ball.y += ball.dy * ball.speed;

			if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy *= -1;

			if (checkCollision(ball, player)) {
				ball.dx = -ball.dx;
				ball.dy = (ball.y - (player.y + paddleHeight / 2)) * 0.1;
				//ball.speed *= 1.05; // Augmente légèrement la vitesse
			}

			if (checkCollision(ball, ai)) {
				ball.dx = -ball.dx;
				ball.dy = (ball.y - (ai.y + paddleHeight / 2)) * 0.1;
				//ball.speed *= 1.05; // Augmente légèrement la vitesse
			}

			if (ball.x + ball.radius > canvas.width) resetBall();
			if (ball.x - ball.radius < 0) resetBall();
		}

		/*function simulateKeyUntilTarget(targetPosition, key) {
			const currentY = ai.y + paddleHeight / 2; // Supposons que ai.y est la position verticale du haut du paddle
			const eventType = key === '+' ? 'keydown' : 'keyup';
		
			// Simule la pression de la touche si la position actuelle est inférieure à la position cible
			if (currentY < targetPosition) {
				const event = new KeyboardEvent(eventType, { key });
				document.dispatchEvent(event);
			} else {
				// Arrête de simuler la pression de la touche si la position actuelle dépasse la position cible
				simulateKey(key, false);
			}
		}*/


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		let animatingAiPaddle = false;

		function animateCenteringAiPaddle(pos) {
			if (!animatingAiPaddle) {
				animatingAiPaddle = true;

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
				function animateStep() {
					if (startY <= targetY) {
						simulateKey('-'); // Monte le paddle
						if (ai.y >= targetY) {
							simulateKey('-', false);
							animatingAiPaddle = false;
							return;
						}
					} else {
						simulateKey('+');
						if (ai.y <= targetY) {
							simulateKey('+', false);
							animatingAiPaddle = false;
							return;
						}
					}
		
					requestAnimationFrame(animateStep);
				}
		
				animateStep();
			}
		}



		function centerAiPaddle(pos) {
			simulateKey('+', false); // Relâche la touche
			simulateKey('-', false); // Relâche la touche
			const canvas = document.getElementById('myCanvas');
			const paddleHeight = canvas.height / 5;
			animateCenteringAiPaddle(pos);
		}




		





		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Fonction pour mettre à jour le mouvement de l'IA
		function updateAI() {
		    if (ball.dx < 0) {
				centerAiPaddle(2);
		  } else {
				// Logique de l'IA pour déplacer le paddle lorsque la balle est dans sa direction
				if (ball.x > canvas.width / 2) {
					if (ball.y < ai.y + paddleHeight / 2) {
						simulateKey('+'); // Monte le paddle
					} else if (ball.y > ai.y + paddleHeight / 2) {
						simulateKey('-'); // Descend le paddle
					}
				} else {
					simulateKey('+', false); // Relâche la touche
					simulateKey('-', false); // Relâche la touche
				}
			}
		}

		setInterval(updateAI, 1000);

		// Fonction pour vérifier la collision entre la balle et le paddle
		function checkCollision(ball, paddle) {
			return ball.x - ball.radius < paddle.x + paddleWidth &&
				ball.x + ball.radius > paddle.x &&
				ball.y > paddle.y &&
				ball.y < paddle.y + paddleHeight;
		}

		// Fonction pour réinitialiser la position de la balle
		function resetBall() {
			ball.x = canvas.width / 2;
			ball.y = canvas.height / 2;
			ball.dx = -ball.dx;
			ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1);
			ball.speed = 2;
		}

		// Fonction pour dessiner les éléments du jeu
		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#fff';

			ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
			ctx.fillRect(ai.x, ai.y, paddleWidth, paddleHeight);

			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
		}

		// Boucle de jeu principale
		function loop() {
			update();
			draw();
			requestAnimationFrame(loop);
		}

		loop(); // Démarrer la boucle de jeu
	}

	// Fonction pour dessiner sur le canvas et démarrer le jeu
	function drawOnCanvas() {
		var canvas = document.getElementById("myCanvas");
		if (canvas && canvas.getContext) {
			startGame();
		}
	}

	// // Fonction pour monter le composant IA et démarrer le jeu
	// function mountIA() {
	// 	document.getElementById("app").innerHTML = IA();
	// 	drawOnCanvas();
	// }

	// Définition des routes de l'application
	/*let appRoutes = {
		"#home": () => mountComponent(Home),
		"#play": () => mountComponent(Play),
		"#profile": () => mountComponent(Profile),
		"#friends": () => mountComponent(FriendsList),
		"#404": () => mountComponent(Page404),
		"#ia": () => mountIA()
	};

	// Fonction pour changer de page
	window.changePage = function(url) {
		if (url === "#play") {
			playState.isLoaded = false;
		}
		if (typeof appRoutes[url] === "undefined") {
			mountComponent(Page404)
			history.pushState({ page: "#404" }, "", "#404");
			return;
		}
		appRoutes[url]();
		history.pushState({ page: url }, "", url);
	}

	// Gestion de la navigation par l'historique
	window.onpopstate = function(event) {
		const page = event.state ? event.state.page : '404';
		if (appRoutes[page]) {
			appRoutes[page]();
		} else {
			mountComponent(Page404);
		}
	};

	// Fonction pour monter un composant dans le DOM
	function mountComponent(componentFunction, data) {
		document.getElementById("app").innerHTML = componentFunction(data);
	}
*/
	// Montre le composant IA par défaut au chargement de la page
	// mountIA();
};
