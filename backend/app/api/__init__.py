"""
API Package Init.
"""

from fastapi import APIRouter
from .qds import router as qds_router
from .verification import router as verif_router
from .attacks import router as attacks_router
from .dashboard import router as dashboard_router
from .events import router as events_router
from .ai import router as ai_router
from .reports import router as reports_router
from .ws import router as ws_router

api_router = APIRouter()
api_router.include_router(qds_router)
api_router.include_router(verif_router)
api_router.include_router(attacks_router)
api_router.include_router(dashboard_router)
api_router.include_router(events_router)
api_router.include_router(ai_router)
api_router.include_router(reports_router)
api_router.include_router(ws_router)

__all__ = ["api_router"]
