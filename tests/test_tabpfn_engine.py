"""
Tests for TabPFN Tabular Intelligence Engine
"""

from backend.services.tabpfn_engine import TabPFNAuditor
from backend.models.transaction import TaxCategory


def test_tabpfn_auditor_classification():
    auditor = TabPFNAuditor()
    raw_txns = [
        {"id": "t1", "date": "2026-03-01", "description": "GITHUB *COPILOT", "amount": -19.00, "category": "Uncategorized"},
        {"id": "t2", "date": "2026-03-02", "description": "DIGITALOCEAN DROPLETS", "amount": -48.00, "category": "Hosting"},
        {"id": "t3", "date": "2026-03-03", "description": "STRIPE PAYOUT", "amount": 3200.00, "category": "Deposit"},
    ]
    
    audit_res = auditor.run_full_audit(raw_txns, persona_name="Test Freelancer")
    summary = audit_res.summary
    
    assert summary.total_income == 3200.00
    assert summary.total_expenses == 67.00
    assert summary.total_deductible > 0
    assert summary.estimated_tax_savings > 0
    assert len(audit_res.transactions) == 3
    assert audit_res.transactions[0].predicted_category == TaxCategory.SOFTWARE_SAAS
    assert audit_res.transactions[1].predicted_category == TaxCategory.CLOUD_HOSTING
