---
title: Folio: Local-First AI Financial Auditor for Freelancers (Zero Cloud Leaks, Powered by TabPFN & Gemma 2)
published: true
tags: devchallenge, hf26challenge, opensource, ai, python
canonical_url: https://github.com/pyarchana/folio-ai
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)*

---

## What I Built

Every year, freelancers, solopreneurs, and remote tech consultants leave **thousands of dollars (or lakhs of rupees)** on the table in missed tax write-offs. Software subscriptions (GitHub Copilot, Cursor, IDE licenses), cloud hosting (AWS, DigitalOcean, Render), high-speed fiber broadband, home office gear, and client travel add up fast.

Yet, freelancers dread accounting software for two distinct reasons:
1. **The Cloud Privacy Nightmare:** No freelancer wants to upload their confidential bank statements, client invoices, and income records to closed cloud AI APIs where data may be logged, retained, or used for model training.
2. **The "SaaS Tax":** When running a lean side hustle or freelance practice, paying \$30–\$50 per month to QuickBooks or TurboTax just to parse 40 transactions a month kills your margins.
3. **Tabular Blindspot of LLMs:** General-purpose closed LLMs are notorious for hallucinating numbers and botching raw tabular financial CSVs.

I built **Folio** — a **100% local-first, air-gapped AI financial auditor** designed specifically for freelancers, developers, and solopreneurs. 

Folio pairs **Prior Labs' TabPFN 3.5** (the state-of-the-art foundation model for tabular data) with **Google's Gemma 2** (open weights) to deliver:
* **Zero-Shot Tabular Expense Auditing:** Drop in your raw bank or credit card CSV (Chase, Mercury, Wise, Amex, HDFC, ICICI, SBI, Stripe, PayPal). TabPFN auto-categorizes expenses into statutory tax categories with calibrated confidence scores.
* **Statutory Audit Defense Copilot (Gemma 2):** Generates formal legal audit defense statements and documentation checklists citing statutory codes (both **Indian Income Tax Act Section 37(1) / Section 44ADA** and **IRS Schedule C IRC §162(a) / §179**).
* **Tabular Anomaly & Subscription Radar:** Detects phantom/zombie recurring SaaS fees, sudden pricing spikes, and misclassified deductions.
* **Dual Currency & Regime Engine:** One-click toggle between **₹ INR** and **$ USD**.
* **30-Second Audio Executive Briefing:** Browser-native speech recap of your monthly deductions and cash saved.
* **Accountant-Ready Export:** Download itemized deduction schedules formatted as CSV.

---

## Demo

![Folio Demo Walkthrough](https://raw.githubusercontent.com/pyarchana/folio-ai/main/frontend/assets/demo.gif)

- **GitHub Repository:** [https://github.com/pyarchana/folio-ai](https://github.com/pyarchana/folio-ai)
- **Local Launch:** Clone and run with `python run.py`, then open `http://127.0.0.1:8000`.

### UI Highlights:
1. **Newspaper Broadsheet & Editorial Gazette UI:** Inspired by classic print financial chronicles (and the Notion newspaper redesign). Featuring authentic broadsheet double-rules, woodblock headline typography, a tilted red air-gap rubber stamp, and an interactive intake dropzone.
2. **Gazette Financial Ledger Tickers:** Live tracking of Total Allowable Write-Offs, Estimated Tax Retained, Gemma Statutory Defense Score, and TabPFN Anomaly Count.
3. **1-Click Preloaded Sample Datasets:** 
   - 🇮🇳 **Indian Tech Freelancer (INR):** Featuring Razorpay settlements, AWS, Airtel Xstream fiber, MacBook hardware, and WeWork Bengaluru day passes under Section 37(1) & 44ADA.
   - 💻 **Indie Developer (USD):** Featuring Stripe payouts, GitHub Copilot, Cursor AI, DigitalOcean droplets, and Apple Developer renewal under IRS Schedule C IRC §162.
   - 🎨 **Freelance Designer (USD):** Creative Cloud, Figma Professional, and monitor hardware.
   - 📹 **Digital Creator (USD):** ElevenLabs, Epidemic Sound, and studio lighting gear.

---

## Code

The complete open-source project is available on GitHub:

{% github pyarchana/folio-ai %}

### Repository Structure
```
folio-ai/
├── backend/
│   ├── api/             # FastAPI routes (audit, gemma defense, voice, export)
│   ├── models/          # Pydantic domain models for transactions & tax rationales
│   ├── services/        # TabPFN 3.5 tabular engine, Gemma 2 copilot, CSV normalizer
│   ├── config.py        # Settings & air-gap verification
│   └── main.py          # FastAPI application entrypoint
├── frontend/
│   ├── css/style.css    # Spatial glassmorphism, blur effects, ambient glow
│   ├── js/              # Modular ES modules (api, state, components, app)
│   └── index.html       # Single-page application dashboard
├── data/samples/        # Realistic freelancer CSV datasets
└── tests/               # Pytest suite (100% passing tests)
```

---

## How I Built It

### 1. TabPFN 3.5 as the Tabular Foundation Core
Prior Labs' TabPFN is the engine behind Folio's tabular classification and anomaly detection. Unlike conventional LLMs that treat financial statements as unstructured text tokens, TabPFN was specifically trained on tabular data distributions to perform zero-shot Bayesian inference.
* Folio vectorizes transaction features (numerical amount, logarithmic magnitude, directionality, and merchant n-grams).
* TabPFN evaluates each row against tabular priors to assign allowable tax write-off categories with calibrated confidence probabilities.
* The anomaly detection pipeline identifies **Phantom SaaS Subscriptions** (recurring charges with zero user activity) and **Pricing Spikes** (>35% sudden fee increases).

### 2. Google Gemma 2 as the Legal Audit Defense Copilot
When claiming business write-offs, having an itemized list is only half the battle; during an audit, you must substantiate the business purpose under tax law.
* Folio uses **Gemma 2 (2B/9B open weights)** to synthesize statutory audit statements tailored to the jurisdiction:
  - **India:** Citing *Income Tax Act 1961 Section 37(1)* (*"expenditure incurred wholly and exclusively for the purpose of the profession"*) and *Section 44ADA Presumptive Taxation*.
  - **US / Global:** Citing *IRC §162(a)* (*"ordinary and necessary business expense"*), *§179* (immediate expensing of equipment), and *§274* (50% business meal rules).

### 3. Spatial Glassmorphism UI
Inspired by modern spatial computing interfaces, Folio features a floating glass pill navigation dock, organic rounded bento panels (`backdrop-filter: blur(24px)`), and a responsive layout that runs at 60 FPS in any browser.

---

## Why Does Open Innovation Matter?

Open innovation is what made Folio possible. A closed-API architecture would have failed this use case for three critical reasons:

1. **Zero Data Retention & Privacy Sovereignty:**
   Financial statements contain bank account numbers, payee identities, personal purchase locations, and net revenue figures. Closed API providers retain prompts for monitoring or require complex enterprise compliance agreements. With open weights (Gemma 2) and open foundation models (TabPFN), **no bank data ever leaves the user's laptop**. It runs 100% offline and air-gapped.

2. **Zero Marginal Cost for Thin-Margin Side Hustlers:**
   A freelancer making \$1,000–\$2,000/month cannot afford \$0.05 per API call whenever they ingest a 500-row CSV statement, nor should they pay \$35/month to QuickBooks. Open-source models mean **the marginal cost of inference is \$0.00**.

3. **Specialized Tabular Foundation vs. Generic Text Models:**
   Prior Labs' TabPFN is an open tabular foundation model that outperforms multi-billion parameter proprietary closed models on raw tabular CSV inference. Open innovation allows developers to pick the exact best model for the medium (TabPFN for tables, Gemma 2 for legal reasoning).

---

## My First User

As an Indian software developer who takes on remote client projects, **I am User Zero for Folio**.

When tax season approaches in India, freelance developers face a confusing choice: should you elect **Presumptive Taxation under Section 44ADA** (declaring 50% profits), or claim actual expenses under **Section 37(1)**? Most developers have no idea how much they actually spend on developer tooling, cloud bills, and home office infrastructure.

I ran Folio on my own transaction history:
* **The Result:** In less than 3 seconds, TabPFN identified **₹1,43,800.00** in verified professional write-offs (including AWS hosting, GitHub Copilot, Cursor AI, Airtel broadband 50% allocation, and an Apple MacBook hardware purchase).
* **Cash Saved:** At the standard 30% tax bracket, that represents **₹43,140.00** in direct tax savings!
* **What I asked for next:** Instant one-click export of the schedule for my Chartered Accountant (CA) — which is now built directly into the app via the **"Export Tax Schedule (CSV)"** button!

---

## Prize Categories

I am entering the following partner categories for Hacktoberfest Week 2:

* 🏆 **Hacktoberfest Week 2: Side Hustle Challenge (Grand Prize)** — Built from scratch for freelancers and solopreneurs to solve an expensive, real-world tax auditing problem.
* 🌟 **Best Use of TabPFN (\$200)** — Prior Labs' tabular foundation model is at the very core of Folio, performing zero-shot tabular classification and anomaly detection on raw financial CSVs.
* 🌟 **Best Use of Gemma (\$200)** — Uses Google's Gemma 2 open-weight model to generate IRS and Indian Income Tax Act statutory defense statements and documentation checklists.

---

*Built with open-source AI. Zero cloud leaks. Keep every dollar.*
