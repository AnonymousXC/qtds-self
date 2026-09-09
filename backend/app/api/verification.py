"""
Verification REST API Endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import VerifySignatureRequest, VerificationResponse
from ..services import VerificationService

router = APIRouter(prefix="/qds", tags=["Quantum Signature Verification"])


@router.post("/signature/verify", response_model=VerificationResponse, status_code=status.HTTP_200_OK)
async def verify_qds_signature(
    payload: VerifySignatureRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Executes real quantum teleportation verification circuit on Qiskit Aer, computes
    projective measurement distributions, evaluates deterministic threat detection rules,
    and returns comprehensive statistical distance proof.
    """
    try:
        verification = await VerificationService.verify_signature(
            db=db,
            session_id=payload.session_id,
            signature_id=payload.signature_id,
            verifier_id=payload.verifier_id,
            shots=payload.shots,
            attack_type=payload.attack_type,
            attack_severity=payload.attack_severity,
            tamper_qubit=payload.tamper_qubit
        )
        return verification
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verification/{verification_id}", response_model=VerificationResponse)
async def get_verification_attempt(
    verification_id: str,
    db: AsyncSession = Depends(get_db)
):
    verif = await VerificationService.get_verification(db=db, verification_id=verification_id)
    if not verif:
        raise HTTPException(status_code=404, detail="Verification attempt not found.")
    return verif


@router.get("/verifications", response_model=List[VerificationResponse])
async def list_verification_attempts(
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    return await VerificationService.list_verifications(db=db, limit=limit)
