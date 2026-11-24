const symbols = ["🍎", "🐶", "🚀", "🎸", "🍕", "🌈", "⚽", "💎"];

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchedCountEl = document.getElementById("matched-count");
const bestMovesEl = document.getElementById("best-moves");
const statusMessageEl = document.getElementById("status-message");
const restartBtn = document.getElementById("restart-btn");

let firstCard = null;
let secondCard = null;
let isLockBoard = false;
let moves = 0;
let matchedPairs = 0;

function loadBestMoves() {
  const saved = localStorage.getItem("cardMatchBestMoves");
  bestMovesEl.textContent = saved ? `${saved}회` : "-";
}

function saveBestMoves(currentMoves) {
  const saved = localStorage.getItem("cardMatchBestMoves");
  if (!saved || currentMoves < Number(saved)) {
    localStorage.setItem("cardMatchBestMoves", String(currentMoves));
    loadBestMoves();
  }
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createCardElement(symbol) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", "뒤집힌 카드");

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">?</div>
      <div class="card-face card-back">${symbol}</div>
    </div>
  `;

  card.addEventListener("click", () => handleCardClick(card));
  return card;
}

function handleCardClick(card) {
  if (isLockBoard) return;
  if (card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = String(moves);
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    disableMatchedCards();
  } else {
    unflipCards();
  }
}

function disableMatchedCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  matchedPairs++;
  matchedCountEl.textContent = String(matchedPairs);

  resetTurn();

  if (matchedPairs === symbols.length) {
    statusMessageEl.textContent = `🎉 축하합니다! ${moves}번 만에 모든 짝을 맞췄어요!`;
    statusMessageEl.className = "status-message win";
    saveBestMoves(moves);
  }
}

function unflipCards() {
  isLockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 800);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  isLockBoard = false;
}

function initGame() {
  firstCard = null;
  secondCard = null;
  isLockBoard = false;
  moves = 0;
  matchedPairs = 0;

  movesEl.textContent = "0";
  matchedCountEl.textContent = "0";
  statusMessageEl.textContent = "카드를 눌러 같은 그림 8쌍을 찾아보세요!";
  statusMessageEl.className = "status-message";

  const deck = shuffle([...symbols, ...symbols]);
  boardEl.innerHTML = "";
  deck.forEach((symbol) => {
    boardEl.appendChild(createCardElement(symbol));
  });
}

restartBtn.addEventListener("click", initGame);

loadBestMoves();
initGame();