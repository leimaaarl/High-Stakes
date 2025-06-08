const suits = ["♠", "♥", "♦", "♣"];
const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const colors = ["black", "red"];
const inputedCards = document.querySelector(".card-container-input");
const userCards = document.querySelector(".card-container-user");
var cardCount = 1;
var score = 0;
var round = 1;

function getCardValue(number) {
    if (number === "A") return 13;
    if (["J", "Q", "K"].includes(number)) return 10;
    return parseInt(number);
}

function createCard() {
    document.getElementById("end-turn-btn").style.display = "none";
    while (userCards.children.length <= 6) {
        const card = document.createElement("poker-card");
        const number = numbers[Math.floor(Math.random() * numbers.length)];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        if (!userCards.querySelector(`[number="${number}"][suit="${suit}"][color="${color}"]`)) {
            const value = getCardValue(number);
            card.setAttribute("status", "user");
            card.setAttribute("number", number);
            card.setAttribute("suit", suit);
            card.setAttribute("color", color);
            card.setAttribute("value", `+${value}`);
            addCardClickListener(card);
            userCards.appendChild(card);
        }
    }
}

function addCardClickListener(card) {
    card.addEventListener("click", function () {
        const currentStatus = card.getAttribute("status");
        if (cardCount >= 5) {
            document.getElementById("end-turn-btn").style.display = "block";
        }

        if (currentStatus === "user") {
            if (cardCount <= 5 &&
                !inputedCards.querySelector(`[number="${card.getAttribute("number")}"][suit="${card.getAttribute("suit")}"][status="table"][color="${card.getAttribute("color")}"]`)) {

                card.setAttribute("status", "table");
                inputedCards.appendChild(card);
                if (userCards.contains(card)) userCards.removeChild(card);
                cardCount++;
            }
        } else if (currentStatus === "table") {
            card.setAttribute("status", "user");
            userCards.appendChild(card);
            if (inputedCards.contains(card)) inputedCards.removeChild(card);
            cardCount--;
        }
    });
}

function calculateCardValue() {
    let value = 0;
    const cards = inputedCards.querySelectorAll("poker-card");
    cards.forEach(card => {
        value += parseInt(card.getAttribute("value"));
    });
    return value;
}

function handleEndTurn() {
    round++;
    score += calculateCardValue();
    document.getElementById("score-label").textContent = `${score}`;
    if (round >= 4) {
        const scorePopup = document.createElement("score-window");
        document.body.appendChild(scorePopup);
        const status = score >= 100 ? "You win!" : "You lose!";
        scorePopup.updateScore(score, status);
        return;
    } else {
        inputedCards.querySelectorAll("poker-card").forEach(card => {
            const valueEl = card.shadowRoot?.querySelector(".value");
            if (valueEl) {
                valueEl.style.display = "block";
            }
        });
        setTimeout(() => {
            inputedCards.innerHTML = "";
            document.getElementById("round-label").textContent = `${round}`;
            cardCount = 1;
            createCard();
        }, 2000);
    }
}

document.querySelectorAll("poker-card").forEach(addCardClickListener);
document.getElementById("end-turn-btn").addEventListener("click", handleEndTurn);
createCard();
