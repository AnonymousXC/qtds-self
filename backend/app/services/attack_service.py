"""
Attack Simulation and Comparative Analysis Service.
"""

import uuid
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../quantum-engine")))
from qds_protocol import QDSSessionManager
from attack_models import AttackType, get_attack_description
from ..core.security_rules import evaluate_quantum_signature_security
from ..core.thresholds import active_thresholds
from ..models import AttackSimulation, SecurityEvent


class AttackService:
    @staticmethod
    async def simulate_attack_comparison(
        db: AsyncSession,
        session_id: str = None,
        attack_type: str = "CHANNEL_TAMPERING",
        severity: float = 0.5,
        shots: int = 2048,
        input_state: str = "+",
        measurement_basis: str = "X",
        bell_state: str = "PHI_PLUS"
    ) -> Dict[str, Any]:
        if not session_id:
            session_id = f"sim_sess_{uuid.uuid4().hex[:8]}"

        try:
            attack_enum = AttackType(attack_type.upper())
        except Exception:
            attack_enum = AttackType.CHANNEL_TAMPERING

        # 1. Run Baseline Clean Teleportation
        normal_result = QDSSessionManager.execute_teleportation_qds_verification(
            input_state=input_state,
            measurement_basis=measurement_basis,
            bell_state=bell_state,
            shots=shots,
            attack_type=AttackType.NONE,
            attack_severity=0.0
        )
        normal_eval = evaluate_quantum_signature_security(
            statistical_metrics=normal_result["statistical_metrics"],
            declared_attack_type="NONE",
            thresholds=active_thresholds
        )

        # 2. Run Attacked Teleportation
        attack_result = QDSSessionManager.execute_teleportation_qds_verification(
            input_state=input_state,
            measurement_basis=measurement_basis,
            bell_state=bell_state,
            shots=shots,
            attack_type=attack_enum,
            attack_severity=severity
        )
        attack_eval = evaluate_quantum_signature_security(
            statistical_metrics=attack_result["statistical_metrics"],
            declared_attack_type=attack_type,
            is_nonce_reused=(attack_type == "REPLAY_ATTACK"),
            is_key_mismatched=(attack_type == "IMPERSONATION"),
            thresholds=active_thresholds
        )

        # 3. Calculate Deltas
        n_stat = normal_result["statistical_metrics"]
        a_stat = attack_result["statistical_metrics"]
        
        delta = {
            "tvd_delta": round(a_stat["total_variation_distance"] - n_stat["total_variation_distance"], 5),
            "hellinger_delta": round(a_stat["hellinger_distance"] - n_stat["hellinger_distance"], 5),
            "qber_delta": round(a_stat["qber"] - n_stat["qber"], 5),
            "fidelity_drop": round(n_stat["fidelity"] - a_stat["fidelity"], 5),
            "chi2_increase": round(a_stat["chi_square_statistic"] - n_stat["chi_square_statistic"], 4)
        }

        # 4. Save Attack Simulation Record
        sim_record = AttackSimulation(
            id=f"asim_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            attack_type=attack_type,
            severity=severity,
            parameters={"shots": shots, "input_state": input_state, "basis": measurement_basis},
            detection_verdict=attack_eval["status"],
            tvd_measured=a_stat["total_variation_distance"],
            qber_measured=a_stat["qber"],
            timestamp=datetime.utcnow()
        )
        db.add(sim_record)

        # 5. Log Threat Event
        event = SecurityEvent(
            id=f"evt_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            event_type="ATTACK_SIMULATION_EXECUTED",
            severity="HIGH" if attack_eval["status"] == "MALICIOUS" else "MEDIUM",
            attack_type=attack_type,
            status=attack_eval["status"],
            risk_score=attack_eval["anomaly_score"],
            details=f"Simulated {attack_type} (severity {severity * 100:.0f}%). Detection verdict: {attack_eval['status']}. TVD Delta: +{delta['tvd_delta']:.4f}.",
            metadata_payload={"delta": delta, "evidence": attack_eval["evidence"]},
            timestamp=datetime.utcnow()
        )
        db.add(event)
        await db.commit()

        return {
            "attack_type": attack_type,
            "severity": severity,
            "normal_run": {
                **normal_result,
                "detection": normal_eval
            },
            "attack_run": {
                **attack_result,
                "detection": attack_eval
            },
            "metrics_delta": delta,
            "detection_verdict": attack_eval["status"],
            "evidence": attack_eval["evidence"]
        }
