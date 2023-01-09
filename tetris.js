const game_board = document.getElementById('board');
const game_ctx = game_board.getContext('2d');
const board_grid = 32;
const tetroSequence = []
let play_btn = document.getElementById('play_btn')
let pause_btn = document.getElementById('pause_btn')

let gameScore = 0;

function scoreUpadte() {
    gameScore += 5;
}

const KEY = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80,
    Q: 81
};

const COLORS = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
}

const SHAPES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'O': [
        [1, 1],
        [1, 1]

    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ]
}

const playingField = []

// function to get random integer
const randomInteger = (x, y) => {
    x = Math.ceil(x);
    y = Math.floor(y);

    rand = Math.floor(Math.random() * (y - x + 1)) + x;
    return rand;
}

// Function to generate fresh tetro sequence
const newTetroSequence = () => {
    const shapeList = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (shapeList.length) {
        const num = randomInteger(0, shapeList.length - 1);
        const shape = shapeList.splice(num, 1)[0];
        tetroSequence.push(shape);
    }
}

// Function to get the next sequence
const next_tetroSeq = () => {
    console.log(tetroSequence)
    if (tetroSequence.length === 0) {
        newTetroSequence();
    }
    const name = tetroSequence.pop();
    const tetroShape = SHAPES[name];
    // start at center
    const column = playingField[0].length / 2 - Math.ceil(tetroShape[0].length / 2)
    const row = name === 'I' ? -1 : -2;
    //console.log(tetroShape) // next tetro
    return {
        name: name,
        tetroShape: tetroShape,
        row: row,
        column: column
    }
}

// Function to rotate by 90 degrees
const tetroRotate = (shape) => {
    const length = shape.length - 1;
    const result = shape.map((row, j) => row.map((x, y) => shape[length - y][j]));
    return result;
}

// Function to check if new shape is valid
const tetroIsValid = (shape, cellRow, cellCol) => {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] && (
                    cellCol + j < 0 || cellCol + j >= playingField[0].length || cellRow + i >= playingField.length || playingField[cellRow + i][cellCol + j]
                )) {
                return false;
            }
        }
    }
    return true;
}

// Function to check placing
const tetroPlacing = () => {
    for (let i = 0; i < next_tetro.tetroShape.length; i++) {
        for (let j = 0; j < next_tetro.tetroShape[i].length; j++) {
            if (next_tetro.tetroShape[i][j]) {
                if (next_tetro.row + i < 0) {
                    return gameIsOver();
                }
                playingField[next_tetro.row + i][next_tetro.column + j] = next_tetro.name;
            }
        }
    }

    // Function to check if line clears from the bottom
    for (let i = playingField.length - 1; i >= 0;) {
        if (playingField[i].every(cell => !!cell)) {

            for (let j = i; j >= 0; j--) {
                for (let k = 0; k < playingField[j].length; k++) {
                    playingField[j][k] = playingField[j - 1][k]
                }
            }
            scoreUpadte();
        } else {
            i--;
        }
    }
    next_tetro = next_tetroSeq()
    console.log(next_tetro) // next tetro
}

// Function for game over
const gameIsOver = () => {
    cancelAnimationFrame(animateFrame);

    //game_ctx.fillStyle = 'black';
    game_ctx.globalAlpha = 0.75;
    game_ctx.fillText(0, game_board.height / 2 - 30, game_board.width, 60);

    game_ctx.globalAlpha = 0.75;
    game_ctx.fillStyle = 'red';
    game_ctx.font = '40px monospace';
    game_ctx.textAlign = 'center';
    game_ctx.textBaseline = 'middle';
    game_ctx.fillText('Game Is Over', game_board.width / 2, game_board.height / 2);
    endOfGame = true;
}

// Function for pausing game
const pauseGame = () => {
    pause = true;
    cancelAnimationFrame(animateFrame);
    game_ctx.fillStyle = 'black';
    game_ctx.globalAlpha = 0.75;

    
    game_ctx.globalAlpha = 1;
    game_ctx.fillStyle = 'orange';
    game_ctx.font = '40px monospace';
    game_ctx.textAlign = 'center';
    game_ctx.textBaseline = 'middle';
    game_ctx.fillText('Game Paused', game_board.width / 2, game_board.height / 2);
    play_btn.style.display = 'block'
    pause_btn.style.display = 'none'
}

// Function for game play
const playGame = () => {
    if (!pause) {
        return;
    }
    play_btn.style.display = 'none'
    pause_btn.style.display = 'block'
    animateFrame = requestAnimationFrame(runtime);
    if (endOfGame) {
        endOfGame = false;
        animateFrame = null;
        runtime()
    }
    pause = false
}

// Loop to populate empty state
for (let i = -2; i < 20; i++) {
    playingField[i] = [];

    for (let j = 0; j < 10; j++) {
        playingField[i][j] = 0;
    }
}

let next_tetro = next_tetroSeq();
let pause = true;
let endOfGame = false;
let c = 0;
let animateFrame = null;

// Function for Runtime
const runtime = () => {
    animateFrame = requestAnimationFrame(runtime);
    game_ctx.clearRect(0, 0, game_board.width, game_board.height);
    document.getElementById('score').innerHTML = gameScore;
    if (endOfGame) return;
    if (pause) return;

    // Loop to draw the arena
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if (playingField[i][j]) {
                const indicator = playingField[i][j];
                game_ctx.fillStyle = COLORS[indicator];
                game_ctx.fillRect(j * board_grid, i * board_grid, board_grid - 1, board_grid - 1);
            }
        }
    }

    // Condition for next tetro
    if (next_tetro) {
        if (++c > 35) {
            next_tetro.row++;
            c = 0;

            if (!tetroIsValid(next_tetro.tetroShape, next_tetro.row, next_tetro.column)) {
                next_tetro.row--;
                tetroPlacing();
            }

        }

        game_ctx.fillStyle = COLORS[next_tetro.name];

        for (let i = 0; i < next_tetro.tetroShape.length; i++) {
            for (let j = 0; j < next_tetro.tetroShape[i].length; j++) {
                if (next_tetro.tetroShape[i][j]) {
                    game_ctx.fillRect((next_tetro.column + j) * board_grid, (next_tetro.row + i) * board_grid, board_grid - 1, board_grid - 1);
                }
            }
        }
    }
}

// Function for Bar Drop
const spaceBarDrop = () => {
    var row = next_tetro.row + 1;
    while (tetroIsValid(next_tetro.tetroShape, row, next_tetro.column)) {
        row++;
    }
    if (!tetroIsValid(next_tetro.tetroShape, row, next_tetro.column)) {
        next_tetro.row = row - 1;

        tetroPlacing();
        return;
    }

    next_tetro.row = row;
}

document.addEventListener('keydown', function(e) {
    // left and right positions
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.RIGHT) {
        const col = e.keyCode === KEY.LEFT ?
            next_tetro.column - 1 :
            next_tetro.column + 1;

        if (tetroIsValid(next_tetro.tetroShape, next_tetro.row, col)) {
            next_tetro.column = col;
        }
    }

    // up arrow position
    if (e.keyCode === KEY.UP) {
        const mat = tetroRotate(next_tetro.tetroShape);
        if (tetroIsValid(mat, next_tetro.row, next_tetro.column)) {
            next_tetro.tetroShape = mat
        }
    }

    // down arrow position
    if (e.keyCode === KEY.DOWN) {
        const row = next_tetro.row + 1;
        if (!tetroIsValid(next_tetro.tetroShape, row, next_tetro.column)) {
            next_tetro.row = row - 1;

            tetroPlacing();
            return;
        }

        next_tetro.row = row;
    }
    if (e.keyCode === KEY.SPACE && !endOfGame && !pause)
        spaceBarDrop();

    //pause
    if (e.keyCode === KEY.P && !endOfGame && !pause)
        pauseGame();

    // game end
    if (e.keyCode === KEY.ESC)
        gameIsOver();
});