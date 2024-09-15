const canvas = document.getElementById('sandCanvas');
const ctx = canvas.getContext('2d');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const gravityInput = document.getElementById('gravity');
const redInput = document.getElementById('red');
const greenInput = document.getElementById('green');
const blueInput = document.getElementById('blue');
const themeSelect = document.getElementById('theme');

let width = 400;
let height = 400;
const pixelSize = 4;
let cols, rows;

// TODO: Set this back to 0.4 when done developing
let gravity = 1.0; // Default gravity value
const maxVelocity = 4; // Maximum fall speed

let sandColor = 'rgb(194, 178, 128)'; // Default sand color

// Modify the grid to store objects instead of just 0 or 1
let grid = new Array(cols).fill(null).map(() => new Array(rows).fill(null));

let isActive = false;
let animationFrameId = null;

function initializeGrid() {
    cols = Math.floor(width / pixelSize);
    rows = Math.floor(height / pixelSize);
    grid = new Array(cols).fill(null).map(() => new Array(rows).fill(null));
}

function resizeCanvas() {
    canvas.width = width;
    canvas.height = height;
    initializeGrid();
    draw();
}

widthInput.addEventListener('change', () => {
    width = Math.max(400, Math.min(800, parseInt(widthInput.value)));
    widthInput.value = width;
    resizeCanvas();
});

heightInput.addEventListener('change', () => {
    height = Math.max(400, Math.min(800, parseInt(heightInput.value)));
    heightInput.value = height;
    resizeCanvas();
});

// Update the initial value of the gravity input
gravityInput.value = gravity.toFixed(1);

gravityInput.addEventListener('change', () => {
    gravity = Math.max(0.1, Math.min(1.0, parseFloat(gravityInput.value)));
    gravityInput.value = gravity.toFixed(1);
});

function updateSandColor() {
    const r = Math.max(0, Math.min(255, parseInt(redInput.value)));
    const g = Math.max(0, Math.min(255, parseInt(greenInput.value)));
    const b = Math.max(0, Math.min(255, parseInt(blueInput.value)));
    sandColor = `rgb(${r}, ${g}, ${b})`;
    redInput.value = r;
    greenInput.value = g;
    blueInput.value = b;
}

redInput.addEventListener('change', updateSandColor);
greenInput.addEventListener('change', updateSandColor);
blueInput.addEventListener('change', updateSandColor);

let isDarkTheme = true; // Set initial theme to dark

function toggleTheme() {
    isDarkTheme = themeSelect.value === 'dark';
    document.body.classList.toggle('dark-theme', isDarkTheme);
    document.body.classList.toggle('light-theme', !isDarkTheme);
    draw(); // Redraw the canvas with the new background color
}

themeSelect.addEventListener('change', toggleTheme);

function draw() {
    ctx.fillStyle = isDarkTheme ? '#000000' : '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j]) {
                ctx.fillStyle = grid[i][j].color;
                ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

// Initialize the canvas with the correct background color
draw();

function update() {
    let changed = false;
    for (let i = 0; i < cols; i++) {
        for (let j = rows - 1; j >= 0; j--) {
            if (grid[i][j]) {
                let particle = grid[i][j];
                particle.velocity = Math.min(particle.velocity + gravity, maxVelocity);
                let newY = j + Math.floor(particle.velocity);

                if (newY < rows && !grid[i][newY]) {
                    grid[i][j] = null;
                    grid[i][newY] = particle;
                    changed = true;
                } else {
                    newY = j + 1;
                    if (newY < rows && !grid[i][newY]) {
                        grid[i][j] = null;
                        grid[i][newY] = particle;
                        changed = true;
                    } else if (newY < rows) {
                        if (i - 1 >= 0 && !grid[i - 1][newY]) {
                            grid[i][j] = null;
                            grid[i - 1][newY] = particle;
                            changed = true;
                        } else if (i + 1 < cols && !grid[i + 1][newY]) {
                            grid[i][j] = null;
                            grid[i + 1][newY] = particle;
                            changed = true;
                        } else {
                            particle.velocity = 0;
                        }
                    }
                }
            }
        }
    }
    return changed;
}

function addSand(x, y) {
    const i = Math.floor(x / pixelSize);
    const j = Math.floor(y / pixelSize);
    if (i >= 0 && i < cols && j >= 0 && j < rows && !grid[i][j]) {
        grid[i][j] = { velocity: 0, color: sandColor };
        if (!isActive) {
            isActive = true;
            gameLoop();
        }
    }
}

let isMouseDown = false;
let lastSandAddTime = 0;
const sandAddInterval = 30; // Time between sand additions in milliseconds
let lastMouseX, lastMouseY;

function addSandConstantly() {
    const currentTime = Date.now();
    if (currentTime - lastSandAddTime > sandAddInterval) {
        addSand(lastMouseX, lastMouseY);
        lastSandAddTime = currentTime;
    }
}

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    lastMouseX = e.offsetX;
    lastMouseY = e.offsetY;
    addSand(lastMouseX, lastMouseY);
    lastSandAddTime = Date.now();
    requestAnimationFrame(continuousAddSand);
});

canvas.addEventListener('mousemove', (e) => {
    lastMouseX = e.offsetX;
    lastMouseY = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
});

function continuousAddSand() {
    if (isMouseDown) {
        addSandConstantly();
        requestAnimationFrame(continuousAddSand);
    }
}

function log() {
    console.log('I am logging');
}

function gameLoop() {
    const changed = update();
    draw();
    
    if (changed || isMouseDown) {
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        isActive = false;
        animationFrameId = null;
    }
    // log();
}

// Initialize the canvas
initializeGrid();
resizeCanvas();

// Start the game loop
gameLoop();
