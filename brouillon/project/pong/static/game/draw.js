function renderGame(context, leftPaddle, rightPaddle, ball, canvas, leftScore, rightScore) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dessine les palettes
    context.fillStyle = 'white';
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Dessine la balle
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();

    // Dessine le score
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.fillText(leftScore, canvas.width / 4, canvas.height / 5);
    context.fillText(rightScore, 3 * canvas.width / 4, canvas.height / 5);

    // Dessine la barre en pointillés au centre
    context.beginPath();
    context.setLineDash([5, 15]); // Définit le motif pointillé
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = 'white';
    context.stroke();
    context.setLineDash([]); // Réinitialise le motif de ligne
}
