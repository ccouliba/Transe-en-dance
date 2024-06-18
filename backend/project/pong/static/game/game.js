function updateGame(leftPaddle, rightPaddle, ball, canvas, updateScores) {
    movePaddle(leftPaddle, canvas.height);
    movePaddle(rightPaddle, canvas.height);
    moveBall(ball, canvas, leftPaddle, rightPaddle, updateScores);
}
