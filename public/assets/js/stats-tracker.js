// Statistics Tracker Widget
class StatsTracker {
  constructor() {
    this.startTime = Date.now();
    this.currentUrl = window.location.href;
    this.isMinimized = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.position = this.loadPosition();
    this.stats = this.loadStats();
    
    this.init();
    this.startTracking();
  }

  init() {
    // Create widget HTML
    const widget = document.createElement('div');
    widget.id = 'stats-tracker-widget';
    widget.className = 'stats-widget';
    widget.style.cssText = `
      position: fixed;
      top: ${this.position.y}px;
      left: ${this.position.x}px;
      z-index: 999999;
      background: linear-gradient(135deg, rgba(30, 27, 40, 0.98) 0%, rgba(25, 22, 35, 0.98) 100%);
      border: 2px solid rgba(78, 205, 196, 0.3);
      border-radius: 12px;
      padding: 0;
      min-width: 280px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(78, 205, 196, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      backdrop-filter: blur(10px);
      cursor: move;
      transition: all 0.3s ease;
    `;

    widget.innerHTML = `
      <div class="stats-header" style="
        background: linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(16, 185, 129, 0.15));
        padding: 12px 15px;
        border-bottom: 1px solid rgba(78, 205, 196, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px 10px 0 0;
        cursor: move;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" stroke-width="2">
            <path d="M3 3v18h18"></path>
            <path d="M18 17V9"></path>
            <path d="M13 17V5"></path>
            <path d="M8 17v-3"></path>
          </svg>
          <span style="color: #4ecdc4; font-weight: 600; font-size: 14px;">Page Statistics</span>
        </div>
        <div style="display: flex; gap: 5px;">
          <button id="stats-minimize" style="
            background: rgba(78, 205, 196, 0.2);
            border: 1px solid rgba(78, 205, 196, 0.3);
            color: #4ecdc4;
            border-radius: 5px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button id="stats-close" style="
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.3);
            color: #ff6b6b;
            border-radius: 5px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div id="stats-content" style="padding: 15px;">
        <div style="margin-bottom: 15px;">
          <div style="color: rgba(255, 255, 255, 0.6); font-size: 11px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Current Session</div>
          <div style="color: #4ecdc4; font-size: 24px; font-weight: 700; font-family: 'Courier New', monospace;" id="current-time">00:00:00</div>
        </div>
        <div style="margin-bottom: 15px; padding-top: 12px; border-top: 1px solid rgba(78, 205, 196, 0.1);">
          <div style="color: rgba(255, 255, 255, 0.6); font-size: 11px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Current Page</div>
          <div style="color: rgba(255, 255, 255, 0.85); font-size: 12px; word-break: break-all; line-height: 1.4;" id="current-url"></div>
        </div>
        <div style="padding-top: 12px; border-top: 1px solid rgba(78, 205, 196, 0.1);">
          <div style="color: rgba(255, 255, 255, 0.6); font-size: 11px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">History (Top 5)</div>
          <div id="stats-history" style="font-size: 11px;"></div>
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(78, 205, 196, 0.1);">
          <button id="clear-stats" style="
            width: 100%;
            background: rgba(255, 107, 107, 0.15);
            border: 1px solid rgba(255, 107, 107, 0.3);
            color: #ff6b6b;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s;
          ">Clear History</button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.widget = widget;

    // Add event listeners
    this.setupEventListeners();
    this.updateDisplay();
    
    // Add hover effects with JavaScript
    const buttons = widget.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.opacity = '1';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.opacity = '0.9';
      });
    });
  }

  setupEventListeners() {
    const header = this.widget.querySelector('.stats-header');
    const minimizeBtn = document.getElementById('stats-minimize');
    const closeBtn = document.getElementById('stats-close');
    const clearBtn = document.getElementById('clear-stats');

    // Dragging
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      this.isDragging = true;
      this.dragOffset.x = e.clientX - this.widget.offsetLeft;
      this.dragOffset.y = e.clientY - this.widget.offsetTop;
      this.widget.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      let x = e.clientX - this.dragOffset.x;
      let y = e.clientY - this.dragOffset.y;

      // Keep within viewport
      x = Math.max(0, Math.min(x, window.innerWidth - this.widget.offsetWidth));
      y = Math.max(0, Math.min(y, window.innerHeight - this.widget.offsetHeight));

      this.widget.style.left = x + 'px';
      this.widget.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.widget.style.cursor = 'move';
        this.position = {
          x: parseInt(this.widget.style.left),
          y: parseInt(this.widget.style.top)
        };
        this.savePosition();
      }
    });

    // Minimize
    minimizeBtn.addEventListener('click', () => {
      this.isMinimized = !this.isMinimized;
      const content = document.getElementById('stats-content');
      const svg = minimizeBtn.querySelector('svg');
      
      if (this.isMinimized) {
        content.style.display = 'none';
        this.widget.style.minWidth = '200px';
        svg.innerHTML = '<rect x="5" y="5" width="14" height="14" rx="2"></rect>';
      } else {
        content.style.display = 'block';
        this.widget.style.minWidth = '280px';
        svg.innerHTML = '<line x1="5" y1="12" x2="19" y2="12"></line>';
      }
    });

    // Close
    closeBtn.addEventListener('click', () => {
      this.widget.style.opacity = '0';
      this.widget.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.widget.remove();
        this.saveTimeSpent();
      }, 300);
    });

    // Clear history
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all statistics?')) {
        localStorage.removeItem('page-stats');
        this.stats = {};
        this.updateDisplay();
      }
    });

    // Save on page unload
    window.addEventListener('beforeunload', () => {
      this.saveTimeSpent();
    });
  }

  startTracking() {
    setInterval(() => {
      this.updateDisplay();
    }, 1000);
  }

  updateDisplay() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('current-time').textContent = timeStr;

    // Update URL
    const urlDisplay = document.getElementById('current-url');
    if (urlDisplay) {
      const displayUrl = this.currentUrl.length > 60 
        ? this.currentUrl.substring(0, 60) + '...' 
        : this.currentUrl;
      urlDisplay.textContent = displayUrl;
    }

    // Update history
    this.updateHistory();
  }

  updateHistory() {
    const historyDiv = document.getElementById('stats-history');
    if (!historyDiv) return;

    const sortedStats = Object.entries(this.stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedStats.length === 0) {
      historyDiv.innerHTML = '<div style="color: rgba(255, 255, 255, 0.4); font-style: italic;">No history yet</div>';
      return;
    }

    historyDiv.innerHTML = sortedStats.map(([url, seconds]) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const timeStr = `${mins}m ${secs}s`;
      const shortUrl = url.length > 40 ? url.substring(0, 40) + '...' : url;
      
      return `
        <div style="
          display: flex;
          justify-content: space-between;
          padding: 6px 8px;
          margin-bottom: 4px;
          background: rgba(78, 205, 196, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(78, 205, 196, 0.1);
        ">
          <span style="color: rgba(255, 255, 255, 0.7); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${shortUrl}</span>
          <span style="color: #4ecdc4; font-weight: 600; margin-left: 8px;">${timeStr}</span>
        </div>
      `;
    }).join('');
  }

  saveTimeSpent() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    if (elapsed > 0) {
      this.stats[this.currentUrl] = (this.stats[this.currentUrl] || 0) + elapsed;
      localStorage.setItem('page-stats', JSON.stringify(this.stats));
    }
  }

  loadStats() {
    try {
      return JSON.parse(localStorage.getItem('page-stats') || '{}');
    } catch {
      return {};
    }
  }

  loadPosition() {
    try {
      const saved = JSON.parse(localStorage.getItem('stats-position'));
      return saved || { x: window.innerWidth - 300, y: 20 };
    } catch {
      return { x: window.innerWidth - 300, y: 20 };
    }
  }

  savePosition() {
    localStorage.setItem('stats-position', JSON.stringify(this.position));
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.statsTracker = new StatsTracker();
  });
} else {
  window.statsTracker = new StatsTracker();
}
