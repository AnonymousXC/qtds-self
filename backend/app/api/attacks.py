"""
Attack Simulation REST API Endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import SimulateAttackRequest, AttackComparisonResponse
from ..services import AttackService

router = APIRouter(prefix="/attacks", tags=["Attack Simulator"])


@router.post("/simulate", response_model=AttackComparisonResponse, status_code=status.HTTP_200_OK)
async def simulate_attack(
    payload: SimulateAttackRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Runs a controlled cyber-physical quantum attack simulation and compares the resulting
    measurements against normal teleportation baseline, calculating TVD and QBER deltas.
    """
    try:
        comparison = await AttackService.simulate_attack_comparison(
            db=db,
            session_id=payload.session_id,
            attack_type=payload.attack_type,
            severity=payload.severity,
            shots=payload.shots,
            input_state=payload.input_state,
            measurement_basis=payload.measurement_basis,
            bell_state=payload.bell_state
        )
        return comparison
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
