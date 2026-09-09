"""
QDS REST API Endpoints.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import (
    CreateSessionRequest,
    SessionResponse,
    GenerateSignatureRequest,
    SignatureResponse
)
from ..services import QDSService

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../quantum-engine")))
from qds_protocol import QDSSessionManager
from bell_states import BellState
from pauli import PauliBasis
from attack_models import AttackType

router = APIRouter(prefix="/qds", tags=["Quantum Digital Signatures"])


@router.post("/session", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_qds_session(
    payload: CreateSessionRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Initializes a new Quantum Digital Signature session, distributing entangled Bell pairs
    and generating Alice's quantum public/private key sequence.
    """
    try:
        session = await QDSService.create_session(
            db=db,
            sender=payload.sender,
            receiver=payload.receiver,
            bell_state=payload.bell_state,
            key_length=payload.key_length
        )
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions", response_model=List[SessionResponse])
async def list_qds_sessions(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    return await QDSService.list_sessions(db=db, limit=limit)


@router.get("/session/{session_id}", response_model=SessionResponse)
async def get_qds_session(
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    session = await QDSService.get_session(db=db, session_id=session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session


@router.post("/signature/generate", response_model=SignatureResponse, status_code=status.HTTP_201_CREATED)
async def generate_qds_signature(
    payload: GenerateSignatureRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Generates a teleportation-based quantum digital signature for a message payload.
    """
    try:
        sig = await QDSService.generate_signature(
            db=db,
            session_id=payload.session_id,
            message=payload.message,
            signer_id=payload.signer_id
        )
        return sig
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/signature/{signature_id}", response_model=SignatureResponse)
async def get_qds_signature(
    signature_id: str,
    db: AsyncSession = Depends(get_db)
):
    sig = await QDSService.get_signature(db=db, signature_id=signature_id)
    if not sig:
        raise HTTPException(status_code=404, detail="Signature not found.")
    return sig


@router.get("/session/{session_id}/signatures", response_model=List[SignatureResponse])
async def list_qds_signatures_for_session(
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    return await QDSService.list_signatures_by_session(db=db, session_id=session_id)


@router.get("/lab/simulate-circuit")
async def simulate_quantum_lab_circuit(
    input_state: str = Query("+", description="'0', '1', '+', '-', 'R', 'L'"),
    measurement_basis: str = Query("X", description="'Z', 'X', 'Y'"),
    bell_state: str = Query("PHI_PLUS", description="'PHI_PLUS', 'PHI_MINUS', 'PSI_PLUS', 'PSI_MINUS'"),
    shots: int = Query(2048, ge=128, le=10000),
    attack_type: str = Query("NONE"),
    attack_severity: float = Query(0.0, ge=0.0, le=1.0)
):
    """
    Runs an interactive Qiskit quantum circuit simulation for the Quantum Lab explorer.
    """
    try:
        attack_enum = AttackType(attack_type.upper()) if attack_type else AttackType.NONE
    except Exception:
        attack_enum = AttackType.NONE

    res = QDSSessionManager.execute_teleportation_qds_verification(
        input_state=input_state,
        measurement_basis=measurement_basis,
        bell_state=bell_state,
        shots=shots,
        attack_type=attack_enum,
        attack_severity=attack_severity
    )
    return res
