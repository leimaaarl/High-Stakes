class PokerCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        .card {
          cursor:pointer;
          width: 120px;
          height: 180px;
          border: 2px solid #000;
          border-radius: 8px;
          background-color: white;
          font-family: 'Georgia', serif;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px;
          position: relative;
          box-sizing: border-box;
        }
        .card:hover {
            transform: scale(1.05);
        }

        .corner {
          position: absolute;
          font-size: 18px;
          line-height: 1;
        }

        .top-left {
          top: 8px;
          left: 8px;
        }

        .bottom-right {
          bottom: 8px;
          right: 8px;
          transform: rotate(180deg);
        }
        .value{
        position: absolute;
        bottom: 100%;
        left: 0;
        display:none;
        font-size: 16px;
        color: white;
        }
        .center {
          font-size: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: currentColor;
        }
        
      </style>
      <div class="card">
        <div class="corner top-left">
          <div class="number"></div>
          <div class="suit"></div>
        </div>
        <div class="center suit"></div>
        <div class="corner bottom-right">
          <div class="number"></div>
          <div class="suit"></div>
        </div>
        <div class="value"></div>
      </div>
    `;
    }

    connectedCallback() {
        const number = this.getAttribute('number') || '';
        const suit = this.getAttribute('suit') || '';
        const color = this.getAttribute('color') || 'black';
        const value = this.getAttribute('value') || '';
 
        this.shadowRoot.querySelectorAll('.number').forEach(el => el.textContent = number);
        this.shadowRoot.querySelectorAll('.suit').forEach(el => el.textContent = suit);
        this.shadowRoot.querySelector('.value').textContent = value;
        this.shadowRoot.querySelector('.card').style.color = color;
    }
}

customElements.define('poker-card', PokerCard);
