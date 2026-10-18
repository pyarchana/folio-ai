"""
Tests for CSV Ingestion and Normalization
"""

from backend.services.csv_parser import clean_vendor_name, parse_csv_content


def test_clean_vendor_name():
    raw = "AMZN MKTP US*1A2B3C SEATTLE WA"
    cleaned = clean_vendor_name(raw)
    assert "SEATTLE" not in cleaned
    assert "AMZN" in cleaned or "Amazon" in cleaned


def test_parse_csv_content():
    sample_csv = """Date,Description,Amount,Category
2026-03-01,GITHUB *COPILOT,-19.00,Software
2026-03-02,AWS INFRASTRUCTURE,-45.50,Cloud
2026-03-03,STRIPE PAYOUT,2500.00,Income
"""
    records = parse_csv_content(sample_csv)
    assert len(records) == 3
    assert records[0]["amount"] == -19.00
    assert records[2]["amount"] == 2500.00
    assert records[0]["id"].startswith("txn_")
