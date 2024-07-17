window.onload = function() {
    var IAState = {}

    function Menu() {
        return `
            <nav>
                <ul>
                    <li><a href="#home" onclick="changePage('#home')">Home</a></li>
                    <li><a href="#play" onclick="changePage('#play')">Play</a></li>
                    <li><a href="#profile" onclick="changePage('#profile')">Profile</a></li>
                    <li><a href="#friends" onclick="changePage('#friends')">Friends</a></li>
                    <li><a href="#ia" onclick="changePage('#ia')">IA</a></li>
                </ul>
            </nav>
        `;
    }

    function startGame() {
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        const paddleWidth = 10, paddleHeight = myCanvas.height / 5; // 5 positions
        const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
        const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
        const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2, radius: 7, speed: 2 };

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

        function simulateKey(key, isKeyDown = true) {
            const eventType = isKeyDown ? 'keydown' : 'keyup';
            const event = new KeyboardEvent(eventType, { key });
            document.dispatchEvent(event);
        }

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
                ball.speed *= 1.05; // Augmente légèrement la vitesse
            }

            if (checkCollision(ball, ai)) {
                ball.dx = -ball.dx;
                ball.dy = (ball.y - (ai.y + paddleHeight / 2)) * 0.1;
                ball.speed *= 1.05; // Augmente légèrement la vitesse
            }

            if (ball.x + ball.radius > canvas.width) resetBall();
            if (ball.x - ball.radius < 0) resetBall();
        }

        function updateAI() {
            // Logique de l'IA pour déplacer le paddle
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

        setInterval(updateAI, 1000); // Met à jour l'IA toutes les secondes

        function checkCollision(ball, paddle) {
            return ball.x - ball.radius < paddle.x + paddleWidth &&
                ball.x + ball.radius > paddle.x &&
                ball.y > paddle.y &&
                ball.y < paddle.y + paddleHeight;
        }

        function resetBall() {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = -ball.dx;
            ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1);
            ball.speed = 2;
        }

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

        function loop() {
            update();
            draw();
            requestAnimationFrame(loop);
        }

        loop();
    }

    function drawOnCanvas() {
        var canvas = document.getElementById("myCanvas");
        if (canvas && canvas.getContext) {
            startGame();
        }
    }

    function mountIA() {
        document.getElementById("app").innerHTML = IA();
        drawOnCanvas();
    }

    let appRoutes = {
        "#home": () => mountComponent(Home),
        "#play": () => mountComponent(Play),
        "#profile": () => mountComponent(Profile),
        "#friends": () => mountComponent(FriendsList),
        "#404": () => mountComponent(Page404),
        "#ia": () => mountIA()
    };

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

    window.onpopstate = function(event) {
        const page = event.state ? event.state.page : '404';
        if (appRoutes[page]) {
            appRoutes[page]();
        } else {
            mountComponent(Page404);
        }
    };

    function mountComponent(componentFunction, data) {
        document.getElementById("app").innerHTML = componentFunction(data);
    }

    mountIA();
};
