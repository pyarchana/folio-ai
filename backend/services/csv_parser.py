"""
CSV Ingestion & Normalization Service
Smart financial CSV parser supporting common bank exports (Chase, Amex, Mercury, Wise, Stripe, PayPal).
"""

import io
import re
import hashlib
from typing import List, Dict, Any, Optional
import pandas as pd


# Common bank header variations
DATE_COLUMNS = ["date", "post date", "posted date", "transaction date", "trans date"]
DESC_COLUMNS = ["description", "memo", "payee", "merchant", "name", "narrative", "details"]
AMOUNT_COLUMNS = ["amount", "value", "net", "total"]
DEBIT_COLUMNS = ["debit", "withdrawal", "charge", "out"]
CREDIT_COLUMNS = ["credit", "deposit", "in"]
CAT_COLUMNS = ["category", "type", "tag", "classification"]


def clean_vendor_name(raw_text: str) -> str:
    """Extracts clean human-readable vendor name from messy bank transaction text."""
    if not raw_text or not isinstance(raw_text, str):
        return "Unknown Vendor"
    
    # Remove common bank noise
    text = re.sub(r"\b(pos debit|recurring|authorized on|web purchase|debit card purchase|bill payment)\b", "", raw_text, flags=re.IGNORECASE)
    # Remove card masks and IDs like *1234, #9876, *1A2B3C
    text = re.sub(r"[\*#]\w+", "", text)
    # Remove phone numbers or addresses (e.g., SAN FRANCISCO CA, WA, NY 10001)
    text = re.sub(r"\b[A-Z]{2}\s+\d{5}(-\d{4})?\b", "", text)
    text = re.sub(r"\b[A-Z\s]{4,}\s+(CA|WA|NY|TX|FL|DE|NV|IL)\b", "", text)
    # Remove trailing digits or store numbers
    text = re.sub(r"\b\d{4,}\b", "", text)
    # Clean whitespace
    text = " ".join(text.split()).strip()
    
    return text if len(text) >= 2 else raw_text.strip()


def detect_columns(df: pd.DataFrame) -> Dict[str, Optional[str]]:
    """Intelligently detects column mappings from lowercased dataframe headers."""
    col_map = {c.lower().strip(): c for c in df.columns}
    
    mapping = {
        "date": None,
        "description": None,
        "amount": None,
        "debit": None,
        "credit": None,
        "category": None,
    }
    
    for key, candidates in [
        ("date", DATE_COLUMNS),
        ("description", DESC_COLUMNS),
        ("amount", AMOUNT_COLUMNS),
        ("debit", DEBIT_COLUMNS),
        ("credit", CREDIT_COLUMNS),
        ("category", CAT_COLUMNS),
    ]:
        for c in candidates:
            for header, original in col_map.items():
                if c == header or c in header:
                    mapping[key] = original
                    break
            if mapping[key]:
                break
                
    return mapping


def parse_csv_content(csv_string: str) -> List[Dict[str, Any]]:
    """Parses raw CSV string into normalized transaction dictionaries."""
    df = pd.read_csv(io.StringIO(csv_string))
    return normalize_dataframe(df)


def parse_csv_file(file_path: str) -> List[Dict[str, Any]]:
    """Parses CSV file from disk into normalized transaction dictionaries."""
    df = pd.read_csv(file_path)
    return normalize_dataframe(df)


def normalize_dataframe(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Converts diverse bank DataFrame rows into standard transaction records."""
    if df.empty:
        return []
        
    mapping = detect_columns(df)
    desc_col = mapping["description"] or df.columns[1]
    date_col = mapping["date"] or df.columns[0]
    
    records: List[Dict[str, Any]] = []
    
    for idx, row in df.iterrows():
        # Determine Amount
        amount = 0.0
        if mapping["amount"] and pd.notna(row.get(mapping["amount"])):
            amt_str = str(row[mapping["amount"]]).replace("$", "").replace(",", "").strip()
            try:
                amount = float(amt_str)
            except ValueError:
                amount = 0.0
        elif mapping["debit"] or mapping["credit"]:
            debit_val = 0.0
            credit_val = 0.0
            if mapping["debit"] and pd.notna(row.get(mapping["debit"])):
                try:
                    debit_val = float(str(row[mapping["debit"]]).replace("$", "").replace(",", "").strip())
                except ValueError:
                    pass
            if mapping["credit"] and pd.notna(row.get(mapping["credit"])):
                try:
                    credit_val = float(str(row[mapping["credit"]]).replace("$", "").replace(",", "").strip())
                except ValueError:
                    pass
            amount = credit_val - debit_val if credit_val > 0 else -debit_val

        # Normalize Date
        raw_date = str(row.get(date_col, "2026-01-01")).strip()
        try:
            parsed_date = pd.to_datetime(raw_date).strftime("%Y-%m-%d")
        except Exception:
            parsed_date = raw_date[:10] if len(raw_date) >= 10 else "2026-01-01"
            
        raw_desc = str(row.get(desc_col, f"Transaction {idx}")).strip()
        clean_desc = clean_vendor_name(raw_desc)
        category = str(row.get(mapping["category"], "Uncategorized")) if mapping["category"] else "Uncategorized"
        
        # Deterministic unique ID
        hash_input = f"{parsed_date}-{clean_desc}-{amount}-{idx}"
        txn_id = "txn_" + hashlib.md5(hash_input.encode("utf-8")).hexdigest()[:10]
        
        records.append({
            "id": txn_id,
            "date": parsed_date,
            "description": clean_desc,
            "raw_description": raw_desc,
            "amount": amount,
            "category": category,
        })
        
    return records
