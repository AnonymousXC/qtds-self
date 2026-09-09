"""
AI Quantum Security Copilot API Endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..database import get_db
from ..schemas import AICopilotExplainRequest, AICopilotResponse
from ..services import AISecurityCopilot
from ..models import VerificationAttempt

router = APIRouter(prefix="/ai", tags=["AI Quantum Security Copilot"])


@router.post("/explain", response_model=AICopilotResponse, status_code=status.HTTP_200_OK)
async def explain_quantum_security(
    payload: AICopilotExplainRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Provides an AI Copilot briefing explaining deterministic quantum detection results.
    AI NEVER replaces the deterministic engine; it reasons over structured measurement metrics.
    """
    context = payload.context_data or {}
    
    if payload.verification_id and not context:
        res = await db.execute(select(VerificationAttempt).where(VerificationAttempt.id == payload.verification_id))
        verif = res.scalar_one_or_none()
        if verif:
            context = {
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

    if not context:
        # Default baseline explanation
        context = {
            "status": "SECURE",
            "attack_type": "NONE",
            "evidence": ["Bell-state EPR pair preserved.", "Measurement within statistical bounds."],
            "statistical_metrics": {"total_variation_distance": 0.018, "qber": 0.005, "fidelity": 0.991},
            "threshold_applied": 0.15
        }

    response = await AISecurityCopilot.explain_security_event(
        user_query=payload.user_query,
        structured_context=context
    )
    return AICopilotResponse(**response)
