"""
FastAPI Main Application Entry Point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .database import init_db, async_session_factory
from .api import api_router
from .services import QDSService, VerificationService
from .models import QDSSession
from sqlalchemy import select


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    await init_db()
    
    # Check and seed demo session if database is fresh
    async with async_session_factory() as db:
        res = await db.execute(select(QDSSession).limit(1))
        existing = res.scalar_one_or_none()
        if not existing:
            demo_sess = await QDSService.create_session(
                db=db,
                sender="Alice",
                receiver="Bob",
                bell_state="PHI_PLUS",
                key_length=5
            )
            demo_sig = await QDSService.generate_signature(
                db=db,
                session_id=demo_sess.id,
                message="Quantum Digital Signature Transaction #1042",
                signer_id="Alice"
            )
            # Run one baseline verification
            await VerificationService.verify_signature(
                db=db,
                session_id=demo_sess.id,
                signature_id=demo_sig.id,
                verifier_id="Bob",
                shots=2048,
                attack_type="NONE"
            )
            
    yield
    # Cleanup


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Quantum-Inspired Cyber Threat Detection for Digital Signature Security. "
        "Deterministic statistical quantum threat classification engine with auxiliary AI Copilot."
    ),
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "quantum_engine": "Qiskit Aer (Deterministic & Statistical)"
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to Quantum-Inspired Cyber Threat Detection API",
        "docs": "/docs",
        "health": "/health",
        "api": settings.API_PREFIX
    }
