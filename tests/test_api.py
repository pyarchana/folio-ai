"""
Tests for API Endpoints
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["app"] == "Folio"


def test_sample_personas_list():
    res = client.get("/api/audit/samples")
    assert res.status_code == 200
    data = res.json()
    assert "indie-dev" in data["personas"]


def test_audit_sample_persona():
    res = client.get("/api/audit/sample/indie-dev")
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert data["summary"]["total_deductible"] > 0
    assert len(data["transactions"]) > 0


def test_gemma_defense_generation():
    payload = {
        "transaction": {
            "id": "txn_test",
            "date": "2026-03-01",
            "description": "AWS Cloud Hosting",
            "amount": -75.00,
            "predicted_category": "Cloud Infrastructure & Hosting",
            "confidence": 0.95,
            "is_deductible": True,
            "deductible_amount": 75.00,
            "audit_risk": "LOW"
        },
        "custom_context": "Production API hosting"
    }
    res = client.post("/api/gemma/defense", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "IRC §162(a)" in data["irs_code_reference"]
    assert "AWS Cloud Hosting" in data["vendor_name"]
