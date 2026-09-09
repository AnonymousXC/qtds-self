"""
SQLAlchemy Model for Generated Quantum Digital Signatures.
"""

from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, JSON, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base


class Signature(Base):
    __tablename__ = "signatures"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(64), ForeignKey("qds_sessions.id"), index=True)
    message: Mapped[str] = mapped_column(Text)
    message_digest: Mapped[str] = mapped_column(String(128))
    signature_tokens: Mapped[dict] = mapped_column(JSON) # Teleportation classical bits & key indices
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    signer_id: Mapped[str] = mapped_column(String(64), default="Alice")
    
    session = relationship("QDSSession", back_populates="signatures")
    verifications = relationship("VerificationAttempt", back_populates="signature", cascade="all, delete-orphan")
