class SimpleCalculator {
  constructor() {
    this.display = '';
    this.result = null;
    this.init();
  }

  init() {
    const calcElement = document.getElementById('calculator');
    if (!calcElement) return;

    calcElement.innerHTML = `
      <i data-lucide="calculator"></i>
      <span id="calcDisplay">0</span>
    `;

    // Add click handler to show calculator modal
    calcElement.addEventListener('click', () => this.showCalculator());
  }

  showCalculator() {
    const modal = document.createElement('div');
    modal.className = 'calc-modal';
    modal.innerHTML = `
      <div class="calc-overlay" id="calcOverlay"></div>
      <div class="calc-container">
        <div class="calc-header">
          <h3>Quick Calculator</h3>
          <button id="calcClose">&times;</button>
        </div>
        <div class="calc-display" id="calcFullDisplay">0</div>
        <div class="calc-buttons">
          <button class="calc-btn clear" data-action="clear">C</button>
          <button class="calc-btn" data-action="backspace">⌫</button>
          <button class="calc-btn operator" data-action="/">÷</button>
          <button class="calc-btn operator" data-action="*">×</button>

          <button class="calc-btn" data-value="7">7</button>
          <button class="calc-btn" data-value="8">8</button>
          <button class="calc-btn" data-value="9">9</button>
          <button class="calc-btn operator" data-action="-">−</button>

          <button class="calc-btn" data-value="4">4</button>
          <button class="calc-btn" data-value="5">5</button>
          <button class="calc-btn" data-value="6">6</button>
          <button class="calc-btn operator" data-action="+">+</button>

          <button class="calc-btn" data-value="1">1</button>
          <button class="calc-btn" data-value="2">2</button>
          <button class="calc-btn" data-value="3">3</button>
          <button class="calc-btn equals" data-action="calculate">=</button>

          <button class="calc-btn zero" data-value="0">0</button>
          <button class="calc-btn" data-value=".">.</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'calcOverlay' || e.target.id === 'calcClose') {
        modal.remove();
      }
    });

    // Button handlers
    modal.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const value = e.target.dataset.value;

        if (action === 'clear') {
          this.display = '';
          this.result = null;
        } else if (action === 'backspace') {
          this.display = this.display.slice(0, -1);
        } else if (action === 'calculate') {
          try {
            this.result = eval(this.display);
            this.display = this.result.toString();
          } catch (err) {
            this.display = 'Error';
          }
        } else if (value) {
          this.display += value;
        } else if (action) {
          this.display += action;
        }

        this.updateCalcDisplay();
      });
    });

    this.updateCalcDisplay();
  }

  updateCalcDisplay() {
    const display = document.getElementById('calcFullDisplay');
    if (display) {
      display.textContent = this.display || '0';
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.calculator = new SimpleCalculator();
});