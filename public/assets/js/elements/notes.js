class QuickNotes {
  constructor() {
    this.notes = this.loadNotes();
    this.displayElement = document.getElementById('quickNotes');
    this.init();
  }

  init() {
    if (!this.displayElement) return;

    this.displayElement.innerHTML = `
      <i data-lucide="sticky-note"></i>
      <span>Notes</span>
    `;

    this.displayElement.addEventListener('click', () => this.showNotesModal());
  }

  showNotesModal() {
    const modal = document.createElement('div');
    modal.className = 'notes-modal';
    modal.innerHTML = `
      <div class="notes-overlay" id="notesOverlay"></div>
      <div class="notes-container">
        <div class="notes-header">
          <h3>Quick Notes</h3>
          <button id="notesClose">&times;</button>
        </div>
        <textarea id="notesTextarea" placeholder="Write your notes here...">${this.notes}</textarea>
        <div class="notes-actions">
          <button id="notesSave">Save</button>
          <button id="notesClear">Clear All</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'notesOverlay' || e.target.id === 'notesClose') {
        modal.remove();
      }
    });

    document.getElementById('notesSave').addEventListener('click', () => {
      const textarea = document.getElementById('notesTextarea');
      this.notes = textarea.value;
      this.saveNotes();
      modal.remove();
    });

    document.getElementById('notesClear').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all notes?')) {
        this.notes = '';
        document.getElementById('notesTextarea').value = '';
        this.saveNotes();
      }
    });
  }

  loadNotes() {
    try {
      return localStorage.getItem('ambient_notes') || '';
    } catch (err) {
      return '';
    }
  }

  saveNotes() {
    try {
      localStorage.setItem('ambient_notes', this.notes);
    } catch (err) {
      console.warn('Failed to save notes:', err);
    }
  }
}

// Initialize quick notes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quickNotes = new QuickNotes();
});