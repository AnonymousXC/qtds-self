"""
QDS Protocol Service Layer.
"""

import uuid
import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import sys
import os
# Ensure quantum-engine is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../quantum-engine")))
from qds_protocol import QDSSessionManager
from bell_states import BellState
from ..models import QDSSession, Signature, SecurityEvent


class QDSService:
    @staticmethod
    async def create_session(
        db: AsyncSession,
        sender: str = "Alice",
        receiver: str = "Bob",
        bell_state: str = "PHI_PLUS",
        key_length: int = 5
    ) -> QDSSession:
        keypair = QDSSessionManager.generate_quantum_keypair(length=key_length)
        session_id = f"qds_sess_{uuid.uuid4().hex[:8]}"
        session_nonce = f"nonce_{uuid.uuid4().hex[:12]}"
        
        session = QDSSession(
            id=session_id,
            sender=sender,
            receiver=receiver,
            session_nonce=session_nonce,
            status="ACTIVE",
            created_at=datetime.utcnow(),
            qubit_count=3,
            bell_state=bell_state,
            key_length=key_length,
            key_tokens=keypair["tokens"]
        )
        db.add(session)
        
        # Log Security Event
        event = SecurityEvent(
            id=f"evt_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            event_type="SESSION_INITIALIZED",
            severity="INFO",
            attack_type="NONE",
            status="SECURE",
            risk_score=0.0,
            details=f"Initialized QDS session {session_id} with {key_length} quantum key states and Bell state {bell_state}.",
            metadata_payload={"key_tokens_count": key_length, "bell_state": bell_state},
            timestamp=datetime.utcnow()
        )
        db.add(event)
        await db.commit()
        await db.refresh(session)
        return session

    @staticmethod
    async def get_session(db: AsyncSession, session_id: str) -> Optional[QDSSession]:
        result = await db.execute(select(QDSSession).where(QDSSession.id == session_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def list_sessions(db: AsyncSession, limit: int = 50) -> List[QDSSession]:
        result = await db.execute(select(QDSSession).order_by(QDSSession.created_at.desc()).limit(limit))
        return list(result.scalars().all())

    @staticmethod
    async def generate_signature(
        db: AsyncSession,
        session_id: str,
        message: str,
        signer_id: str = "Alice"
    ) -> Signature:
        session = await QDSService.get_session(db, session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found.")

        # Compute deterministic message digest
        digest = hashlib.sha256(message.encode("utf-8")).hexdigest()
        
        # Map message bits to quantum teleportation signature tokens
        key_tokens = session.key_tokens
        sig_tokens = []
        for i, token in enumerate(key_tokens):
            # Message bit selection
            bit = int(digest[i % len(digest)], 16) % 2
            sig_tokens.append({
                "token_index": i,
                "token_id": token["token_id"],
                "message_bit": bit,
                "quantum_state": token["state"],
                "measurement_basis": token["basis"],
                "teleportation_channel_id": f"ep_channel_{i}_{uuid.uuid4().hex[:6]}"
            })
            
        sig_id = f"qsig_{uuid.uuid4().hex[:8]}"
        sig = Signature(
            id=sig_id,
            session_id=session_id,
            message=message,
            message_digest=digest,
            signature_tokens=sig_tokens,
            created_at=datetime.utcnow(),
            signer_id=signer_id
        )
        db.add(sig)
        
        event = SecurityEvent(
            id=f"evt_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            event_type="SIGNATURE_GENERATED",
            severity="INFO",
            attack_type="NONE",
            status="SECURE",
            risk_score=0.0,
            details=f"Generated Quantum Digital Signature {sig_id} for message: '{message[:30]}...'",
            metadata_payload={"signature_id": sig_id, "digest": digest},
            timestamp=datetime.utcnow()
        )
        db.add(event)
        await db.commit()
        await db.refresh(sig)
        return sig

    @staticmethod
    async def get_signature(db: AsyncSession, signature_id: str) -> Optional[Signature]:
        result = await db.execute(select(Signature).where(Signature.id == signature_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def list_signatures_by_session(db: AsyncSession, session_id: str) -> List[Signature]:
        result = await db.execute(
            select(Signature).where(Signature.session_id == session_id).order_by(Signature.created_at.desc())
        )
        return list(result.scalars().all())
