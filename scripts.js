const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const rows = 50;
const cols = 50;
let interval = 100;  // 初期値は100ミリ秒

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = createGrid();
let running = false;

function createGrid() {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.fillStyle = grid[row][col] ? '#000' : '#fff';
            ctx.fill();
            ctx.stroke();
        }
    }
}

function getNextGeneration(grid) {
    const nextGen = grid.map(arr => [...arr]);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const aliveNeighbors = countAliveNeighbors(grid, row, col);
            if (grid[row][col] === 1) {
                if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                    nextGen[row][col] = 0;
                }
            } else {
                if (aliveNeighbors === 3) {
                    nextGen[row][col] = 1;
                }
            }
        }
    }
    return nextGen;
}

function countAliveNeighbors(grid, row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x = row + i;
            const y = col + j;
            if (x >= 0 && x < rows && y >= 0 && y < cols) {
                count += grid[x][y];
            }
        }
    }
    return count;
}

function update() {
    if (!running) return;
    grid = getNextGeneration(grid);
    drawGrid();
    setTimeout(update, interval);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    grid[y][x] = grid[y][x] ? 0 : 1;
    drawGrid();
});

document.getElementById('startButton').addEventListener('click', () => {
    running = !running;
    if (running) {
        update();
    }
});

document.getElementById('interval').addEventListener('input', (e) => {
    interval = parseInt(e.target.value, 10);
});

drawGrid();
