"""
Audit and Deduction Defense Data Models
Defines structured schemas for audit results, tax schedules, and Gemma 2 defense rationales.
"""

from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from .transaction import Transaction, AnomalyItem


class DeductionRationale(BaseModel):
    transaction_id: str
    vendor_name: str
    amount: float
    irs_code_reference: str = Field(..., description="Relevant tax code, e.g., IRC §162(a)")
    business_purpose: str = Field(..., description="Legitimate business justification")
    audit_defense_statement: str = Field(..., description="Formal statement ready for audit defense")
    required_documentation: List[str] = Field(default_factory=list, description="Documents to retain (receipts, logs)")
    deduction_confidence: float = Field(0.95, description="Confidence in deduction validity")
    generated_by: str = Field("Gemma 2 (Google Open Weights)", description="Attribution model")


class AuditDefenseRequest(BaseModel):
    transaction_id: str
    custom_context: Optional[str] = Field(None, description="Optional extra user context (e.g., 'Project client was Acme Corp')")


class AuditSummary(BaseModel):
    total_income: float
    total_expenses: float
    total_deductible: float
    estimated_tax_savings: float
    effective_tax_rate: float
    tax_health_score: int  # 0 to 100
    total_transactions: int
    deductible_count: int
    anomaly_count: int
    category_totals: Dict[str, float]


class AuditResult(BaseModel):
    summary: AuditSummary
    transactions: List[Transaction]
    anomalies: List[AnomalyItem]
    persona_name: Optional[str] = None
