/**
 * Folio UI Components Module
 * Renders spatial glassmorphism cards, stat bentos, TabPFN tables, and Gemma defense modals.
 */

import { State } from "./state.js";

export const Components = {
  renderBentoStats(summary) {
    const isIndia = State.currency === "INR";
    const regimeLabel = isIndia ? "IT Act Sec 37(1) & 44ADA" : "IRS Schedule C";

    return `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <!-- Card 1: Total Deductions -->
        <div class="glass-panel p-6 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Total Write-Offs Found</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              ${summary.deductible_count} Eligible
            </span>
          </div>
          <div class="text-3xl font-bold tracking-tight text-zinc-900 mb-1">
            +${State.formatCurrency(summary.total_deductible)}
          </div>
          <div class="text-xs text-zinc-500 flex items-center gap-1.5 mt-2">
            <span>Verified by TabPFN 3.5</span>
            <span class="text-zinc-300">•</span>
            <span class="font-medium text-zinc-700">${regimeLabel}</span>
          </div>
        </div>

        <!-- Card 2: Estimated Tax Saved -->
        <div class="glass-panel p-6 relative overflow-hidden group hover:-translate-y-1 transition duration-300 bg-gradient-to-br from-emerald-50/50 to-white/70">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold tracking-wider text-emerald-800 uppercase">Est. Tax Savings</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-semibold">
              ${Math.round(summary.effective_tax_rate * 100)}% Rate
            </span>
          </div>
          <div class="text-3xl font-bold tracking-tight text-emerald-600 mb-1">
            +${State.formatCurrency(summary.estimated_tax_savings)}
          </div>
          <div class="text-xs text-emerald-700/80 mt-2">
            Direct cash retained in your pocket
          </div>
        </div>

        <!-- Card 3: Tax Health Score -->
        <div class="glass-panel p-6 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Audit Defense Score</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-medium">
              Gemma Verified
            </span>
          </div>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-bold tracking-tight text-zinc-900">${summary.tax_health_score}</span>
            <span class="text-sm text-zinc-400 font-medium">/ 100</span>
          </div>
          <!-- Score Bar -->
          <div class="w-full bg-zinc-200/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div class="bg-zinc-900 h-full rounded-full transition-all duration-700" style="width: ${summary.tax_health_score}%"></div>
          </div>
        </div>

        <!-- Card 4: TabPFN Anomaly Flags -->
        <div class="glass-panel p-6 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Tabular Anomalies</span>
            <span class="text-xs px-2.5 py-1 rounded-full ${summary.anomaly_count > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-600'} font-medium">
              ${summary.anomaly_count} Flagged
            </span>
          </div>
          <div class="text-3xl font-bold tracking-tight text-zinc-900 mb-1">
            ${summary.anomaly_count} <span class="text-base font-normal text-zinc-500">detected</span>
          </div>
          <div class="text-xs text-zinc-500 mt-2">
            Zombie SaaS & unexpected spikes
          </div>
        </div>
      </div>
    `;
  },

  renderCategoryProgress(categoryTotals, totalDeductible) {
    if (!categoryTotals || Object.keys(categoryTotals).length === 0) return "";
    
    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => {
        const pct = Math.round((amount / (totalDeductible || 1)) * 100);
        return `
          <div class="mb-3.5">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="font-medium text-zinc-700 truncate max-w-[200px]">${cat}</span>
              <span class="font-semibold text-zinc-900">${State.formatCurrency(amount)} (${pct}%)</span>
            </div>
            <div class="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div class="bg-zinc-800 h-full rounded-full transition-all duration-500" style="width: ${Math.max(4, pct)}%"></div>
            </div>
          </div>
        `;
      }).join("");
  },

  renderAnomalyCards(anomalies) {
    if (!anomalies || anomalies.length === 0) {
      return `
        <div class="p-8 text-center text-zinc-400">
          <div class="text-2xl mb-2">✨</div>
          <p class="text-sm">No expense anomalies detected. All charges align with baseline.</p>
        </div>
      `;
    }

    return anomalies.map((item) => `
      <div class="p-4 rounded-2xl bg-white/60 border border-zinc-200/70 mb-3 hover:bg-white/90 transition shadow-sm">
        <div class="flex items-start justify-between gap-3 mb-1.5">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full ${item.anomaly_type.includes('Spike') ? 'bg-red-500' : 'bg-amber-500'}"></span>
            <h4 class="text-sm font-semibold text-zinc-900">${item.title}</h4>
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
            ${State.formatCurrency(item.amount)}
          </span>
        </div>
        <p class="text-xs text-zinc-600 mb-2.5 leading-relaxed">${item.description}</p>
        <div class="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-100">
          <span class="text-emerald-700 font-medium">💡 ${item.suggested_action}</span>
          <span class="text-zinc-400">TabPFN Conf: ${Math.round(item.confidence_score * 100)}%</span>
        </div>
      </div>
    `).join("");
  },

  renderTableRows(transactions) {
    if (!transactions || transactions.length === 0) {
      return `<tr><td colspan="6" class="text-center py-10 text-zinc-400">No transactions match current filter.</td></tr>`;
    }

    return transactions.map((t) => {
      const isIncome = t.amount > 0;
      const isDeductible = t.is_deductible;
      const amtFormatted = (isIncome ? "+" : "") + State.formatCurrency(t.amount);
      const confPercent = Math.round((t.confidence || 0.9) * 100);

      let badgeBg = "bg-zinc-100 text-zinc-600";
      if (isIncome) badgeBg = "bg-blue-50 text-blue-700 border border-blue-200";
      else if (isDeductible) badgeBg = "bg-emerald-50 text-emerald-800 border border-emerald-200";

      return `
        <tr class="transition hover:bg-white/70">
          <td class="text-xs font-mono text-zinc-500">${t.date}</td>
          <td>
            <div class="font-medium text-zinc-900">${t.description}</div>
            ${t.raw_description ? `<div class="text-[11px] text-zinc-400 font-mono truncate max-w-xs">${t.raw_description}</div>` : ''}
          </td>
          <td>
            <span class="inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${badgeBg}">
              ${t.predicted_category}
            </span>
          </td>
          <td class="text-right font-mono font-medium ${isIncome ? 'text-blue-600' : 'text-zinc-900'}">
            ${amtFormatted}
          </td>
          <td class="text-center">
            <div class="inline-flex items-center gap-1.5 text-xs text-zinc-600 font-mono">
              <div class="w-10 bg-zinc-200 h-1.5 rounded-full overflow-hidden inline-block">
                <div class="bg-zinc-800 h-full rounded-full" style="width: ${confPercent}%"></div>
              </div>
              <span>${confPercent}%</span>
            </div>
          </td>
          <td class="text-right">
            ${isDeductible ? `
              <button 
                data-txn-id="${t.id}"
                class="btn-defend text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm transition hover:scale-105 active:scale-95 inline-flex items-center gap-1"
              >
                <span>🛡️ Defend</span>
              </button>
            ` : `
              <span class="text-xs text-zinc-400">—</span>
            `}
          </td>
        </tr>
      `;
    }).join("");
  },

  renderGemmaModalContent(rationale, txn) {
    const isIndia = State.currency === "INR";
    const docsList = (rationale.required_documentation || [])
      .map((d) => `<li class="flex items-center gap-2 text-xs text-zinc-700"><span class="text-emerald-500">✓</span> ${d}</li>`)
      .join("");

    return `
      <div class="p-6 md:p-8">
        <div class="flex items-start justify-between mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium mb-2">
              <span>🤖 ${rationale.generated_by}</span>
              <span class="text-zinc-300">•</span>
              <span class="text-emerald-700 font-semibold">${isIndia ? "CBDT & IT Act 1961" : "IRS Schedule C"}</span>
            </div>
            <h3 class="text-xl font-bold text-zinc-900">${rationale.vendor_name}</h3>
            <p class="text-xs text-zinc-500 font-mono mt-0.5">${rationale.irs_code_reference}</p>
          </div>
          <button id="close-modal-btn" class="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition">
            ✕
          </button>
        </div>

        <div class="space-y-5">
          <!-- Deduction Amount Box -->
          <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span class="text-xs text-emerald-800 uppercase font-semibold">Eligible Write-Off</span>
              <div class="text-2xl font-bold text-emerald-950">${State.formatCurrency(rationale.amount)}</div>
            </div>
            <div class="text-right">
              <span class="text-xs text-emerald-800">Deduction Confidence</span>
              <div class="text-lg font-bold text-emerald-700">${Math.round(rationale.deduction_confidence * 100)}%</div>
            </div>
          </div>

          <!-- Business Purpose -->
          <div>
            <h4 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Business Rationale</h4>
            <p class="text-sm text-zinc-800 bg-white/80 p-3.5 rounded-xl border border-zinc-200/70 leading-relaxed">
              ${rationale.business_purpose}
            </p>
          </div>

          <!-- Formal Legal Audit Statement -->
          <div>
            <h4 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Statutory Audit Statement (Examiner-Ready)</h4>
            <p class="text-xs text-zinc-700 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80 font-mono leading-relaxed select-all">
              "${rationale.audit_defense_statement}"
            </p>
          </div>

          <!-- Required Documentation -->
          <div>
            <h4 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Required Substantiating Evidence</h4>
            <ul class="space-y-1.5 bg-white/80 p-3.5 rounded-xl border border-zinc-200/70">
              ${docsList}
            </ul>
          </div>

          <!-- Copy Button -->
          <div class="pt-3 flex justify-end gap-3">
            <button id="copy-defense-btn" class="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md transition hover:scale-105 active:scale-95 inline-flex items-center gap-1.5">
              <span>📋 Copy Defense Statement</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
