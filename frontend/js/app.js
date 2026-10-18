/**
 * Folio Application Controller
 * Handles user interactions, drag-and-drop, audio briefing, and modal controls.
 */

import { Api } from "./api.js";
import { State } from "./state.js";
import { Components } from "./components.js";

document.addEventListener("DOMContentLoaded", async () => {
  initElements();
  initStateListeners();
  initEventListeners();
  
  // Initial load
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  
  if (view === "indie") {
    await loadPersona("indie-dev");
  } else {
    await loadPersona("indian-freelancer");
  }

  if (view === "tickers") {
    window.scrollTo(0, 500);
  } else if (view === "table") {
    window.scrollTo(0, 840);
  } else if (view === "modal") {
    const firstDeductible = (State.currentAudit?.transactions || []).find(t => t.is_deductible);
    if (firstDeductible) await openGemmaDefenseModal(firstDeductible.id);
  }
});

let dom = {};

function initElements() {
  dom = {
    // Nav & Controls
    currencyToggleBtn: document.getElementById("currency-toggle-btn"),
    audioBriefingBtn: document.getElementById("audio-briefing-btn"),
    audioWave: document.getElementById("audio-wave"),
    audioBtnText: document.getElementById("audio-btn-text"),
    personaPillsContainer: document.getElementById("persona-pills"),
    
    // Dropzone
    dropzone: document.getElementById("dropzone"),
    fileInput: document.getElementById("file-input"),
    dropzoneTitle: document.getElementById("dropzone-title"),
    
    // Main Content Containers
    bentoStatsContainer: document.getElementById("bento-stats-container"),
    categoryProgressContainer: document.getElementById("category-progress-container"),
    anomalyListContainer: document.getElementById("anomaly-list-container"),
    transactionsTableBody: document.getElementById("transactions-table-body"),
    transactionCountBadge: document.getElementById("transaction-count-badge"),
    
    // Filter & Search
    filterTabs: document.querySelectorAll(".filter-tab"),
    searchInput: document.getElementById("search-input"),
    
    // Export
    exportCsvBtn: document.getElementById("export-csv-btn"),
    
    // Modal
    modalOverlay: document.getElementById("modal-overlay"),
    modalContent: document.getElementById("modal-content"),
    
    // Dock Navigation
    dockBtns: document.querySelectorAll(".dock-btn"),
  };
}

function initStateListeners() {
  State.subscribe((state) => {
    // Update currency toggle label
    if (dom.currencyToggleBtn) {
      dom.currencyToggleBtn.textContent = state.currency === "INR" ? "₹ INR" : "$ USD";
    }

    if (!state.currentAudit) return;

    const summary = state.currentAudit.summary;
    const txns = filterTransactions(state.currentAudit.transactions);

    // Render Stats
    dom.bentoStatsContainer.innerHTML = Components.renderBentoStats(summary);
    
    // Render Category Breakdown
    dom.categoryProgressContainer.innerHTML = Components.renderCategoryProgress(
      summary.category_totals,
      summary.total_deductible
    );

    // Render Anomaly Cards
    dom.anomalyListContainer.innerHTML = Components.renderAnomalyCards(
      state.currentAudit.anomalies
    );

    // Render Transactions Table
    dom.transactionsTableBody.innerHTML = Components.renderTableRows(txns);
    dom.transactionCountBadge.textContent = `${txns.length} records`;

    // Re-bind "Defend with Gemma" buttons
    document.querySelectorAll(".btn-defend").forEach((btn) => {
      btn.addEventListener("click", () => {
        const txnId = btn.getAttribute("data-txn-id");
        openGemmaDefenseModal(txnId);
      });
    });
  });
}

function initEventListeners() {
  // Currency Toggle Button
  dom.currencyToggleBtn?.addEventListener("click", () => {
    const nextCurr = State.currency === "INR" ? "USD" : "INR";
    State.setCurrency(nextCurr);
  });

  // Audio Briefing Button
  dom.audioBriefingBtn?.addEventListener("click", handleAudioBriefing);

  // Search Input
  dom.searchInput?.addEventListener("input", (e) => {
    State.setSearchQuery(e.target.value);
  });

  // Filter Tabs (All, Deductible, Anomalies, Income)
  dom.filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dom.filterTabs.forEach((t) => t.classList.remove("active", "bg-zinc-900", "text-white"));
      dom.filterTabs.forEach((t) => t.classList.add("text-zinc-600"));
      tab.classList.add("active", "bg-zinc-900", "text-white");
      tab.classList.remove("text-zinc-600");
      State.setTableFilter(tab.getAttribute("data-filter"));
    });
  });

  // Export CSV Button
  dom.exportCsvBtn?.addEventListener("click", async () => {
    if (!State.currentAudit || !State.currentAudit.transactions) return;
    try {
      dom.exportCsvBtn.innerHTML = "<span>⏳ Exporting...</span>";
      await Api.downloadScheduleC(State.currentAudit.transactions);
    } catch (err) {
      alert("Failed to export: " + err.message);
    } finally {
      dom.exportCsvBtn.innerHTML = "<span>📄 Export Tax Schedule (CSV)</span>";
    }
  });

  // Drag & Drop
  initDropzone();

  // Floating Dock Smooth Scroll
  dom.dockBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      dom.dockBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Close Modal on overlay click
  dom.modalOverlay?.addEventListener("click", (e) => {
    if (e.target === dom.modalOverlay) {
      closeModal();
    }
  });
}

function initDropzone() {
  const dropzone = dom.dropzone;
  const fileInput = dom.fileInput;
  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  });
}

async function handleFileUpload(file) {
  try {
    if (dom.dropzone) {
      dom.dropzone.classList.add("border-yellow-500", "bg-yellow-50/60");
    }
    dom.dropzoneTitle.textContent = `⚙️ Analyzing ${file.name} with TabPFN 3.5...`;
    const res = await Api.uploadCsv(file);
    State.setAudit(res);
    const txnCount = res.transactions?.length || 0;
    dom.dropzoneTitle.textContent = `✓ Audited ${file.name} (${txnCount} Records Ingested)`;
    if (dom.dropzone) {
      dom.dropzone.classList.remove("border-yellow-500", "bg-yellow-50/60");
      dom.dropzone.classList.add("border-emerald-600");
    }
  } catch (err) {
    console.error("Error processing file:", err);
    dom.dropzoneTitle.textContent = "Drop bank or credit card CSV here";
  }
}

async function loadPersona(personaKey) {
  try {
    State.activePersona = personaKey;
    highlightPersonaPill(personaKey);
    const res = await Api.auditSample(personaKey);
    State.setAudit(res);
  } catch (err) {
    console.error("Failed to load persona:", err);
  }
}

function highlightPersonaPill(personaKey) {
  document.querySelectorAll(".persona-pill").forEach((pill) => {
    if (pill.getAttribute("data-persona") === personaKey) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });
}

// Window global for inline onclick
window.switchPersona = async (personaKey) => {
  await loadPersona(personaKey);
};

function filterTransactions(txns) {
  if (!txns) return [];
  return txns.filter((t) => {
    // Filter tab
    if (State.tableFilter === "deductible" && !t.is_deductible) return false;
    if (State.tableFilter === "income" && t.amount <= 0) return false;
    if (State.tableFilter === "anomalies") {
      const anomalyTxnIds = (State.currentAudit.anomalies || []).map((a) => a.transaction_id);
      if (!anomalyTxnIds.includes(t.id)) return false;
    }

    // Search query
    if (State.searchQuery) {
      const matchDesc = t.description.toLowerCase().includes(State.searchQuery);
      const matchCat = t.predicted_category.toLowerCase().includes(State.searchQuery);
      if (!matchDesc && !matchCat) return false;
    }

    return true;
  });
}

async function openGemmaDefenseModal(txnId) {
  const txn = (State.currentAudit.transactions || []).find((t) => t.id === txnId);
  if (!txn) return;

  dom.modalContent.innerHTML = `
    <div class="p-12 text-center text-zinc-500">
      <div class="inline-block animate-spin text-2xl mb-3">⚙️</div>
      <p class="text-sm">Synthesizing statutory audit rationale with Gemma 2...</p>
    </div>
  `;
  dom.modalOverlay.classList.remove("hidden");

  try {
    const regime = State.currency === "INR" ? "india" : "us";
    const rationale = await Api.generateGemmaDefense(txn, "", regime);
    dom.modalContent.innerHTML = Components.renderGemmaModalContent(rationale, txn);

    // Bind Close and Copy buttons
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    document.getElementById("copy-defense-btn")?.addEventListener("click", (e) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(rationale.audit_defense_statement).catch(() => {});
      }
      const btn = e.currentTarget;
      if (btn) {
        const origHTML = btn.innerHTML;
        btn.innerHTML = `<span>✓ Copied to Clipboard</span>`;
        btn.classList.add("bg-emerald-700", "text-white");
        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.classList.remove("bg-emerald-700", "text-white");
        }, 2000);
      }
    });
  } catch (err) {
    dom.modalContent.innerHTML = `
      <div class="p-8 text-center text-red-600">
        <p>Failed to generate defense: ${err.message}</p>
        <button onclick="document.getElementById('modal-overlay').classList.add('hidden')" class="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-full text-xs">Close</button>
      </div>
    `;
  }
}

function closeModal() {
  dom.modalOverlay?.classList.add("hidden");
}

let speechSynth = window.speechSynthesis;
let currentUtterance = null;

async function handleAudioBriefing() {
  if (State.isAudioPlaying) {
    if (speechSynth) speechSynth.cancel();
    stopAudioUI();
    return;
  }

  if (!State.currentAudit || !State.currentAudit.summary) return;

  try {
    startAudioUI();
    const briefingData = await Api.fetchVoiceBriefing(
      State.currentAudit.summary,
      State.currentAudit.persona_name || "Freelancer"
    );

    if ("speechSynthesis" in window) {
      speechSynth.cancel();
      currentUtterance = new SpeechSynthesisUtterance(briefingData.script);
      currentUtterance.rate = 1.0;
      currentUtterance.pitch = 1.0;

      currentUtterance.onend = () => stopAudioUI();
      currentUtterance.onerror = () => stopAudioUI();

      speechSynth.speak(currentUtterance);
    } else {
      alert(briefingData.script);
      stopAudioUI();
    }
  } catch (err) {
    console.error("Audio briefing failed:", err);
    stopAudioUI();
  }
}

function startAudioUI() {
  State.isAudioPlaying = true;
  dom.audioWave?.classList.remove("hidden");
  if (dom.audioBtnText) dom.audioBtnText.textContent = "Playing Briefing...";
}

function stopAudioUI() {
  State.isAudioPlaying = false;
  dom.audioWave?.classList.add("hidden");
  if (dom.audioBtnText) dom.audioBtnText.textContent = "Audio Briefing";
}
