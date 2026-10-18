"""
Transaction Data Models
Defines structured schema for financial line-items, tax categories, and anomalies.
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class TaxCategory(str, Enum):
    SOFTWARE_SAAS = "Software & SaaS Subscriptions"
    CLOUD_HOSTING = "Cloud Infrastructure & Hosting"
    EQUIPMENT_HARDWARE = "Equipment & Hardware (Sec. 179)"
    OFFICE_SUPPLIES = "Home Office & Workspace Supplies"
    PROFESSIONAL_SERVICES = "Legal, Accounting & Contractor Fees"
    EDUCATION_RESEARCH = "Books, Courses & Research"
    CLIENT_MEALS = "Business Meals & Entertainment (50%)"
    TRAVEL_TRANSPORT = "Business Travel & Transport"
    COMMUNICATION_INTERNET = "Internet & Mobile Phone (Business %)"
    PERSONAL_NON_DEDUCTIBLE = "Personal / Non-Deductible"
    INCOME = "Business Income / Revenue"


class AnomalyType(str, Enum):
    PHANTOM_SUBSCRIPTION = "Zombie / Inactive Subscription"
    PRICE_SPIKE = "Unexpected Fee Spike"
    DUPLICATE_CHARGE = "Duplicate Vendor Charge"
    OVERLOOKED_WRITE_OFF = "High-Confidence Missed Deduction"
    SUSPICIOUS_PERSONAL = "Borderline Personal Split"


class Transaction(BaseModel):
    id: str = Field(..., description="Unique transaction hash or ID")
    date: str = Field(..., description="Date formatted as YYYY-MM-DD")
    description: str = Field(..., description="Vendor or clean transaction description")
    raw_description: Optional[str] = Field(None, description="Original bank statement text")
    amount: float = Field(..., description="Transaction amount (negative for expense, positive for income)")
    category: str = Field("Uncategorized", description="Original bank category")
    predicted_category: TaxCategory = Field(TaxCategory.PERSONAL_NON_DEDUCTIBLE)
    confidence: float = Field(0.0, description="TabPFN classification confidence (0.0 to 1.0)")
    is_deductible: bool = Field(False, description="Whether this expense is a deductible business expense")
    deductible_percentage: float = Field(1.0, description="Portion allowable (e.g. 0.5 for meals, 1.0 for software)")
    deductible_amount: float = Field(0.0, description="Dollar amount eligible for deduction")
    audit_risk: str = Field("LOW", description="Risk rating: LOW, MEDIUM, or HIGH")


class AnomalyItem(BaseModel):
    transaction_id: str
    anomaly_type: AnomalyType
    title: str
    description: str
    amount: float
    potential_savings: float
    confidence_score: float
    suggested_action: str
