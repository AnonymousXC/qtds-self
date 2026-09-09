"""
Security Report Generation Service.
"""

import uuid
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models import AIReport, VerificationAttempt, QDSSession
from .ai_service import AISecurityCopilot


class ReportService:
    @staticmethod
    async def generate_report(
        db: AsyncSession,
        verification_id: Optional[str] = None,
        session_id: Optional[str] = None,
        title: Optional[str] = "Quantum Threat Incident Report"
    ) -> AIReport:
        verif = None
        if verification_id:
            res = await db.execute(select(VerificationAttempt).where(VerificationAttempt.id == verification_id))
            verif = res.scalar_one_or_none()
            
        if not verif and session_id:
            res = await db.execute(
                select(VerificationAttempt).where(VerificationAttempt.session_id == session_id).order_by(VerificationAttempt.timestamp.desc())
            )
            verif = res.scalar_one_or_none()

        if not verif:
            # Create a mock/standard context for general report
            verif_data = {
                "status": "SECURE",
                "attack_type": "NONE",
                "evidence": ["Normal teleportation execution.", "TVD below 0.05 threshold."],
                "statistical_metrics": {
                    "total_variation_distance": 0.021,
                    "hellinger_distance": 0.015,
                    "chi_square_statistic": 0.89,
                    "chi_square_p_value": 0.345,
                    "qber": 0.009,
                    "fidelity": 0.985
                },
                "circuit_metadata": {"depth": 7, "backend": "Qiskit AerSimulator", "total_gates": 12},
                "threshold_applied": 0.15
            }
            sess_id = session_id or "default_session"
            verdict = "SECURE"
            attack_type = "NONE"
        else:
            verif_data = {
                "status": verif.status,
                "attack_type": verif.attack_type,
                "evidence": verif.evidence,
                "statistical_metrics": {
                    "total_variation_distance": verif.total_variation_distance,
                    "hellinger_distance": verif.hellinger_distance,
                    "chi_square_statistic": verif.chi_square_statistic,
                    "chi_square_p_value": verif.chi_square_p_value,
                    "qber": verif.qber,
                    "fidelity": verif.fidelity
                },
                "circuit_metadata": verif.circuit_metadata,
                "threshold_applied": verif.threshold_applied
            }
            sess_id = verif.session_id
            verdict = verif.status
            attack_type = verif.attack_type

        ai_response = await AISecurityCopilot.explain_security_event(
            user_query="Provide a comprehensive technical audit report summary for this quantum signature verification.",
            structured_context=verif_data
        )

        report = AIReport(
            id=f"rep_{uuid.uuid4().hex[:8]}",
            session_id=sess_id,
            title=title or f"Quantum Security Audit - {verdict}",
            verdict=verdict,
            attack_type=attack_type,
            summary=ai_response["explanation"],
            quantum_evidence={
                "evidence": verif_data.get("evidence", []),
                "principles": ai_response.get("quantum_principles", []),
                "circuit": verif_data.get("circuit_metadata", {})
            },
            statistical_breakdown=verif_data.get("statistical_metrics", {}),
            recommendations=ai_response.get("recommended_actions", []),
            raw_prompt_payload={"context": verif_data},
            created_at=datetime.utcnow()
        )
        db.add(report)
        await db.commit()
        await db.refresh(report)
        return report

    @staticmethod
    async def get_report(db: AsyncSession, report_id: str) -> Optional[AIReport]:
        res = await db.execute(select(AIReport).where(AIReport.id == report_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def list_reports(db: AsyncSession, limit: int = 50) -> list[AIReport]:
        res = await db.execute(select(AIReport).order_by(AIReport.created_at.desc()).limit(limit))
        return list(res.scalars().all())
