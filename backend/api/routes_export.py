"""
Export API Endpoints
Generates downloadable IRS Schedule C summaries and accountant-ready CSV files.
"""

import io
import csv
from typing import Dict, Any, List
from fastapi import APIRouter
from fastapi.responses import Response

router = APIRouter(prefix="/api/export", tags=["Export"])


@router.post("/schedule-c-csv")
def export_schedule_c_csv(payload: Dict[str, Any]):
    """Generates standardized Schedule C deduction schedule as a downloadable CSV."""
    transactions: List[Dict[str, Any]] = payload.get("transactions", [])
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Standard Schedule C header
    writer.writerow([
        "Transaction ID",
        "Date",
        "Vendor Description",
        "Original Amount ($)",
        "Schedule C Tax Category",
        "Deductible %",
        "Deductible Amount ($)",
        "IRS Statutory Code",
        "Audit Risk Rating",
    ])
    
    for t in transactions:
        if t.get("is_deductible"):
            writer.writerow([
                t.get("id"),
                t.get("date"),
                t.get("description"),
                f"{abs(float(t.get('amount', 0.0))):.2f}",
                t.get("predicted_category"),
                f"{int(float(t.get('deductible_percentage', 1.0)) * 100)}%",
                f"{float(t.get('deductible_amount', 0.0)):.2f}",
                "IRC §162(a) / §179",
                t.get("audit_risk", "LOW"),
            ])
            
    csv_bytes = output.getvalue().encode("utf-8")
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=folio_schedule_c_deductions.csv"}
    )
