function createPaddle(x, y, width, height) {
    return { x, y, width, height, dy: 0 };
}

function movePaddle(paddle, canvasHeight) {
    paddle.y += paddle.dy;

    if (paddle.y < 0) {
        paddle.y = 0;
    } else if (paddle.y + paddle.height > canvasHeight) {
        paddle.y = canvasHeight - paddle.height;
    }
}

function handleKeyDown(event, leftPaddle, rightPaddle) {
    switch (event.key) {
        case 'w':
            leftPaddle.dy = -5;
            break;
        case 's':
            leftPaddle.dy = 5;
            break;
        case 'ArrowUp':
            rightPaddle.dy = -5;
            break;
        case 'ArrowDown':
            rightPaddle.dy = 5;
            break;
    }
}

function handleKeyUp(event, leftPaddle, rightPaddle) {
    switch (event.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            rightPaddle.dy = 0;
            break;
    }
}
