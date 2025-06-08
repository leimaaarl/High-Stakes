class ScoreWindow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .score-window {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 250px;
                    padding: 20px;
                    background-color: rgba(255, 255, 255, 0.95);
                    border: 2px solid #000;
                    border-radius: 10px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Arial', sans-serif;
                    z-index: 1000;
                }
                .score {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                button {
                    padding: 10px 16px;
                    font-size: 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #45a049;
                }
            </style>
            <div class="score-window">
                <div class="status"><span id="status"></span></div>
                <div class="score">Score: <span id="score">0</span></div>
                <button id="play-again">Play Again</button>
            </div>
        `;
    }

    connectedCallback() {
        this.scoreElement = this.shadowRoot.querySelector('#score');
        this.statusElement = this.shadowRoot.querySelector('#status');
        this.updateScore(0);

        const playAgainBtn = this.shadowRoot.querySelector('#play-again');
        playAgainBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    updateScore(value, status) {
        this.scoreElement.textContent = value;
        this.statusElement.textContent = status || '';
    }
}

customElements.define('score-window', ScoreWindow);