const character = document.getElementById('character');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const gameContainer = document.getElementById('game-container');

let score = 0;
let isJumping = false;
let gameOver = false;
let obstacleSpeed = 2; // Initial speed
let gameInterval;
let obstacleAnimation;

function startGame() {
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameOver = false;
    isJumping = false;
    obstacleSpeed = 2; // Reset speed
    gameOverDisplay.classList.add('hidden');
    obstacle.style.right = '0px'; // Reset obstacle position

    // Clear previous animations if any
    if (obstacleAnimation) {
        obstacle.style.animation = 'none';
        void obstacle.offsetWidth; // Trigger reflow
    }
    obstacle.style.animation = `moveObstacle ${200 / obstacleSpeed}s linear infinite`;

    gameInterval = setInterval(gameLoop, 10); // Check collision and update score
}

function jump() {
    if (!isJumping && !gameOver) {
        isJumping = true;
        character.classList.add('jump');
        setTimeout(() => {
            character.classList.remove('jump');
            isJumping = false;
        }, 600); // Same duration as the CSS animation
    }
}

function checkCollision() {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();

    // Adjust rects relative to the game container
    const charLeft = characterRect.left - gameContainerRect.left;
    const charBottom = gameContainerRect.bottom - characterRect.bottom;
    const obstacleLeft = obstacleRect.left - gameContainerRect.left;
    const obstacleBottom = gameContainerRect.bottom - obstacleRect.bottom;

    // Check for horizontal and vertical overlap
    if (charLeft < obstacleLeft + obstacleRect.width &&
        charLeft + characterRect.width > obstacleLeft &&
        charBottom < obstacleBottom + obstacleRect.height &&
        charBottom + characterRect.height > obstacleBottom) {
        
        endGame();
    }
}

function updateScore() {
    // Only increment score if obstacle has passed the character
    // This is a simplification; a more robust system might track obstacle crossings
    const obstacleRight = parseInt(getComputedStyle(obstacle).right);
    if (obstacleRight > 50 + character.offsetWidth && obstacleRight < 50 + character.offsetWidth + obstacleSpeed * 10) { // check if just passed
         score++;
         scoreDisplay.textContent = `Score: ${score}`;
         // Increase speed slightly
         if (score % 5 === 0) { // Every 5 points
            obstacleSpeed += 0.2;
            obstacle.style.animation = `moveObstacle ${200 / obstacleSpeed}s linear infinite`;
         }
    }
}


function gameLoop() {
    if (!gameOver) {
        checkCollision();
        // Update score based on obstacle passing.
        // This is a simpler way than checking exact passing.
        // The score update can be improved for more precise scoring.
        const obstacleLeft = parseFloat(getComputedStyle(obstacle).left);
        if (obstacleLeft < 50 && obstacleLeft + obstacle.offsetWidth > 50 - obstacleSpeed && !isJumping) {
            // This is a basic way to check if an obstacle passed.
            // A more accurate scoring would involve tracking individual obstacles.
        }
        updateScore();
    }
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    obstacle.style.animationPlayState = 'paused';
    gameOverDisplay.classList.remove('hidden');
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameOver) {
            startGame();
        } else {
            jump();
        }
    }
});

// Start the game initially
startGame();
