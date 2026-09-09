"""
SQLAlchemy Models for QDS Sessions and Teleportation Protocol State.
"""

from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, JSON, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base


class QDSSession(Base):
    __tablename__ = "qds_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    sender: Mapped[str] = mapped_column(String(64), default="Alice")
    receiver: Mapped[str] = mapped_column(String(64), default="Bob")
    session_nonce: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE") # ACTIVE, COMPLETED, TERMINATED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    qubit_count: Mapped[int] = mapped_column(Integer, default=3)
    bell_state: Mapped[str] = mapped_column(String(32), default="PHI_PLUS")
    key_length: Mapped[int] = mapped_column(Integer, default=5)
    key_tokens: Mapped[dict] = mapped_column(JSON, default=dict)
    
    signatures = relationship("Signature", back_populates="session", cascade="all, delete-orphan")
    verifications = relationship("VerificationAttempt", back_populates="session", cascade="all, delete-orphan")
    security_events = relationship("SecurityEvent", back_populates="session", cascade="all, delete-orphan")
