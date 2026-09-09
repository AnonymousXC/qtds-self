"""
SQLAlchemy Model for Quantum Signature Verification Attempts.
"""

from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, JSON, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base


class VerificationAttempt(Base):
    __tablename__ = "verification_attempts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(64), ForeignKey("qds_sessions.id"), index=True)
    signature_id: Mapped[str] = mapped_column(String(64), ForeignKey("signatures.id"), index=True)
    verifier_id: Mapped[str] = mapped_column(String(64), default="Bob")
    status: Mapped[str] = mapped_column(String(32))  # SECURE, SUSPICIOUS, MALICIOUS
    attack_type: Mapped[str] = mapped_column(String(64), default="NONE")
    
    # Statistical Distances
    total_variation_distance: Mapped[float] = mapped_column(Float)
    hellinger_distance: Mapped[float] = mapped_column(Float)
    chi_square_statistic: Mapped[float] = mapped_column(Float)
    chi_square_p_value: Mapped[float] = mapped_column(Float)
    kl_divergence: Mapped[float] = mapped_column(Float)
    qber: Mapped[float] = mapped_column(Float)
    fidelity: Mapped[float] = mapped_column(Float)
    
    # Risk Metrics
    anomaly_score: Mapped[float] = mapped_column(Float)
    forgery_probability: Mapped[float] = mapped_column(Float)
    threshold_applied: Mapped[float] = mapped_column(Float)
    
    # Telemetry JSON
    evidence: Mapped[list] = mapped_column(JSON) # List of deterministic reasons
    observed_distribution: Mapped[dict] = mapped_column(JSON)
    expected_distribution: Mapped[dict] = mapped_column(JSON)
    circuit_metadata: Mapped[dict] = mapped_column(JSON)
    execution_time_ms: Mapped[float] = mapped_column(Float)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    session = relationship("QDSSession", back_populates="verifications")
    signature = relationship("Signature", back_populates="verifications")

    @property
    def statistical_metrics(self) -> dict:
        return {
            "total_variation_distance": self.total_variation_distance,
            "hellinger_distance": self.hellinger_distance,
            "chi_square_statistic": self.chi_square_statistic,
            "chi_square_p_value": self.chi_square_p_value,
            "degrees_of_freedom": 1,
            "kl_divergence": self.kl_divergence,
            "qber": self.qber,
            "fidelity": self.fidelity
        }
