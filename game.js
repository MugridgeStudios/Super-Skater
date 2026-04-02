const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
const lanes = [100, 200, 300];

// Load sprites
const playerImg = new Image();
playerImg.src = 'assets/images/player.png'; // your player sprite

const coinImg = new Image();
coinImg.src = 'assets/images/coin.png'; // coin sprite

const trainImg = new Image();
trainImg.src = 'assets/images/train.png'; // obstacle sprite

const bgImg = new Image();
bgImg.src = 'assets/images/track_bg.jpg'; // background image

// Player object
const player = {
    x: lanes[1],
    y: 500,
    width: 40,
    height: 60,
    lane: 1,
    isJumping: false,
    jumpY: 0
};

let obstacles = [];
let coins = [];
let bgY = 0;
let speed = 6;

// Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.lane > 0) player.lane--;
    if (e.key === 'ArrowRight' && player.lane < 2) player.lane++;
    if (e.key === 'ArrowUp' && !player.isJumping) {
        player.isJumping = true;
        player.jumpY = 0;
    }
});

// Spawn obstacle
function spawnObstacle() {
    const lane = Math.floor(Math.random() * 3);
    obstacles.push({
        x: lanes[lane],
        y: -50,
        width: 50,
        height: 50
    });
}

// Spawn coin
function spawnCoin() {
    const lane = Math.floor(Math.random() * 3);
    coins.push({
        x: lanes[lane] + 5,
        y: -30,
        width: 30,
        height: 30
    });
}

// Game loop
function gameLoop() {
    // Move background
    bgY += speed;
    if (bgY >= canvas.height) bgY = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw scrolling background
    ctx.drawImage(bgImg, 0, bgY - canvas.height, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, bgY, canvas.width, canvas.height);

    // Move player to lane
    player.x = lanes[player.lane];

    // Jump logic
    if (player.isJumping) {
        player.jumpY += 10;
        player.y -= 15;
        if (player.jumpY >= 60) player.isJumping = false;
    } else if (player.y < 500) {
        player.y += 15;
    }

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Move obstacles
    obstacles.forEach((obs, index) => {
        obs.y += speed;
        ctx.drawImage(trainImg, obs.x, obs.y, obs.width, obs.height);

        // Collision
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            alert(`Game Over! Score: ${score}`);
            resetGame();
        }

        if (obs.y > canvas.height) obstacles.splice(index, 1);
    });

    // Move coins
    coins.forEach((coin, index) => {
        coin.y += speed;
        ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);

        // Collect coin
        if (
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y
        ) {
            score += 10;
            document.getElementById('score').innerText = `Score: ${score}`;
            coins.splice(index, 1);
        }

        if (coin.y > canvas.height) coins.splice(index, 1);
    });

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
    obstacles = [];
    coins = [];
    player.y = 500;
    player.lane = 1;
}

// Spawn intervals
setInterval(spawnObstacle, 2000);
setInterval(spawnCoin, 1200);

gameLoop();
