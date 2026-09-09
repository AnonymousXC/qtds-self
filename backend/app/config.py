"""
Application Configuration and Environment Settings.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Information
    APP_NAME: str = "QTDS - Quantum Threat Detection System"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./qtds.db"
    # To use PostgreSQL: "postgresql+asyncpg://postgres:postgres@localhost:5432/qtds"
    
    # AI Quantum Security Copilot Settings (OpenAI Compatible)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: Optional[str] = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Deterministic Security Engine Thresholds (Configurable)
    FORGERY_THRESHOLD: float = 0.15          # TVD threshold for state forgery
    REPLAY_SIMILARITY_THRESHOLD: float = 0.92 # Statistical similarity threshold for replay
    CHANNEL_TAMPER_THRESHOLD: float = 0.10   # QBER threshold for channel eavesdropping
    CHI_SQUARE_ALPHA: float = 0.05           # Significance level for goodness of fit
    MIN_ACCEPTABLE_FIDELITY: float = 0.85    # Lower bound for quantum state fidelity
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
