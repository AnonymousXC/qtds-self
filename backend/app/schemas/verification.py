"""
Pydantic Schemas for Quantum Signature Verification and Statistical Telemetry.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class VerifySignatureRequest(BaseModel):
    session_id: str
    signature_id: str
    verifier_id: str = "Bob"
    shots: int = Field(default=2048, ge=256, le=10000)
    # Attack injection parameters for simulation/testing
    attack_type: str = Field(default="NONE", description="NONE, SIGNATURE_FORGERY, IMPERSONATION, REPLAY_ATTACK, CHANNEL_TAMPERING")
    attack_severity: float = Field(default=0.0, ge=0.0, le=1.0)
    tamper_qubit: int = Field(default=2, ge=0, le=2)


class StatisticalMetricsSchema(BaseModel):
    total_variation_distance: float
    hellinger_distance: float
    chi_square_statistic: float
    chi_square_p_value: float
    degrees_of_freedom: int
    kl_divergence: float
    qber: float
    fidelity: float


class CircuitMetadataSchema(BaseModel):
    depth: int
    total_gates: int
    gate_breakdown: Dict[str, int]
    backend: str
    diagram: str


class VerificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    signature_id: str
    verifier_id: str
    status: str # SECURE, SUSPICIOUS, MALICIOUS
    attack_type: str
    statistical_metrics: StatisticalMetricsSchema
    anomaly_score: float
    forgery_probability: float
    threshold_applied: float
    evidence: List[str]
    observed_distribution: Dict[str, float]
    expected_distribution: Dict[str, float]
    circuit_metadata: CircuitMetadataSchema
    execution_time_ms: float
    timestamp: datetime
