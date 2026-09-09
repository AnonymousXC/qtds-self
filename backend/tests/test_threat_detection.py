"""
Automated Unit Tests for Deterministic Threat Detection Rules.
"""

import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.app.core.security_rules import evaluate_quantum_signature_security
from backend.app.core.thresholds import DetectionThresholds


def test_legitimate_signature_classification():
    stats = {
        "total_variation_distance": 0.02,
        "hellinger_distance": 0.015,
        "chi_square_statistic": 0.5,
        "chi_square_p_value": 0.48,
        "qber": 0.01,
        "fidelity": 0.985
    }
    eval_res = evaluate_quantum_signature_security(stats, declared_attack_type="NONE")
    assert eval_res["status"] == "SECURE"
    assert eval_res["attack_type"] == "NONE"
    assert eval_res["anomaly_score"] < 0.20
    assert len(eval_res["evidence"]) > 0


def test_forgery_threat_classification():
    stats = {
        "total_variation_distance": 0.35, # Exceeds 0.15 threshold
        "hellinger_distance": 0.30,
        "chi_square_statistic": 45.2,
        "chi_square_p_value": 0.00001,
        "qber": 0.25,
        "fidelity": 0.65 # Below 0.85
    }
    eval_res = evaluate_quantum_signature_security(stats, declared_attack_type="NONE")
    assert eval_res["status"] == "MALICIOUS"
    assert eval_res["attack_type"] == "SIGNATURE_FORGERY"
    assert eval_res["forgery_probability"] > 0.60
    assert any("FORGERY DETECTED" in e for e in eval_res["evidence"])


def test_replay_attack_classification():
    stats = {
        "total_variation_distance": 0.01,
        "hellinger_distance": 0.01,
        "chi_square_statistic": 0.2,
        "chi_square_p_value": 0.65,
        "qber": 0.005,
        "fidelity": 0.99
    }
    eval_res = evaluate_quantum_signature_security(stats, declared_attack_type="REPLAY_ATTACK", is_nonce_reused=True)
    assert eval_res["status"] == "MALICIOUS"
    assert eval_res["attack_type"] == "REPLAY_ATTACK"
    assert eval_res["anomaly_score"] >= 0.90
    assert any("REPLAY VIOLATION" in e for e in eval_res["evidence"])


def test_channel_tampering_classification():
    stats = {
        "total_variation_distance": 0.18,
        "hellinger_distance": 0.15,
        "chi_square_statistic": 22.0,
        "chi_square_p_value": 0.0001,
        "qber": 0.18, # Exceeds 0.10 threshold
        "fidelity": 0.82
    }
    eval_res = evaluate_quantum_signature_security(stats, declared_attack_type="CHANNEL_TAMPERING")
    assert eval_res["status"] == "MALICIOUS"
    assert eval_res["attack_type"] == "CHANNEL_TAMPERING"
    assert any("QUANTUM CHANNEL NOISE" in e for e in eval_res["evidence"])


def test_impersonation_classification():
    stats = {
        "total_variation_distance": 0.50,
        "hellinger_distance": 0.45,
        "chi_square_statistic": 95.0,
        "chi_square_p_value": 0.000001,
        "qber": 0.50,
        "fidelity": 0.50
    }
    eval_res = evaluate_quantum_signature_security(stats, declared_attack_type="IMPERSONATION", is_key_mismatched=True)
    assert eval_res["status"] == "MALICIOUS"
    assert eval_res["attack_type"] == "IMPERSONATION"
    assert any("IMPERSONATION DETECTED" in e for e in eval_res["evidence"])
