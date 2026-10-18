/**
 * Folio UI Components Module — Newspaper Broadsheet & Editorial Gazette
 * Renders newspaper cards, ledger tables, broadsheet tickers, and statutory defense certificates.
 */

import { State } from "./state.js";

export const Components = {
  renderBentoStats(summary) {
    const isIndia = State.currency === "INR";
    const regimeLabel = isIndia ? "IT Act Sec 37(1) & 44ADA" : "IRS Schedule C IRC §162";

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Gazette Ticker 1: Write-offs Found -->
        <div class="news-card p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2 pb-2 border-b border-zinc-900/10">
              <span class="text-[10px] font-bold tracking-widest text-zinc-600 uppercase font-editorial">Allowable Deductions</span>
              <span class="badge-stamp badge-stamp-green">${summary.deductible_count} Items</span>
            </div>
            <div class="text-xs font-semibold text-zinc-500 uppercase font-editorial mb-1">Total Write-Offs Found</div>
            <div class="text-2xl sm:text-3xl font-bold font-ledger tracking-tight text-zinc-950 mb-1">
              +${State.formatCurrency(summary.total_deductible)}
            </div>
          </div>
          <div class="pt-3 border-t border-zinc-900/10 text-[11px] text-zinc-600 flex items-center justify-between font-editorial">
            <span>Classified by TabPFN 3.5</span>
            <span class="font-bold text-zinc-900">${regimeLabel}</span>
          </div>
        </div>

        <!-- Gazette Ticker 2: Tax Savings -->
        <div class="news-card p-5 flex flex-col justify-between bg-[#f0fdf4]">
          <div>
            <div class="flex items-center justify-between mb-2 pb-2 border-b border-emerald-900/20">
              <span class="text-[10px] font-bold tracking-widest text-emerald-800 uppercase font-editorial">Tax Reduction</span>
              <span class="badge-stamp badge-stamp-green">${Math.round(summary.effective_tax_rate * 100)}% Est. Rate</span>
            </div>
            <div class="text-xs font-semibold text-emerald-800 uppercase font-editorial mb-1">Estimated Tax Retained</div>
            <div class="text-2xl sm:text-3xl font-bold font-ledger tracking-tight text-emerald-800 mb-1">
              +${State.formatCurrency(summary.estimated_tax_savings)}
            </div>
          </div>
          <div class="pt-3 border-t border-emerald-900/20 text-[11px] text-emerald-800 font-editorial flex items-center gap-1.5">
            <span>Direct capital kept in your personal treasury</span>
          </div>
        </div>

        <!-- Gazette Ticker 3: Audit Defense Score -->
        <div class="news-card p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2 pb-2 border-b border-zinc-900/10">
              <span class="text-[10px] font-bold tracking-widest text-zinc-600 uppercase font-editorial">Statutory Readiness</span>
              <span class="badge-stamp badge-stamp-black">Gemma 2 Certified</span>
            </div>
            <div class="text-xs font-semibold text-zinc-500 uppercase font-editorial mb-1">Audit Defense Score</div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-2xl sm:text-3xl font-bold font-ledger tracking-tight text-zinc-950">${summary.tax_health_score}</span>
              <span class="text-sm font-ledger text-zinc-400">/ 100</span>
            </div>
          </div>
          <!-- Score Meter Bar -->
          <div class="pt-2">
            <div class="w-full bg-zinc-200 h-2 border border-zinc-900 overflow-hidden">
              <div class="bg-zinc-900 h-full transition-all duration-700" style="width: ${summary.tax_health_score}%"></div>
            </div>
          </div>
        </div>

        <!-- Gazette Ticker 4: Tabular Anomalies -->
        <div class="news-card p-5 flex flex-col justify-between ${summary.anomaly_count > 0 ? 'bg-[#fef2f2]' : ''}">
          <div>
            <div class="flex items-center justify-between mb-2 pb-2 border-b border-zinc-900/10">
              <span class="text-[10px] font-bold tracking-widest text-zinc-600 uppercase font-editorial">Anomaly Radar</span>
              <span class="badge-stamp ${summary.anomaly_count > 0 ? 'badge-stamp-red' : 'badge-stamp-black'}">
                ${summary.anomaly_count} Flagged
              </span>
            </div>
            <div class="text-xs font-semibold text-zinc-500 uppercase font-editorial mb-1">Phantom Charges & Spikes</div>
            <div class="text-2xl sm:text-3xl font-bold font-ledger tracking-tight ${summary.anomaly_count > 0 ? 'text-red-700' : 'text-zinc-950'} mb-1">
              ${summary.anomaly_count}
            </div>
          </div>
          <div class="pt-3 border-t border-zinc-900/10 text-[11px] text-zinc-600 font-editorial">
            ${summary.anomaly_count > 0 ? 'Action required: Review flagged subscriptions' : 'Zero unexpected spikes detected by TabPFN'}
          </div>
        </div>
      </div>
    `;
  },

  renderCategoryProgress(categoryTotals, totalDeductible) {
    if (!categoryTotals || Object.keys(categoryTotals).length === 0) {
      return `<p class="text-xs text-zinc-500 font-editorial italic p-4 text-center">No deduction dispatches recorded.</p>`;
    }

    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => {
        const pct = Math.round((amount / (totalDeductible || 1)) * 100);
        return `
          <div class="mb-3.5 pb-2 border-b border-zinc-900/10 last:border-0 last:pb-0">
            <div class="flex justify-between items-start gap-2 text-xs mb-1">
              <span class="font-bold text-zinc-900 font-editorial text-xs leading-snug">${cat}</span>
              <span class="font-ledger font-semibold text-zinc-900 whitespace-nowrap text-[11px]">${State.formatCurrency(amount)} <span class="text-zinc-500 text-[10px]">(${pct}%)</span></span>
            </div>
            <div class="w-full bg-zinc-200 h-1.5 border border-zinc-900/40 overflow-hidden">
              <div class="bg-zinc-900 h-full transition-all duration-500" style="width: ${Math.max(4, pct)}%"></div>
            </div>
          </div>
        `;
      }).join("");
  },

  renderAnomalyCards(anomalies) {
    if (!anomalies || anomalies.length === 0) {
      return `
        <div class="p-6 text-center border-2 border-dashed border-zinc-900/30 bg-[#faf8f5]">
          <div class="font-editorial text-sm font-bold text-zinc-800 mb-1">★ ALL CHARGES IN AUDIT CONFORMANCE ★</div>
          <p class="text-xs text-zinc-500 font-editorial">Zero phantom SaaS recurring fees or irregular price hikes detected.</p>
        </div>
      `;
    }

    return anomalies.map((item) => `
      <div class="p-3.5 news-card-subtle mb-3 border border-zinc-900 bg-white">
        <div class="flex items-start justify-between gap-3 mb-1.5">
          <div class="flex items-center gap-2">
            <span class="badge-stamp ${item.anomaly_type.includes('Spike') ? 'badge-stamp-red' : 'badge-stamp-black'}">
              ${item.anomaly_type}
            </span>
          </div>
          <span class="font-ledger font-bold text-xs text-zinc-900">
            ${State.formatCurrency(item.amount)}
          </span>
        </div>
        <p class="text-xs text-zinc-700 font-editorial leading-snug mb-2">
          ${item.explanation}
        </p>
        <div class="text-[10px] font-ledger text-zinc-500 uppercase tracking-wider">
          Suggested Action: ${item.suggested_action}
        </div>
      </div>
    `).join("");
  },

  renderTableRows(transactions) {
    if (!transactions || transactions.length === 0) {
      return `
        <tr>
          <td colspan="6" class="p-8 text-center text-zinc-500 font-editorial italic">
            No transaction records found matching the current dispatch filter.
          </td>
        </tr>
      `;
    }

    return transactions.map((t) => {
      const isIncome = t.amount > 0;
      const amountClass = isIncome ? "amount-credit" : "amount-debit";
      const formattedAmount = `${isIncome ? "+" : "-"}${State.formatCurrency(Math.abs(t.amount))}`;
      
      const badgeClass = t.is_deductible 
        ? "badge-stamp-green" 
        : (isIncome ? "badge-stamp-black" : "badge-stamp");

      return `
        <tr class="border-b border-zinc-900/10 hover:bg-[#fffdf5] transition">
          <!-- Date -->
          <td class="font-ledger text-[11px] text-zinc-600 whitespace-nowrap">
            ${t.date}
          </td>

          <!-- Vendor / Details -->
          <td>
            <div class="font-bold text-zinc-950 text-xs font-editorial leading-tight">
              ${t.clean_vendor || t.description}
            </div>
            <div class="font-ledger text-[9px] text-zinc-500 truncate max-w-[180px]">
              ${t.description}
            </div>
          </td>

          <!-- Classification Badge -->
          <td>
            <span class="badge-stamp ${badgeClass}">
              ${t.predicted_category}
            </span>
          </td>

          <!-- Amount -->
          <td class="text-right whitespace-nowrap ${amountClass} text-xs font-ledger">
            ${formattedAmount}
          </td>

          <!-- TabPFN Confidence -->
          <td class="text-center whitespace-nowrap">
            <span class="font-ledger text-xs font-semibold text-zinc-700">
              ${Math.round(t.confidence * 100)}%
            </span>
          </td>

          <!-- Gemma Action -->
          <td class="text-right whitespace-nowrap">
            ${t.is_deductible ? `
              <button 
                class="btn-defend news-btn-outline text-[10px] px-2 py-0.5 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                data-txn-id="${t.id}"
                title="Synthesize statutory legal defense statement"
              >
                ⚖️ Defend
              </button>
            ` : `
              <span class="text-zinc-400 text-xs font-editorial">—</span>
            `}
          </td>
        </tr>
      `;
    }).join("");
  },

  renderGemmaModalContent(rationale, transaction) {
    const isIndia = State.currency === "INR";
    const regimeTitle = isIndia ? "INCOME TAX ACT 1961 — STATUTORY DISPATCH" : "INTERNAL REVENUE CODE — STATUTORY DISPATCH";
    const sectionBadge = isIndia ? "Sec. 37(1) & 44ADA" : "IRC §162(a) & §179";

    const checklistItems = (rationale.documentation_checklist || [])
      .map((item) => `
        <li class="flex items-start gap-2 text-xs font-editorial text-zinc-800 leading-snug">
          <span class="font-ledger font-bold text-zinc-950">[✓]</span>
          <span>${item}</span>
        </li>
      `).join("");

    return `
      <div class="p-6 sm:p-8 news-modal">
        <!-- Certificate Header -->
        <div class="text-center pb-4 mb-5 border-b-2 border-zinc-900">
          <div class="text-[10px] font-bold tracking-[0.25em] text-zinc-600 uppercase font-editorial mb-1">
            OFFICIAL LEGAL DISPATCH • LOCAL-FIRST AI DEFENSE COPILOT
          </div>
          <h2 class="font-headline text-2xl sm:text-3xl font-extrabold text-zinc-950 mb-1">
            Statutory Audit Defense Certificate
          </h2>
          <div class="text-xs font-ledger text-zinc-600">
            DISPATCH REF: ${transaction.id || "TXN-FOLIO-001"} • STATUTE: <strong class="text-zinc-900">${sectionBadge}</strong>
          </div>
        </div>

        <!-- Transaction Details Banner -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-zinc-100 border border-zinc-900 mb-6 text-xs font-editorial">
          <div>
            <span class="text-zinc-500 block text-[10px] uppercase font-bold">Vendor</span>
            <strong class="text-zinc-900">${transaction.clean_vendor || transaction.description}</strong>
          </div>
          <div>
            <span class="text-zinc-500 block text-[10px] uppercase font-bold">Category</span>
            <strong class="text-zinc-900">${transaction.predicted_category}</strong>
          </div>
          <div>
            <span class="text-zinc-500 block text-[10px] uppercase font-bold">Amount</span>
            <strong class="font-ledger text-zinc-950 font-bold">${State.formatCurrency(Math.abs(transaction.amount))}</strong>
          </div>
          <div>
            <span class="text-zinc-500 block text-[10px] uppercase font-bold">Confidence</span>
            <strong class="font-ledger text-zinc-900">${Math.round(transaction.confidence * 100)}%</strong>
          </div>
        </div>

        <!-- Verbatim Legal Statement -->
        <div class="mb-6">
          <h3 class="font-headline text-sm font-bold uppercase tracking-wider text-zinc-950 mb-2 border-b border-zinc-900 pb-1">
            Statutory Legal Rationale
          </h3>
          <div class="p-4 bg-white border border-zinc-900 text-xs sm:text-sm font-editorial leading-relaxed text-zinc-900 whitespace-pre-line shadow-[2px_2px_0px_0px_#18181b]">
            ${rationale.audit_defense_statement}
          </div>
        </div>

        <!-- Evidentiary Documentation Checklist -->
        <div class="mb-6">
          <h3 class="font-headline text-sm font-bold uppercase tracking-wider text-zinc-950 mb-2 border-b border-zinc-900 pb-1">
            Evidentiary Documentation Checklist for Auditor / CA
          </h3>
          <ul class="space-y-2 bg-[#fcfbf9] p-4 border border-zinc-900/40">
            ${checklistItems}
          </ul>
        </div>

        <!-- Air-Gap Security Certificate & Actions -->
        <div class="pt-4 border-t-2 border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-[11px] font-editorial text-zinc-500 text-center sm:text-left">
            🔒 Synthesized strictly on localhost by Google Gemma 2. Zero cloud leakage.
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button 
              id="copy-defense-btn" 
              class="news-btn-black px-4 py-2 text-xs flex-1 sm:flex-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📋 Copy Statement</span>
            </button>
            <button 
              id="close-modal-btn" 
              class="news-btn-outline px-4 py-2 text-xs flex-1 sm:flex-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    `;
  }
};
