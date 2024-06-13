const cells = document.querySelectorAll(".cell");
const conditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let player1, player2;
const scoreMap = new Map();
let options = ["", "", "", "", "", "", "", "", ""];
let running = false;
let currentPlayer = "X";

document.addEventListener("DOMContentLoaded", () => {
  loadScores();
  initializeGame();
  updateScoreBoard();
});

function reset() {
  options = ["", "", "", "", "", "", "", "", ""];
  running = false;
  cells.forEach((cell) => (cell.textContent = ""));
}

function play() {
  reset();
  initializeGame();
  document.getElementById("text").textContent = `${player1}'s turn`;
}

function initializeGame() {
  currentPlayer = "X";
  player1 = document.getElementById("player1").value || "Player 1";
  player2 = document.getElementById("player2").value || "Player 2";
  running = true;
  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.addEventListener("click", cellClicked);
    cell.setAttribute("cellindex", index);
  });
}

function cellClicked() {
  const cellIndex = this.getAttribute("cellindex");

  if (options[cellIndex] === "" && running) {
    updateCell(this, cellIndex);
    checkWinner();
  }
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWinner() {
  let roundWon = false;
  for (let i = 0; i < conditions.length; i++) {
    const [a, b, c] = conditions[i].map((index) => options[index]);
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    setInterval(resetBoard, 10000);
    const winner = currentPlayer === "X" ? player1 : player2;
    document.getElementById("text").textContent = `${winner} is the winner`;
    if (scoreMap.has(winner)) {
      scoreMap.set(winner, scoreMap.get(winner) + 1);
    } else {
      scoreMap.set(winner, 1);
    }
    saveScores();
    updateScoreBoard();
    running = false;
  } else if (!options.includes("")) {
    document.getElementById("text").textContent = `Draw!`;
    running = false;
  } else {
    changePlayer();
    document.getElementById("text").textContent = `${
      currentPlayer === "X" ? player1 : player2
    }'s turn`;
  }
}

function resetBoard() {
  if (!running) {
    play();
  }
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function updateScoreBoard() {
  const scoreBoardElement = document.getElementById("scoreBoard");
  scoreBoardElement.innerHTML = "";
  scoreMap.forEach((score, player) => {
    const playerScoreElement = document.createElement("div");
    playerScoreElement.setAttribute("class", "playerScore"); // Adding a class for styling

    const playerNameElement = document.createElement("div");
    playerNameElement.setAttribute("class", "playerName");
    playerNameElement.textContent = player;

    const scoreElement = document.createElement("div");
    scoreElement.setAttribute("class", "Score");
    scoreElement.textContent = score;

    playerScoreElement.appendChild(playerNameElement);
    playerScoreElement.appendChild(scoreElement);

    scoreBoardElement.appendChild(playerScoreElement);
  });
}

function saveScores() {
  const scores = Array.from(scoreMap.entries());
  localStorage.setItem("scoreMap", JSON.stringify(scores));
}

function loadScores() {
  const scores = JSON.parse(localStorage.getItem("scoreMap"));
  if (scores) {
    scores.forEach(([player, score]) => {
      scoreMap.set(player, score);
    });
  }
}

function resetScore() {
  document.getElementById("scoreBoard").innerHTML = "";
  scoreMap.clear();
  localStorage.removeItem("scoreMap");
}
