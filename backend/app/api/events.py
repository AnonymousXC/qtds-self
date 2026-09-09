"""
Security Events and Thresholds API Endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..database import get_db
from ..models import SecurityEvent
from ..schemas import SecurityEventResponse, ThresholdConfigSchema
from ..core.thresholds import active_thresholds

router = APIRouter(prefix="/security", tags=["Security Events & Policies"])


@router.get("/events", response_model=List[SecurityEventResponse])
async def list_security_events(
    limit: int = Query(50, ge=1, le=200),
    severity: str = Query(None),
    attack_type: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).limit(limit)
    if severity:
        query = query.where(SecurityEvent.severity == severity.upper())
    if attack_type:
        query = query.where(SecurityEvent.attack_type == attack_type.upper())
        
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("/thresholds", response_model=ThresholdConfigSchema)
async def get_threshold_config():
    """
    Returns the currently active statistical detection thresholds.
    """
    return ThresholdConfigSchema(**active_thresholds.to_dict())


@router.post("/thresholds", response_model=ThresholdConfigSchema)
async def update_threshold_config(payload: ThresholdConfigSchema):
    """
    Updates the active mathematical detection thresholds dynamically in-memory.
    """
    active_thresholds.forgery_threshold = payload.forgery_threshold
    active_thresholds.replay_similarity_threshold = payload.replay_similarity_threshold
    active_thresholds.channel_tamper_threshold = payload.channel_tamper_threshold
    active_thresholds.chi_square_alpha = payload.chi_square_alpha
    active_thresholds.min_acceptable_fidelity = payload.min_acceptable_fidelity
    return ThresholdConfigSchema(**active_thresholds.to_dict())
