const board = document.getElementById('game-board');
const ctx = board.getContext('2d');
const scoreBoard = document.getElementById('score-board');
const startButton = document.getElementById('start-button');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let game;
let initialTouchX = null;
let initialTouchY = null;

function randomPosition() {
    return {
        x: Math.floor(Math.random() * (board.width / gridSize)),
        y: Math.floor(Math.random() * ((board.height - 30) / gridSize))
    };
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatApple = snake[0].x === apple.x && snake[0].y === apple.y;
    if (didEatApple) {
        apple = randomPosition();
        score += 10;
        scoreBoard.textContent = `Score: ${score}`;
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    let newDx = dx;
    let newDy = dy;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingLeft = dx === -1;
    const goingRight = dx === 1;

    if (event.type === 'keydown') {
        const LEFT_KEY = 37;
        const UP_KEY = 38;
        const RIGHT_KEY = 39;
        const DOWN_KEY = 40;

        if (event.keyCode === LEFT_KEY && !goingRight) {
            newDx = -1;
            newDy = 0;
        } else if (event.keyCode === UP_KEY && !goingDown) {
            newDx = 0;
            newDy = -1;
        } else if (event.keyCode === RIGHT_KEY && !goingLeft) {
            newDx = 1;
            newDy = 0;
        } else if (event.keyCode === DOWN_KEY && !goingUp) {
            newDx = 0;
            newDy = 1;
        }
    } else if (event.type === 'touchstart') {
        event.preventDefault(); // Prevent default touch behavior (scrolling)
        initialTouchX = event.touches[0].clientX;
        initialTouchY = event.touches[0].clientY;
    } else if (event.type === 'touchend') {
        event.preventDefault(); // Prevent default touch behavior (scrolling)
        if (initialTouchX === null || initialTouchY === null) return;

        const deltaX = event.changedTouches[0].clientX - initialTouchX;
        const deltaY = event.changedTouches[0].clientY - initialTouchY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && !goingLeft) {
                newDx = 1;
                newDy = 0;
            } else if (deltaX < 0 && !goingRight) {
                newDx = -1;
                newDy = 0;
            }
        } else {
            if (deltaY > 0 && !goingUp) {
                newDx = 0;
                newDy = 1;
            } else if (deltaY < 0 && !goingDown) {
                newDx = 0;
                newDy = -1;
            }
        }

        initialTouchX = null;
        initialTouchY = null;
    }

    if ((newDx !== dx || newDy !== dy) && (newDx !== -dx || newDy !== -dy)) {
        dx = newDx;
        dy = newDy;
    }
}

function checkCollision() {
    const head = snake[0];
    const body = snake.slice(1);

    if (head.x < 0 || head.x >= board.width / gridSize || head.y < 0 || head.y >= (board.height - 30) / gridSize) {
        return true;
    }

    for (let part of body) {
        if (head.x === part.x && head.y === part.y) {
            return true;
        }
    }

    return false;
}

function clearBoard() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, board.width, board.height);
}

function gameLoop() {
    if (checkCollision()) {
        clearInterval(game);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Game Over! Score: ${score}`, board.width / 2, board.height / 2);
        startButton.style.display = 'block';
        return;
    }

    clearBoard();
    drawApple();
    moveSnake();
    drawSnake();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, board.height - 30, board.width, 30);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, board.height - 10);

    game = setTimeout(gameLoop, 100);
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    apple = randomPosition();
    dx = 0;
    dy = 0;
    score = 0;
    scoreBoard.textContent = 'Score: 0';
    startButton.style.display = 'none';
    clearBoard();
    drawApple();
    drawSnake();
    gameLoop();
}

document.addEventListener('keydown', changeDirection);
board.addEventListener('touchstart', changeDirection, { passive: false });
board.addEventListener('touchend', changeDirection, { passive: false });
startButton.addEventListener('click', startGame);
