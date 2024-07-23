window.onload = function() {
    // Création du canvas
    var canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    canvas.width = 600; // Largeur du canvas
    canvas.height = 300; // Hauteur du canvas

    // Style pour centrer le canvas
    canvas.style.display = "block";
    canvas.style.margin = "auto";
    canvas.style.position = "relative";
    canvas.style.top = "50%";
    canvas.style.transform = "translateY(-50%)";

    // Ajout du canvas au DOM
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Définition des dimensions des paddles et initialisation des positions
    const paddleWidth = 10;
    const paddleHeight = canvas.height / 5;
    const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
    const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
    const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2, radius: 7, speed: 2 };

    // Couleurs
    const playerColor = '#00f'; // Bleu pour le joueur
    const aiColor = '#f00'; // Rouge pour l'IA
    const ballColor = '#0f0'; // Vert pour la balle
    const backgroundColor = '#000'; // Noir pour le fond du canvas

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
        }

        if (checkCollision(ball, ai)) {
            ball.dx = -ball.dx;
            ball.dy = (ball.y - (ai.y + paddleHeight / 2)) * 0.1;
        }

        if (ball.x + ball.radius > canvas.width) resetBall();
        if (ball.x - ball.radius < 0) resetBall();
    }

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
        animateCenteringAiPaddle(pos);
    }

    // Fonction pour mettre à jour le mouvement de l'IA
    function updateAI() {
        if (ball.dx < 0) {
            centerAiPaddle(2);
        } else {
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
        ctx.fillStyle = '#fff'; // Blanc pour la ligne centrale
        ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
    }

    // Boucle de jeu
    function gameLoop() {
        update();
        draw();
    }

    // Démarrage de la boucle de jeu
    setInterval(gameLoop, 1000 / 60);
};
