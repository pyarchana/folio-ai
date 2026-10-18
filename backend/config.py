"""
Folio Configuration Module
Centralized settings for Folio: Local-First AI Financial Auditor.
"""

from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_DIR = BASE_DIR / "data" / "samples"


class Settings(BaseModel):
    app_name: str = "Folio"
    app_version: str = "1.0.0"
    app_tagline: str = "Local-First AI Financial Auditor for Freelancers & Solopreneurs"
    host: str = "127.0.0.1"
    port: int = 8000
    
    # AI Engine Settings
    use_tabpfn_real: bool = True
    gemma_model_id: str = "google/gemma-2-2b-it"
    enable_local_privacy_shield: bool = True
    
    # Tax Calculation Defaults
    default_tax_rate: float = 0.30  # Estimated self-employment + income tax rate (30%)
    irs_tax_year: str = "2026"


settings = Settings()
