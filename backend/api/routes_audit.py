"""
Audit API Endpoints
Endpoints for CSV uploading, sample dataset auditing, and tabular analysis.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any

from ..services.csv_parser import parse_csv_content, parse_csv_file
from ..services.tabpfn_engine import TabPFNAuditor
from ..models.audit import AuditResult
from ..config import DATA_DIR

router = APIRouter(prefix="/api/audit", tags=["Audit"])
auditor = TabPFNAuditor()

PERSONAS = {
    "indie-dev": {
        "name": "Indie Developer",
        "file": "indie_dev_transactions.csv",
        "description": "SaaS founder & indie hacker with cloud hosting, AI APIs, and developer tools.",
    },
    "freelance-designer": {
        "name": "Freelance Designer",
        "file": "freelance_designer_transactions.csv",
        "description": "Product designer with Creative Cloud, Figma, hardware, and client travel expenses.",
    },
    "digital-creator": {
        "name": "Digital Creator",
        "file": "digital_creator_transactions.csv",
        "description": "Content creator & reseller with media subscriptions, equipment, and digital asset income.",
    },
}


@router.get("/samples")
def get_sample_personas() -> Dict[str, Any]:
    """Lists available sample personas for 1-click evaluation."""
    return {"personas": PERSONAS}


@router.get("/sample/{persona_key}", response_model=AuditResult)
def audit_sample_persona(persona_key: str):
    """Runs full TabPFN audit on a pre-packaged sample dataset."""
    if persona_key not in PERSONAS:
        raise HTTPException(status_code=404, detail="Persona not found")
        
    p_info = PERSONAS[persona_key]
    file_path = DATA_DIR / p_info["file"]
    
    if not file_path.exists():
        raise HTTPException(status_code=500, detail="Sample dataset missing")
        
    raw_txns = parse_csv_file(str(file_path))
    return auditor.run_full_audit(raw_txns, persona_name=p_info["name"])


@router.post("/upload", response_model=AuditResult)
async def upload_csv_and_audit(file: UploadFile = File(...)):
    """Uploads user bank CSV and executes local TabPFN audit with 100% data privacy."""
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    try:
        content_bytes = await file.read()
        csv_text = content_bytes.decode("utf-8", errors="replace")
        raw_txns = parse_csv_content(csv_text)
        
        if not raw_txns:
            raise HTTPException(status_code=400, detail="No readable transaction records found in CSV")
            
        return auditor.run_full_audit(raw_txns, persona_name="Custom Upload")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CSV: {str(e)}")
