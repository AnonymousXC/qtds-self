"""
Security Reports API Endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import GenerateReportRequest, AIReportResponse
from ..services import ReportService

router = APIRouter(prefix="/reports", tags=["Security Reports"])


@router.post("/generate", response_model=AIReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_security_report(
    payload: GenerateReportRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        report = await ReportService.generate_report(
            db=db,
            verification_id=payload.verification_id,
            session_id=payload.session_id,
            title=payload.title
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[AIReportResponse])
async def list_security_reports(
    db: AsyncSession = Depends(get_db)
):
    return await ReportService.list_reports(db=db)


@router.get("/{report_id}", response_model=AIReportResponse)
async def get_security_report(
    report_id: str,
    db: AsyncSession = Depends(get_db)
):
    report = await ReportService.get_report(db=db, report_id=report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return report
