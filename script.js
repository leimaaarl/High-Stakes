const suits = ["♠", "♥", "♦", "♣"];
const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suitColors = {
    "♠": "black",
    "♣": "black",
    "♥": "red",
    "♦": "red"
};

const comboBonuses = {
      "royal flush": 50,
      "straight flush": 40,
      "four of a kind": 30,
      "full house": 25,
      "flush": 20,
      "straight": 15,
      "3 of a kind": 10,
      "2 of a kind": 5
    };

const inputedCards = document.querySelector(".card-container-input");
const userCards = document.querySelector(".card-container-user");
const endTurnBtn = document.getElementById("end-turn-btn");
const scoreLabel = document.getElementById("score-label");
const roundLabel = document.getElementById("round-label");

let cardCount = 0;
let score = 0;
let round = 1;

let userDeck = [];
let tableCards = [];

const rankMap = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
    "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 14
};

function createUniqueCard(existingCards) {
    while (true) {
        const number = numbers[Math.floor(Math.random() * numbers.length)];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const color = suitColors[suit];
        const key = `${number}-${suit}`;

        if (!existingCards.some(c => c.number === number && c.suit === suit)) {
            return { number, suit, color, value: getCardValue(number) };
        }
    }
}

function getCardValue(number) {
    if (number === "A") return 13;
    if (["J", "Q", "K"].includes(number)) return 10;
    return parseInt(number);
}

function createUserDeck() {
    userDeck = [];
    while (userDeck.length < 7) {
        userDeck.push(createUniqueCard(userDeck));
    }
    renderUserCards();
}

function renderUserCards() {
    userCards.innerHTML = "";
    for (const card of userDeck) {
        const cardEl = createCardElement(card);
        addCardClickListener(cardEl);
        userCards.appendChild(cardEl);
    }
}

function createCardElement(card) {
    const cardEl = document.createElement("poker-card");
    cardEl.setAttribute("number", card.number);
    cardEl.setAttribute("suit", card.suit);
    cardEl.setAttribute("color", card.color);
    cardEl.setAttribute("value", `+${card.value}`);
    cardEl.setAttribute("status", "user");
    return cardEl;
}

function addCardClickListener(cardEl) {
    cardEl.addEventListener("click", () => {
        const status = cardEl.getAttribute("status");

        if (status === "user") {
            if (cardCount < 5) {

                cardEl.setAttribute("status", "table");
                inputedCards.appendChild(cardEl);
                userDeck = userDeck.filter(c => !(c.number === cardEl.getAttribute("number") && c.suit === cardEl.getAttribute("suit")));
                cardCount++;
                if (cardCount === 5) endTurnBtn.style.display = "block";
            }
        } else if (status === "table") {

            cardEl.setAttribute("status", "user");
            userCards.appendChild(cardEl);
            userDeck.push({
                number: cardEl.getAttribute("number"),
                suit: cardEl.getAttribute("suit"),
                color: cardEl.getAttribute("color"),
                value: getCardValue(cardEl.getAttribute("number"))
            });
            cardCount--;
            if (cardCount < 5) endTurnBtn.style.display = "none";
        }
    });
}

function evaluateHand(cards) {
    if (cards.length !== 5) throw new Error("Hand must contain exactly 5 cards");

    const cardsMapped = cards.map(({ number, suit }) => ({ number, suit }));

    const numbers = cardsMapped.map(c => rankMap[c.number]).sort((a, b) => a - b);

    const flush = cardsMapped.every(c => c.suit === cardsMapped[0].suit);

    function isStraight(nums) {
        const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
        if (uniqueNums.length !== 5) return false;

        let isNormalStraight = uniqueNums.every((num, idx) => idx === 0 || num === uniqueNums[idx - 1] + 1);

        if (uniqueNums.includes(14)) {
            const aceLow = uniqueNums.map(n => (n === 14 ? 1 : n)).sort((a, b) => a - b);
            let isAceLowStraight = aceLow.every((num, idx) => idx === 0 || num === aceLow[idx - 1] + 1);
            return isNormalStraight || isAceLowStraight;
        }
        return isNormalStraight;
    }

    const straight = isStraight(numbers);

    const countMap = {};
    for (const card of cardsMapped) {
        countMap[card.number] = (countMap[card.number] || 0) + 1;
    }

    const counts = Object.values(countMap);
    const pairsCount = counts.filter(c => c === 2).length;
    const isFourOfAKind = counts.includes(4);
    const isThreeOfAKind = counts.includes(3);
    const isFullHouse = isThreeOfAKind && pairsCount === 1;

    const isRoyalFlush = flush && straight && numbers[0] === 10;

    const results = [];
    if (isRoyalFlush) {
        results.push("royal flush");
    } else if (flush && straight) {
        results.push("straight flush");
    } else if (isFourOfAKind) {
        results.push("four of a kind");
    } else if (isFullHouse) {
        results.push("full house");
    } else if (flush) {
        results.push("flush");
    } else if (straight) {
        results.push("straight");
    } else {
        if (isThreeOfAKind) results.push("3 of a kind");
        for (let i = 0; i < pairsCount; i++) {
            results.push("2 of a kind");
        }
    }
    return results;
}

function calculateCardValue(combos) {
    let value = 0;
    const cards = Array.from(inputedCards.querySelectorAll("poker-card"));
    cards.forEach(card => {
        value += parseInt(card.getAttribute("value"));
    });

    if (Array.isArray(combos)) {
        const comboCounts = {};
        combos.forEach(c => comboCounts[c] = (comboCounts[c] || 0) + 1);

        for (const [combo, count] of Object.entries(comboCounts)) {
            const bonus = comboBonuses[combo.toLowerCase()] || 0;
            value += bonus * count;
        }
    }

    return value;
}

function handleEndTurn() {
  if (cardCount < 5) return;

  userCards.style.pointerEvents = "none";
  inputedCards.style.pointerEvents = "none";

  const cardsOnTable = Array.from(inputedCards.querySelectorAll("poker-card")).map(card => ({
    number: card.getAttribute("number"),
    suit: card.getAttribute("suit")
  }));

  const handResult = evaluateHand(cardsOnTable);

  let comboDisplay = "";

  if (Array.isArray(handResult)) {
    const comboCounts = {};
    handResult.forEach(c => comboCounts[c] = (comboCounts[c] || 0) + 1);

    comboDisplay = handResult.map(combo => {
      const bonus = comboBonuses[combo.toLowerCase()] || 0;
      const count = comboCounts[combo];
      comboCounts[combo] = 0; // Prevent repetition
      return count > 0 ? `${combo.toUpperCase()} +${bonus * count}` : '';
    }).filter(Boolean).join(" | ");
  } else {
    comboDisplay = String(handResult).toUpperCase();
  }

  inputedCards.innerHTML += `<h1 id="combo-label">${comboDisplay}</h1>`;

  score += calculateCardValue(handResult);
  scoreLabel.textContent = `${score}`;

  round++;
  cardCount = 0;
  endTurnBtn.style.display = "none";

  inputedCards.querySelectorAll("poker-card").forEach(card => {
    const valueEl = card.shadowRoot?.querySelector(".value");
    if (valueEl) {
      valueEl.style.display = "block";
    }
  });

  setTimeout(() => {
    inputedCards.innerHTML = "";
    createUserDeck();

    if (round > 3) {
      const status = score >= 100 ? "You win!" : "You lose!";
      const scorePopup = document.createElement("score-window");
      document.body.appendChild(scorePopup);
      scorePopup.updateScore(score, status);

      round = 1;
      score = 0;
      scoreLabel.textContent = `${score}`;
    }

    roundLabel.textContent = `${round}`;
    userCards.style.pointerEvents = "auto";
    inputedCards.style.pointerEvents = "auto";
  }, 2000);
}

endTurnBtn.style.display = "none";

endTurnBtn.addEventListener("click", handleEndTurn);

createUserDeck();
