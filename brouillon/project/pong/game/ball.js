const SPEED_INCREMENT = 0.5; // Incrément de vitesse à chaque collision avec une palette

function createBall(x, y, radius, dx, dy) {
	return { x, y, radius, dx, dy, speed: Math.sqrt(dx * dx + dy * dy) };
}

function moveBall(ball, canvas, leftPaddle, rightPaddle, updateScores) {
	ball.x += ball.dx;
	ball.y += ball.dy;

	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.dy *= -1;
	}

	if (ball.x + ball.radius > canvas.width) {
		resetBall(ball, canvas);
		updateScores(true);
	}

	if (ball.x - ball.radius < 0) {
		resetBall(ball, canvas);
		updateScores(false);
	}

	if (checkCollision(ball, leftPaddle) || checkCollision(ball, rightPaddle)) {
		ball.dx *= -1;
		ball.dx > 0 ? ball.dx += SPEED_INCREMENT : ball.dx -= SPEED_INCREMENT; // Augmente la vitesse horizontale
		ball.dy > 0 ? ball.dy += SPEED_INCREMENT : ball.dy -= SPEED_INCREMENT; // Augmente la vitesse verticale
	}
}

function resetBall(ball, canvas) {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1); // Réinitialise la vitesse et la direction horizontale
	ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1); // Réinitialise la vitesse et la direction verticale
}

function checkCollision(ball, paddle) {
	return ball.x - ball.radius < paddle.x + paddle.width &&
		   ball.x + ball.radius > paddle.x &&
		   ball.y + ball.radius > paddle.y &&
		   ball.y - ball.radius < paddle.y + paddle.height;
}
