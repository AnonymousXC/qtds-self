"""
SQLAlchemy Models for Attacks, Security Events, Thresholds, and AI Reports.
"""

from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, JSON, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base


class AttackSimulation(Base):
    __tablename__ = "attack_simulations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(64), index=True)
    attack_type: Mapped[str] = mapped_column(String(64)) # SIGNATURE_FORGERY, IMPERSONATION, REPLAY_ATTACK, CHANNEL_TAMPERING
    severity: Mapped[float] = mapped_column(Float, default=0.5)
    parameters: Mapped[dict] = mapped_column(JSON, default=dict)
    detection_verdict: Mapped[str] = mapped_column(String(32))
    tvd_measured: Mapped[float] = mapped_column(Float)
    qber_measured: Mapped[float] = mapped_column(Float)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(64), ForeignKey("qds_sessions.id"), index=True, nullable=True)
    event_type: Mapped[str] = mapped_column(String(64))
    severity: Mapped[str] = mapped_column(String(32)) # INFO, LOW, MEDIUM, HIGH, CRITICAL
    attack_type: Mapped[str] = mapped_column(String(64), default="NONE")
    status: Mapped[str] = mapped_column(String(32)) # SECURE, DETECTED, BLOCKED, ANOMALY
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    details: Mapped[str] = mapped_column(Text)
    metadata_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    session = relationship("QDSSession", back_populates="security_events")


class ThresholdConfig(Base):
    __tablename__ = "threshold_configs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default="default")
    forgery_threshold: Mapped[float] = mapped_column(Float, default=0.15)
    replay_similarity_threshold: Mapped[float] = mapped_column(Float, default=0.92)
    channel_tamper_threshold: Mapped[float] = mapped_column(Float, default=0.10)
    chi_square_alpha: Mapped[float] = mapped_column(Float, default=0.05)
    min_acceptable_fidelity: Mapped[float] = mapped_column(Float, default=0.85)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AIReport(Base):
    __tablename__ = "ai_reports"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(255))
    verdict: Mapped[str] = mapped_column(String(32))
    attack_type: Mapped[str] = mapped_column(String(64))
    summary: Mapped[str] = mapped_column(Text)
    quantum_evidence: Mapped[dict] = mapped_column(JSON)
    statistical_breakdown: Mapped[dict] = mapped_column(JSON)
    recommendations: Mapped[list] = mapped_column(JSON)
    raw_prompt_payload: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
