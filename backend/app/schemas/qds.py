"""
Pydantic Schemas for QDS Sessions, Keys, and Teleportation Protocol.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class KeyTokenSchema(BaseModel):
    index: int
    token_id: str
    state: str # '0', '1', '+', '-', 'R', 'L'
    basis: str # 'Z', 'X', 'Y'


class CreateSessionRequest(BaseModel):
    sender: str = Field(default="Alice", description="Party initiating signature")
    receiver: str = Field(default="Bob", description="Party verifying signature")
    bell_state: str = Field(default="PHI_PLUS", description="Entangled Bell pair type")
    key_length: int = Field(default=5, ge=1, le=20, description="Quantum key sequence length")


class SessionResponse(BaseModel):
    id: str
    sender: str
    receiver: str
    session_nonce: str
    status: str
    created_at: datetime
    qubit_count: int
    bell_state: str
    key_length: int
    key_tokens: List[Dict[str, Any]]


class GenerateSignatureRequest(BaseModel):
    session_id: str
    message: str
    signer_id: str = "Alice"


class SignatureResponse(BaseModel):
    id: str
    session_id: str
    message: str
    message_digest: str
    signer_id: str
    created_at: datetime
    signature_tokens: List[Dict[str, Any]]
