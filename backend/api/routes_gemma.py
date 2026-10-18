"""
Gemma 2 Tax Defense API Endpoints
Generates formal IRS Schedule C audit defense rationales powered by Gemma 2 open weights.
"""

from typing import Dict, Any
from fastapi import APIRouter
from ..models.transaction import Transaction, TaxCategory
from ..models.audit import DeductionRationale, AuditDefenseRequest
from ..services.gemma_engine import GemmaTaxDefenseCopilot

router = APIRouter(prefix="/api/gemma", tags=["Gemma 2 Defense"])
copilot = GemmaTaxDefenseCopilot()


@router.post("/defense", response_model=DeductionRationale)
def generate_tax_defense(payload: Dict[str, Any]):
    """Generates audit defense statement and IRS code citation for a specific line-item."""
    txn_data = payload.get("transaction", {})
    context = payload.get("custom_context", "")

    # Reconstruct transaction model
    txn = Transaction(
        id=txn_data.get("id", "txn_sample"),
        date=txn_data.get("date", "2026-03-01"),
        description=txn_data.get("description", "Software Tool"),
        amount=float(txn_data.get("amount", -50.0)),
        predicted_category=TaxCategory(txn_data.get("predicted_category", TaxCategory.SOFTWARE_SAAS.value)),
        confidence=float(txn_data.get("confidence", 0.95)),
        is_deductible=bool(txn_data.get("is_deductible", True)),
        deductible_amount=float(txn_data.get("deductible_amount", 50.0)),
        audit_risk=txn_data.get("audit_risk", "LOW"),
    )

    return copilot.generate_defense_rationale(txn, custom_context=context)
