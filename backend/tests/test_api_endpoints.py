"""
Automated Integration Tests for Backend REST API Endpoints.
"""

import pytest
import pytest_asyncio
import sys
import os
from httpx import AsyncClient, ASGITransport

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.app.main import app
from backend.app.database import init_db


@pytest.mark.asyncio
async def test_api_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_qds_session_lifecycle():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create Session
        sess_resp = await ac.post("/api/qds/session", json={
            "sender": "Alice",
            "receiver": "Bob",
            "bell_state": "PHI_PLUS",
            "key_length": 4
        })
        assert sess_resp.status_code == 201
        sess_data = sess_resp.json()
        session_id = sess_data["id"]
        assert len(sess_data["key_tokens"]) == 4

        # 2. Generate Signature
        sig_resp = await ac.post("/api/qds/signature/generate", json={
            "session_id": session_id,
            "message": "Approved transaction payload 0x88f2"
        })
        assert sig_resp.status_code == 201
        sig_data = sig_resp.json()
        signature_id = sig_data["id"]

        # 3. Verify Legitimate Signature
        verif_resp = await ac.post("/api/qds/signature/verify", json={
            "session_id": session_id,
            "signature_id": signature_id,
            "shots": 1024,
            "attack_type": "NONE"
        })
        assert verif_resp.status_code == 200
        verif_data = verif_resp.json()
        assert verif_data["status"] == "SECURE"
        assert verif_data["statistical_metrics"]["total_variation_distance"] < 0.15

        # 4. Verify with Attack Injection (Channel Tampering)
        attack_verif_resp = await ac.post("/api/qds/signature/verify", json={
            "session_id": session_id,
            "signature_id": signature_id,
            "shots": 1024,
            "attack_type": "CHANNEL_TAMPERING",
            "attack_severity": 0.50
        })
        assert attack_verif_resp.status_code == 200
        attack_data = attack_verif_resp.json()
        assert attack_data["status"] == "MALICIOUS"
        assert attack_data["attack_type"] == "CHANNEL_TAMPERING"


@pytest.mark.asyncio
async def test_attack_simulation_comparison():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/api/attacks/simulate", json={
            "attack_type": "SIGNATURE_FORGERY",
            "severity": 0.6,
            "shots": 1024
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["detection_verdict"] == "MALICIOUS"
        assert data["metrics_delta"]["tvd_delta"] > 0.05


@pytest.mark.asyncio
async def test_ai_copilot_explanation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/api/ai/explain", json={
            "user_query": "Why was the replay attack detected?",
            "context_data": {
                "status": "MALICIOUS",
                "attack_type": "REPLAY_ATTACK",
                "evidence": ["REPLAY VIOLATION: Nonce reuse detected."],
                "statistical_metrics": {"total_variation_distance": 0.01, "qber": 0.0, "fidelity": 0.99},
                "threshold_applied": 0.92
            }
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["verdict"] == "MALICIOUS"
        assert data["attack_type"] == "REPLAY_ATTACK"
        assert len(data["explanation"]) > 50
