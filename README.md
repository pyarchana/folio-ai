# Folio 💼⚡
> **Local-First AI Financial Auditor for Freelancers & Solopreneurs**  
> *Zero Cloud Leaks. Zero Missed Deductions. Powered by TabPFN & Gemma 2.*

[![Hacktoberfest Challenge Week 2](https://img.shields.io/badge/Hacktoberfest-Side%20Hustle%20Challenge-orange.svg)](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)
[![Open Source AI](https://img.shields.io/badge/Open%20Source%20AI-TabPFN%20%2B%20Gemma%202-blue.svg)](https://github.com/pyarchana/folio-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Privacy: 100% Local Air-Gap](https://img.shields.io/badge/Privacy-100%25%20Local%20Air--Gap-emerald.svg)](https://github.com/pyarchana/folio-ai)

---

## 🌟 Overview

Freelancers, solopreneurs, and remote tech consultants leave **thousands of dollars (or lakhs of rupees)** in legitimate tax write-offs on the table every year (developer tools, cloud servers, broadband, coworking spaces, hardware). 

Existing accounting software poses two major hurdles:
1. **Privacy Risk:** Freelancers rightfully refuse to upload raw bank statements, client invoices, and income records to closed cloud AI servers.
2. **SaaS Tax:** Solopreneurs operating on thin margins shouldn't pay \$30–\$50/month just to audit 40 transactions a month.
3. **Tabular Blindspot:** Closed general-purpose LLMs hallucinate numbers and fail on raw tabular CSVs.

**Folio** solves this with an air-gapped, local-first architecture. It pairs **Prior Labs' TabPFN 3.5** (foundation model for tabular data) with **Google's Gemma 2** (open weights) to automate expense categorization, flag phantom subscriptions, and generate audit-proof statutory defense statements.

---

## 🚀 Key Features

* **Zero-Shot Tabular Auditing (TabPFN 3.5):** Ingests raw bank/credit card CSVs (Chase, Mercury, Wise, Amex, HDFC, ICICI, PayPal, Stripe) and maps transactions to statutory tax categories with calibrated confidence scores.
* **Statutory Audit Defense Copilot (Gemma 2):** One-click legal rationale generation citing exact tax codes:
  * 🇮🇳 **Indian Income Tax Act (1961):** Section 37(1) (*wholly and exclusively for profession*), Section 32 (depreciation on tech hardware), and Section 44ADA (presumptive taxation).
  * 🌐 **IRS Schedule C (US & Global):** IRC §162(a), §179 (first-year expensing), and §274 (business meals & travel).
* **Tabular Anomaly & Subscription Radar:** Detects phantom/zombie recurring SaaS fees, sudden pricing spikes, and misclassified deductions.
* **Spatial Glassmorphism UI:** Built with organic floating pill navigation, tactile bento stat cards, and dark/light ambient aesthetics.
* **Multi-Currency Support:** Instant toggle between **₹ INR** and **\$ USD**.
* **30-Second Audio Executive Briefing:** Browser-native Web Speech audio recap summarizing monthly write-offs and tax savings.
* **Accountant-Ready Export:** Download itemized deduction schedules formatted as CSV.

---

## 🧠 Why Open Innovation Matters

| Dimension | Proprietary Closed APIs | Folio's Open-Source AI Stack |
| :--- | :--- | :--- |
| **Data Sovereignty** | Bank statements & invoices sent to external servers; potential training retention. | **100% Local Air-Gap:** Transaction data never leaves localhost. |
| **Marginal Cost** | \$0.03 – \$0.06 per API call; recurring SaaS subscription fees. | **\$0.00:** Unlimited local inferences without API bills. |
| **Tabular Precision** | General-purpose text LLMs stumble on raw numerical tables. | **TabPFN Foundation Model:** Specifically trained on tabular datasets. |
| **Audit Durability** | Closed APIs change models or deprecate versions. | **Reproducible Open Weights:** Gemma 2 & TabPFN models run identically over time. |

---

## 🛠️ Tech Stack

* **Tabular Intelligence:** [Prior Labs TabPFN 3.5](https://platform.priorlabs.ai) / `tabpfn`
* **Reasoning & Defense:** [Google Gemma 2](https://huggingface.co/google/gemma-2-2b-it) (Open Weights)
* **Backend:** FastAPI, Uvicorn, Pandas, Scikit-learn
* **Frontend:** HTML5, Tailwind CSS, Spatial Glassmorphism CSS, Vanilla ES Modules
* **Audio:** Native Web Speech API / ElevenLabs integration

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pyarchana/folio-ai.git
cd folio-ai
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch the Server
```bash
python run.py
```

Open your browser at **`http://127.0.0.1:8000`**.

---

## 🧪 Testing

Run the test suite with `pytest`:
```bash
python -m pytest tests/
```

All 8 tests verify CSV parsing, TabPFN tabular categorization, Gemma defense rationale generation, and FastAPI endpoints.

---

## 🎯 Prize Categories Targeted

* 🏆 **Hacktoberfest Challenge Week 2: Side Hustle** (Grand Prize)
* 🌟 **Best Use of TabPFN** (\$200) — Prior Labs tabular foundation model
* 🌟 **Best Use of Gemma** (\$200) — Google open-weight reasoning model
* 🌟 **Best Use of Render / DigitalOcean** (Deployment-ready)

---

## 📄 License

MIT License. Designed with ❤️ for freelancers and indie creators worldwide.
