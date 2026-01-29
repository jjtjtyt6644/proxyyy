class TimeDisplay {
  constructor() {
    this.interval = null;
    this.displayElement = document.getElementById('timeDisplay');
    this.init();
  }

  init() {
    if (!this.displayElement) return;

    this.updateDisplay();
    this.interval = setInterval(() => this.updateDisplay(), 1000);
  }

  updateDisplay() {
    if (!this.displayElement) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    this.displayElement.innerHTML = `
      <i data-lucide="clock"></i>
      <div class="time-info">
        <span class="time">${timeString}</span>
        <span class="date">${dateString}</span>
      </div>
    `;

    // Re-create icons for the new content
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Initialize time display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.timeDisplay = new TimeDisplay();
});