const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 200,
    y: 500,
    width: 40,
    height: 60,
    lane: 1,
    jump: false,
    jumpHeight: 0
};

const lanes = [100, 200, 300]; // x positions of lanes
let obstacles = [];
let coins = [];
let score = 0;
let speed = 5;

document.getElementById('score').innerText = `Score: ${score}`;

// Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.lane > 0) {
        player.lane--;
    }
    if (e.key === 'ArrowRight' && player.lane < 2) {
        player.lane++;
    }
    if (e.key === 'ArrowUp' && !player.jump) {
        player.jump = true;
        player.jumpHeight = 0;
    }
});

// Spawn obstacles
function spawnObstacle() {
    const lane = Math.floor(Math.random() * 3);
    obstacles.push({
        x: lanes[lane],
        y: -50,
        width: 40,
        height: 50
    });
}

// Spawn coins
function spawnCoin() {
    const lane = Math.floor(Math.random() * 3);
    coins.push({
        x: lanes[lane] + 10,
        y: -30,
        width: 20,
        height: 20
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player to lane
    player.x = lanes[player.lane];

    // Jump logic
    if (player.jump) {
        player.jumpHeight += 10;
        player.y -= 15;
        if (player.jumpHeight >= 60) {
            player.jump = false;
        }
    } else if (player.y < 500) {
        player.y += 15;
    }

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Move and draw obstacles
    obstacles.forEach((obs, index) => {
        obs.y += speed;
        ctx.fillStyle = 'black';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Collision detection
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

    // Move and draw coins
    coins.forEach((coin, index) => {
        coin.y += speed;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);

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
    obstacles = [];
    coins = [];
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
    player.y = 500;
    player.lane = 1;
}

// Spawn intervals
setInterval(spawnObstacle, 1500);
setInterval(spawnCoin, 1000);

gameLoop();
