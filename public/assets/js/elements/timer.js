class StudyTimer {
  constructor() {
    this.isRunning = false;
    this.startTime = null;
    this.elapsedTime = 0;
    this.interval = null;
    this.displayElement = document.getElementById('studyTimer');
    this.init();
  }

  init() {
    if (!this.displayElement) return;

    this.displayElement.innerHTML = `
      <i data-lucide="timer"></i>
      <span id="timerDisplay">00:00:00</span>
      <button id="timerToggle" class="timer-btn">Start</button>
    `;

    document.getElementById('timerToggle').addEventListener('click', () => this.toggle());
    this.updateDisplay();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = Date.now() - this.elapsedTime;
      this.interval = setInterval(() => this.updateDisplay(), 1000);
      document.getElementById('timerToggle').textContent = 'Pause';
      document.getElementById('timerToggle').classList.add('active');
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      this.elapsedTime = Date.now() - this.startTime;
      clearInterval(this.interval);
      document.getElementById('timerToggle').textContent = 'Resume';
      document.getElementById('timerToggle').classList.remove('active');
    }
  }

  reset() {
    this.pause();
    this.elapsedTime = 0;
    this.startTime = null;
    document.getElementById('timerToggle').textContent = 'Start';
    document.getElementById('timerToggle').classList.remove('active');
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.isRunning) {
      this.elapsedTime = Date.now() - this.startTime;
    }

    const totalSeconds = Math.floor(this.elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const display = document.getElementById('timerDisplay');
    if (display) {
      display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.studyTimer = new StudyTimer();
});