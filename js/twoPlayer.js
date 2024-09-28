let board;
let currentPlayer;
const screen = document.getElementById("screen");
const reset = document.getElementById("reset");
const boxes = document.querySelectorAll(".box");
const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

startGame();

function startGame() {
    reset.addEventListener('click', startGame);
    board = Array(9).fill('');
    currentPlayer = "X";
    screen.textContent = `${currentPlayer}'s Turn`;

    boxes.forEach(box => {
        box.textContent = ' ';
        box.classList.remove("win");
        box.addEventListener('click', handleBoxClick);
    });
}

function handleBoxClick(event) {
    const boxIndex = event.target.id; 
    board[boxIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    removeClickListener(boxIndex);
    
    if (checkWin()) {
        screen.textContent = `${currentPlayer} Won!!!`;
        disableBoard();
    } else if (checkTie()) {
        screen.textContent = "It is a Tie";
    } else {
        currentPlayer = changeCurrentPlayer();
        screen.textContent = `${currentPlayer}'s Turn`;
    }
}

function changeCurrentPlayer() {
    return currentPlayer === 'X' ? 'O' : 'X';
}

function removeClickListener(id) {
    const target = document.getElementById(id);
    target.removeEventListener('click', handleBoxClick);
}

function disableBoard() {
    boxes.forEach(box => {
        box.removeEventListener('click', handleBoxClick);
    });
}

function checkWin() {
    for (i = 0; i < winCombos.length; i++) {
        const [a,b,c] = winCombos[i];
        if (board[a] === currentPlayer && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById(a).classList.add("win");
            document.getElementById(b).classList.add("win");
            document.getElementById(c).classList.add("win");
            return true;
        }
    }
    return false;
}

function checkTie() {
    return board.every(cell => cell !== '');
}
