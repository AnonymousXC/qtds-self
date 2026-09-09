"""
Quantum Signature Verification Service Layer.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../quantum-engine")))
from qds_protocol import QDSSessionManager
from attack_models import AttackType
from ..core.security_rules import evaluate_quantum_signature_security
from ..core.thresholds import active_thresholds
from ..models import QDSSession, Signature, VerificationAttempt, SecurityEvent


class VerificationService:
    @staticmethod
    async def verify_signature(
        db: AsyncSession,
        session_id: str,
        signature_id: str,
        verifier_id: str = "Bob",
        shots: int = 2048,
        attack_type: str = "NONE",
        attack_severity: float = 0.0,
        tamper_qubit: int = 2
    ) -> VerificationAttempt:
        session_res = await db.execute(select(QDSSession).where(QDSSession.id == session_id))
        session = session_res.scalar_one_or_none()
        if not session:
            raise ValueError(f"Session {session_id} not found.")

        signature = None
        if signature_id and signature_id not in ("default_sig", "latest"):
            sig_res = await db.execute(select(Signature).where(Signature.id == signature_id))
            signature = sig_res.scalar_one_or_none()

        if not signature:
            # Fallback to latest signature for this session
            sig_res = await db.execute(
                select(Signature).where(Signature.session_id == session_id).order_by(Signature.created_at.desc()).limit(1)
            )
            signature = sig_res.scalar_one_or_none()

        if not signature:
            # Auto-generate a valid signature on the fly for this session
            signature = await QDSService.generate_signature(
                db=db,
                session_id=session_id,
                message="Quantum Digital Signature Payload Verification",
                signer_id=session.sender or "Alice"
            )

        signature_id = signature.id

        # Pick primary signature token to verify
        sig_tokens = signature.signature_tokens or []
        first_token = sig_tokens[0] if sig_tokens else {"quantum_state": "+", "measurement_basis": "X"}
        
        target_state = first_token.get("quantum_state", "+")
        target_basis = first_token.get("measurement_basis", "X")
        bell_state = session.bell_state

        # Parse attack type enum
        try:
            attack_enum = AttackType(attack_type.upper())
        except Exception:
            attack_enum = AttackType.NONE

        # 1. Execute Real Quantum Simulation via Qiskit Engine
        teleport_result = QDSSessionManager.execute_teleportation_qds_verification(
            input_state=target_state,
            measurement_basis=target_basis,
            bell_state=bell_state,
            shots=shots,
            attack_type=attack_enum,
            attack_severity=attack_severity,
            tamper_qubit=tamper_qubit,
            include_pauli_corrections=True
        )

        # 2. Run Deterministic Threat Detection (Zero AI/ML)
        detection = evaluate_quantum_signature_security(
            statistical_metrics=teleport_result["statistical_metrics"],
            declared_attack_type=attack_type,
            is_nonce_reused=(attack_type == "REPLAY_ATTACK"),
            is_key_mismatched=(attack_type == "IMPERSONATION"),
            thresholds=active_thresholds
        )

        verif_id = f"qver_{uuid.uuid4().hex[:8]}"
        stats = teleport_result["statistical_metrics"]
        
        attempt = VerificationAttempt(
            id=verif_id,
            session_id=session_id,
            signature_id=signature_id,
            verifier_id=verifier_id,
            status=detection["status"],
            attack_type=detection["attack_type"],
            total_variation_distance=stats["total_variation_distance"],
            hellinger_distance=stats["hellinger_distance"],
            chi_square_statistic=stats["chi_square_statistic"],
            chi_square_p_value=stats["chi_square_p_value"],
            kl_divergence=stats["kl_divergence"],
            qber=stats["qber"],
            fidelity=stats["fidelity"],
            anomaly_score=detection["anomaly_score"],
            forgery_probability=detection["forgery_probability"],
            threshold_applied=detection["threshold_applied"],
            evidence=detection["evidence"],
            observed_distribution=teleport_result["observed_distribution"],
            expected_distribution=teleport_result["expected_distribution"],
            circuit_metadata=teleport_result["circuit_metadata"],
            execution_time_ms=teleport_result["execution_time_ms"],
            timestamp=datetime.utcnow()
        )
        db.add(attempt)

        # 3. Create Security Event
        severity_map = {
            "SECURE": "INFO",
            "SUSPICIOUS": "MEDIUM",
            "MALICIOUS": "CRITICAL"
        }
        event = SecurityEvent(
            id=f"evt_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            event_type="SIGNATURE_VERIFIED",
            severity=severity_map.get(detection["status"], "INFO"),
            attack_type=detection["attack_type"],
            status=detection["status"],
            risk_score=detection["anomaly_score"],
            details=(
                f"Quantum signature verification completed with verdict: {detection['status']}. "
                f"Attack classification: {detection['attack_type']}. "
                f"TVD: {stats['total_variation_distance']}, QBER: {stats['qber'] * 100:.1f}%."
            ),
            metadata_payload={
                "verification_id": verif_id,
                "evidence": detection["evidence"],
                "statistical_metrics": stats,
                "anomaly_score": detection["anomaly_score"]
            },
            timestamp=datetime.utcnow()
        )
        db.add(event)
        await db.commit()
        await db.refresh(attempt)
        return attempt

    @staticmethod
    async def get_verification(db: AsyncSession, verification_id: str) -> Optional[VerificationAttempt]:
        result = await db.execute(select(VerificationAttempt).where(VerificationAttempt.id == verification_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def list_verifications(db: AsyncSession, limit: int = 50) -> List[VerificationAttempt]:
        result = await db.execute(select(VerificationAttempt).order_by(VerificationAttempt.timestamp.desc()).limit(limit))
        return list(result.scalars().all())
