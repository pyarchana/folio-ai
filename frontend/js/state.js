/**
 * Folio State Management Store
 * Centralized reactive state for currency, active persona, audit results, and filters.
 */

export const State = {
  currentAudit: null,
  activePersona: "indian-freelancer",
  currency: "INR", // "INR" or "USD"
  activeTab: "dashboard",
  tableFilter: "all",
  searchQuery: "",
  selectedTransactionForGemma: null,
  isAudioPlaying: false,
  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify() {
    this.listeners.forEach((fn) => fn(this));
  },

  setAudit(auditResult) {
    this.currentAudit = auditResult;
    // Auto-detect currency based on persona or amounts
    if (auditResult.persona_name && auditResult.persona_name.includes("INR")) {
      this.currency = "INR";
    } else if (auditResult.persona_name && auditResult.persona_name.includes("USD")) {
      this.currency = "USD";
    }
    this.notify();
  },

  setCurrency(curr) {
    this.currency = curr;
    this.notify();
  },

  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify();
  },

  setTableFilter(filter) {
    this.tableFilter = filter;
    this.notify();
  },

  setSearchQuery(q) {
    this.searchQuery = q.toLowerCase().trim();
    this.notify();
  },

  formatCurrency(amount) {
    const num = Math.abs(Number(amount) || 0);
    const sign = amount < 0 ? "-" : "";
    if (this.currency === "INR") {
      return `${sign}₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${sign}$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },
};
