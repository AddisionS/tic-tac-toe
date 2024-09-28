let originalBoard;
const humanPlayer = 'X';
const aiPlayer = 'O';
const screen = document.getElementById("screen");
const reset = document.getElementById("reset");
const boxes = document.querySelectorAll(".box");
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

startGame();

function startGame() {
    screen.innerHTML = "<br>";
    reset.addEventListener('click', startGame);
    originalBoard = Array(9).fill('');

    boxes.forEach(box => {
        box.textContent = ' ';
        box.classList.remove("win");
        box.addEventListener('click', handleBoxClick);
    });
}

function removeClickListener(id) {
    const target = document.getElementById(id);
    target.removeEventListener('click', handleBoxClick);
}

function handleBoxClick(event) {
    turn(event.target.id, humanPlayer);
    if (checkWin(originalBoard, humanPlayer)) {
        declareResult(humanPlayer);
    } else if (checkTie(originalBoard)) {
        declareTie();
    } else {
        turn(aiMove(), aiPlayer);
        if (checkWin(originalBoard, aiPlayer)) {
            declareResult(aiPlayer);
        } else if (checkTie(originalBoard)) {
            declareTie();
        }
    }
}

function declareResult(player) {
    disableBoard();
    screen.textContent = player === humanPlayer ? "You Win!!!" : "You Lose";
    for (let i = 0; i < winCombos.length; i++) {
        const [a, b, c] = winCombos[i];
        if (originalBoard[a] === player && originalBoard[b] === player && originalBoard[c] === player) {
            document.getElementById(a).classList.add("win");
            document.getElementById(b).classList.add("win");
            document.getElementById(c).classList.add("win");
        }
    }
}

function declareTie() {
    screen.textContent = "It is a Tie";
}

function turn(id, player) {
    originalBoard[id] = player;
    document.getElementById(id).innerText = player;
    removeClickListener(id);
}

function checkTie(board) {
    return board.every(cell => cell !== '');
}

function checkWin(board, player) {
    for (let i = 0; i < winCombos.length; i++) {
        const [a, b, c] = winCombos[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function disableBoard() {
    boxes.forEach(box => {
        box.removeEventListener('click', handleBoxClick);
    });
}

function giveEmptySquares() {
    return originalBoard.map((value, index) => (value === '' ? index : null)).filter(index => index !== null);
}

function bestSpot() {
    return minimax(originalBoard, aiPlayer).index; 
}

function minimax(board, player) {
    var emptyPlaces = giveEmptySquares();

    if (checkWin(board, humanPlayer)) {
        return { score: -10 }; 
    } else if (checkWin(board, aiPlayer)) {
        return { score: 10 }; 
    } else if (emptyPlaces.length === 0) {
        return { score: 0 }; 
    }

    var moves = [];
    for (var i = 0; i < emptyPlaces.length; i++) {
        var move = {};
        move.index = emptyPlaces[i]; 
        board[emptyPlaces[i]] = player; 

        var result;
        if (player === aiPlayer) {
            result = minimax(board, humanPlayer); 
            move.score = result.score;
        } else {
            result = minimax(board, aiPlayer); 
            move.score = result.score;
        }

        board[emptyPlaces[i]] = ''; 
        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i; 
            }
        }
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove]; 
}

function randomMove() {
    let emptySpots = giveEmptySquares();
    let bestPlay = bestSpot();

    emptySpots = emptySpots.filter(place => place !== bestPlay);
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
}

function aiMove() {
    const probability = Math.random();

    if (probability < 0.98) {
        return bestSpot();
    } else {
        return randomMove();
    }
}
