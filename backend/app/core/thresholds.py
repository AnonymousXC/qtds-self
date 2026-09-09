"""
Core Thresholds Management for Deterministic Threat Detection.
"""

from typing import Dict
from dataclasses import dataclass
from ..config import settings


@dataclass
class DetectionThresholds:
    forgery_threshold: float = settings.FORGERY_THRESHOLD
    replay_similarity_threshold: float = settings.REPLAY_SIMILARITY_THRESHOLD
    channel_tamper_threshold: float = settings.CHANNEL_TAMPER_THRESHOLD
    chi_square_alpha: float = settings.CHI_SQUARE_ALPHA
    min_acceptable_fidelity: float = settings.MIN_ACCEPTABLE_FIDELITY

    def to_dict(self) -> Dict[str, float]:
        return {
            "forgery_threshold": self.forgery_threshold,
            "replay_similarity_threshold": self.replay_similarity_threshold,
            "channel_tamper_threshold": self.channel_tamper_threshold,
            "chi_square_alpha": self.chi_square_alpha,
            "min_acceptable_fidelity": self.min_acceptable_fidelity,
        }


# Global in-memory active thresholds (can be updated dynamically via API)
active_thresholds = DetectionThresholds()
