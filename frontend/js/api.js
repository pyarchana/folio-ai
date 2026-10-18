/**
 * Folio API Client Module
 * Provides asynchronous communication with backend TabPFN and Gemma 2 services.
 */

const API_BASE = window.location.origin;

export const Api = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      return await res.json();
    } catch (err) {
      console.warn("Health check failed:", err);
      return { status: "offline" };
    }
  },

  async fetchSamples() {
    const res = await fetch(`${API_BASE}/api/audit/samples`);
    if (!res.ok) throw new Error("Failed to load sample personas");
    return await res.json();
  },

  async auditSample(personaKey) {
    const res = await fetch(`${API_BASE}/api/audit/sample/${personaKey}`);
    if (!res.ok) throw new Error("Failed to audit sample");
    return await res.json();
  },

  async uploadCsv(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/audit/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to process uploaded CSV");
    }
    return await res.json();
  },

  async generateGemmaDefense(transaction, customContext = "", regime = "auto") {
    const res = await fetch(`${API_BASE}/api/gemma/defense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction,
        custom_context: customContext,
        regime,
      }),
    });
    if (!res.ok) throw new Error("Failed to generate Gemma 2 defense");
    return await res.json();
  },

  async fetchVoiceBriefing(summary, personaName) {
    const res = await fetch(`${API_BASE}/api/voice/briefing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        persona_name: personaName,
      }),
    });
    if (!res.ok) throw new Error("Failed to generate voice briefing");
    return await res.json();
  },

  async downloadScheduleC(transactions) {
    const res = await fetch(`${API_BASE}/api/export/schedule-c-csv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions }),
    });
    if (!res.ok) throw new Error("Failed to export schedule CSV");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "folio_schedule_c_deductions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
