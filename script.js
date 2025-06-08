const suits = ["♠", "♥", "♦", "♣"];
const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const colors = ["black", "red"];
const inputedCards = document.querySelector(".card-container-input");
const userCards = document.querySelector(".card-container-user");
var cardCount = 1;
var score = 0;
var round = 1;

function createCard() {
    while (userCards.children.length <= 6) {
        const card = document.createElement("poker-card");
        const number = numbers[Math.floor(Math.random() * numbers.length)];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        if (!userCards.querySelector(`[number="${number}"][suit="${suit}"][color="${color}"]`)) {
            card.setAttribute("status", "user");
            card.setAttribute("number", number);
            card.setAttribute("suit", suit);
            card.setAttribute("color", color);

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
            document.getElementById("end-turn-btn").style.display = "none";
            card.setAttribute("status", "user");
            userCards.appendChild(card);
            if (inputedCards.contains(card)) inputedCards.removeChild(card);
            cardCount--;
        }
    });
}

function calculateCardValue() {
    var value = 0;
    const cards = inputedCards.querySelectorAll("poker-card");
    cards.forEach(card => {
        const number = card.getAttribute("number");
        if (number === "A") {
            value += 13;
        } else if (["J", "Q", "K"].includes(number)) {
            value += 10;
        } else {
            value += parseInt(number);
        }
    });

    return value;
}

function handleEndTurn() {
    round++;
    score += calculateCardValue();
    document.getElementById("score-label").textContent = `${score}`;
    inputedCards.innerHTML = "";
    if (round >= 4) {
        const scorePopup = document.createElement("score-window");
        document.body.appendChild(scorePopup);

        var status = score >= 100 ? "You win!" : "You lose!";
        scorePopup.updateScore(score, status);
        return;
    } else {
        document.getElementById("round-label").textContent = `${round}`;
        cardCount = 1;
        createCard();
    }

}

document.querySelectorAll("poker-card").forEach(addCardClickListener);
document.getElementById("end-turn-btn").addEventListener("click", handleEndTurn);
createCard();
