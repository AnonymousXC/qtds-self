"""
Dashboard Summary REST API Endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import DashboardSummaryResponse
from ..services import StatisticsService

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Telemetry"])


@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    """
    Returns real-time aggregated security metrics, attack distribution, and recent security events.
    """
    return await StatisticsService.get_dashboard_summary(db=db)
