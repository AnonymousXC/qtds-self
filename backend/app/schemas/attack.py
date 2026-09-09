"""
Pydantic Schemas for Attack Simulation, Security Events, AI Copilot, and Reports.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# Attacks
class SimulateAttackRequest(BaseModel):
    session_id: Optional[str] = None
    attack_type: str = Field(..., description="SIGNATURE_FORGERY, IMPERSONATION, REPLAY_ATTACK, CHANNEL_TAMPERING")
    severity: float = Field(default=0.5, ge=0.0, le=1.0)
    shots: int = Field(default=2048, ge=256, le=10000)
    input_state: str = "+"
    measurement_basis: str = "X"
    bell_state: str = "PHI_PLUS"


class AttackComparisonResponse(BaseModel):
    attack_type: str
    severity: float
    normal_run: Dict[str, Any]
    attack_run: Dict[str, Any]
    metrics_delta: Dict[str, float]
    detection_verdict: str
    evidence: List[str]


# Security Events
class SecurityEventResponse(BaseModel):
    id: str
    session_id: Optional[str]
    event_type: str
    severity: str
    attack_type: str
    status: str
    risk_score: float
    details: str
    metadata_payload: Dict[str, Any]
    timestamp: datetime


# Dashboard
class DashboardSummaryResponse(BaseModel):
    system_health: str
    quantum_backend: str
    total_sessions: int
    total_signatures: int
    total_verifications: int
    secure_verifications: int
    threats_detected: int
    attacks_blocked: int
    average_tvd: float
    average_qber: float
    active_threat_level: str # LOW, ELEVATED, HIGH, CRITICAL
    recent_events: List[SecurityEventResponse]
    attack_distribution: Dict[str, int]
    verification_timeline: List[Dict[str, Any]]


# AI Copilot
class AICopilotExplainRequest(BaseModel):
    verification_id: Optional[str] = None
    session_id: Optional[str] = None
    user_query: Optional[str] = None
    context_data: Optional[Dict[str, Any]] = None


class AICopilotResponse(BaseModel):
    query: str
    explanation: str
    verdict: str
    attack_type: str
    confidence_note: str = "AI-generated explanation based on deterministic quantum analysis"
    evidence_referenced: List[str]
    quantum_principles: List[str]
    recommended_actions: List[str]


# Thresholds
class ThresholdConfigSchema(BaseModel):
    forgery_threshold: float = Field(default=0.15, ge=0.01, le=1.0)
    replay_similarity_threshold: float = Field(default=0.92, ge=0.5, le=1.0)
    channel_tamper_threshold: float = Field(default=0.10, ge=0.01, le=1.0)
    chi_square_alpha: float = Field(default=0.05, ge=0.001, le=0.5)
    min_acceptable_fidelity: float = Field(default=0.85, ge=0.1, le=1.0)


# Reports
class GenerateReportRequest(BaseModel):
    verification_id: Optional[str] = None
    session_id: Optional[str] = None
    title: Optional[str] = "Quantum Threat Incident Report"


class AIReportResponse(BaseModel):
    id: str
    session_id: str
    title: str
    verdict: str
    attack_type: str
    summary: str
    quantum_evidence: Dict[str, Any]
    statistical_breakdown: Dict[str, Any]
    recommendations: List[str]
    created_at: datetime
