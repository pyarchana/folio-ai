/**
 * Folio Animated Product Demo Tour
 * Simulates a real human user with an authentic moving mouse cursor, click ripples, and automatic navigation.
 */

export const DemoTour = {
  cursorEl: null,
  isRunning: false,

  init() {
    this.createCursor();
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "1" || params.get("tour") === "true") {
      setTimeout(() => this.run(), 600);
    }
  },

  createCursor() {
    if (document.getElementById("virtual-cursor")) {
      this.cursorEl = document.getElementById("virtual-cursor");
      return;
    }
    const cursor = document.createElement("div");
    cursor.id = "virtual-cursor";
    // Authentic dark pointer with crisp white border and drop shadow
    cursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#09090b" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round">
        <path d="M4 2v18l5.2-4.8 3.8 8.8 3.2-1.4-3.8-8.8 6.6-.2z"/>
      </svg>
    `;
    document.body.appendChild(cursor);
    this.cursorEl = cursor;
  },

  async moveCursor(targetX, targetY, durationMs = 700) {
    if (!this.cursorEl) return;
    this.cursorEl.style.display = "block";

    const startX = parseFloat(this.cursorEl.style.left) || window.innerWidth / 2;
    const startY = parseFloat(this.cursorEl.style.top) || 200;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Smooth EaseInOutQuad
        const ease = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        const currentX = startX + (targetX - startX) * ease;
        const currentY = startY + (targetY - startY) * ease;

        this.cursorEl.style.left = `${currentX}px`;
        this.cursorEl.style.top = `${currentY}px`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  },

  async moveCursorToElement(selector, durationMs = 700) {
    const el = document.querySelector(selector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    await this.moveCursor(targetX, targetY, durationMs);
  },

  showClickRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.className = "cursor-click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  },

  async clickElement(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    this.showClickRipple(x, y);
    el.style.transform = "scale(0.96)";
    setTimeout(() => { el.style.transform = ""; }, 150);

    el.click();
    await this.sleep(300);
  },

  async smoothScrollTo(targetY, durationMs = 700) {
    const startY = window.scrollY;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const ease = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, startY + (targetY - startY) * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  },

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  },

  async run() {
    if (this.isRunning) return;
    this.isRunning = true;
    window.__tourCompleted = false;
    this.createCursor();

    try {
      window.scrollTo(0, 0);
      this.cursorEl.style.left = `${window.innerWidth / 2}px`;
      this.cursorEl.style.top = `160px`;
      this.cursorEl.style.display = "block";
      await this.sleep(400);

      // 1. Move to "Indie Dev (USD)" persona and click it
      await this.moveCursorToElement('button[data-persona="indie-dev"]', 700);
      await this.clickElement('button[data-persona="indie-dev"]');
      await this.sleep(800); // Allow stats to settle

      // 2. Move to "Indian Freelancer" and switch back to INR
      await this.moveCursorToElement('button[data-persona="indian-freelancer"]', 600);
      await this.clickElement('button[data-persona="indian-freelancer"]');
      await this.sleep(800);

      // 3. Glide over the dropzone "Download Sample CSV" / "Browse" button
      await this.moveCursorToElement('#dropzone button', 600);
      await this.sleep(400);

      // 4. Smooth scroll down to the Ledger Table section
      const tableSection = document.getElementById("table-section");
      if (tableSection) {
        const tableY = tableSection.getBoundingClientRect().top + window.scrollY - 60;
        await this.smoothScrollTo(tableY, 700);
      }
      await this.sleep(500);

      // 5. Move cursor to the first "Defend" button
      const firstDefendBtn = document.querySelector(".btn-defend");
      if (firstDefendBtn) {
        await this.moveCursorToElement(".btn-defend", 700);
        await this.clickElement(".btn-defend");
        await this.sleep(2000); // Showcase the Gemma 2 Statutory Certificate!

        // 6. Click "Copy Statement" inside modal
        if (document.getElementById("copy-defense-btn")) {
          await this.moveCursorToElement("#copy-defense-btn", 600);
          await this.clickElement("#copy-defense-btn");
          await this.sleep(700);
        }

        // 7. Click "Close"
        if (document.getElementById("close-modal-btn")) {
          await this.moveCursorToElement("#close-modal-btn", 500);
          await this.clickElement("#close-modal-btn");
          await this.sleep(500);
        }
      }

      // 8. Scroll back up to the top broadsheet
      await this.smoothScrollTo(0, 700);
      await this.sleep(600);

    } finally {
      this.isRunning = false;
      window.__tourCompleted = true;
    }
  }
};

window.DemoTour = DemoTour;
window.startDemoTour = () => DemoTour.run();

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => DemoTour.init());
  } else {
    DemoTour.init();
  }
}
