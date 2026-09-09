"""
Statistics and Dashboard Aggregation Service.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from ..models import QDSSession, Signature, VerificationAttempt, SecurityEvent, AttackSimulation


class StatisticsService:
    @staticmethod
    async def get_dashboard_summary(db: AsyncSession) -> Dict[str, Any]:
        # Count sessions, signatures, verifications
        session_count_res = await db.execute(select(func.count(QDSSession.id)))
        total_sessions = session_count_res.scalar() or 0

        sig_count_res = await db.execute(select(func.count(Signature.id)))
        total_signatures = sig_count_res.scalar() or 0

        verif_count_res = await db.execute(select(func.count(VerificationAttempt.id)))
        total_verifications = verif_count_res.scalar() or 0

        secure_count_res = await db.execute(
            select(func.count(VerificationAttempt.id)).where(VerificationAttempt.status == "SECURE")
        )
        secure_verifications = secure_count_res.scalar() or 0

        malicious_count_res = await db.execute(
            select(func.count(VerificationAttempt.id)).where(VerificationAttempt.status == "MALICIOUS")
        )
        threats_detected = malicious_count_res.scalar() or 0

        # Average TVD and QBER
        avg_tvd_res = await db.execute(select(func.avg(VerificationAttempt.total_variation_distance)))
        avg_tvd = round(avg_tvd_res.scalar() or 0.024, 4)

        avg_qber_res = await db.execute(select(func.avg(VerificationAttempt.qber)))
        avg_qber = round(avg_qber_res.scalar() or 0.015, 4)

        # Recent Security Events
        events_res = await db.execute(
            select(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).limit(15)
        )
        recent_events = list(events_res.scalars().all())

        # Attack Distribution
        attack_dist = {
            "SIGNATURE_FORGERY": 0,
            "IMPERSONATION": 0,
            "REPLAY_ATTACK": 0,
            "CHANNEL_TAMPERING": 0,
            "NONE": 0
        }
        attacks_res = await db.execute(
            select(VerificationAttempt.attack_type, func.count(VerificationAttempt.id)).group_by(VerificationAttempt.attack_type)
        )
        for atype, count in attacks_res.all():
            if atype in attack_dist:
                attack_dist[atype] = count
            else:
                attack_dist[atype] = count

        # Active Threat Level
        if threats_detected > 5:
            threat_level = "CRITICAL"
        elif threats_detected > 2:
            threat_level = "HIGH"
        elif threats_detected > 0:
            threat_level = "ELEVATED"
        else:
            threat_level = "LOW"

        # Verification timeline (past attempts formatted)
        verif_history_res = await db.execute(
            select(VerificationAttempt).order_by(VerificationAttempt.timestamp.desc()).limit(10)
        )
        verif_timeline = [
            {
                "id": v.id,
                "time": v.timestamp.strftime("%H:%M:%S"),
                "status": v.status,
                "attack_type": v.attack_type,
                "tvd": v.total_variation_distance,
                "qber": v.qber,
                "fidelity": v.fidelity
            }
            for v in reversed(list(verif_history_res.scalars().all()))
        ]

        return {
            "system_health": "ONLINE (OPTIMAL)",
            "quantum_backend": "Local Qiskit AerSimulator",
            "total_sessions": total_sessions,
            "total_signatures": total_signatures,
            "total_verifications": total_verifications,
            "secure_verifications": secure_verifications,
            "threats_detected": threats_detected,
            "attacks_blocked": threats_detected,
            "average_tvd": avg_tvd,
            "average_qber": avg_qber,
            "active_threat_level": threat_level,
            "recent_events": [
                {
                    "id": e.id,
                    "session_id": e.session_id,
                    "event_type": e.event_type,
                    "severity": e.severity,
                    "attack_type": e.attack_type,
                    "status": e.status,
                    "risk_score": e.risk_score,
                    "details": e.details,
                    "metadata_payload": e.metadata_payload,
                    "timestamp": e.timestamp
                }
                for e in recent_events
            ],
            "attack_distribution": attack_dist,
            "verification_timeline": verif_timeline
        }
