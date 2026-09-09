"""
Quantum Engine for Quantum Digital Signature (QDS) and Cyber Threat Detection.
"""

from .bell_states import BellState, create_bell_pair, get_theoretical_bell_density_matrix
from .pauli import PauliBasis, PauliOperator, prepare_state, apply_basis_transformation, apply_pauli_correction
from .teleportation import build_teleportation_circuit, get_expected_distribution
from .statistical_analysis import (
    total_variation_distance,
    hellinger_distance,
    chi_square_test,
    kl_divergence,
    compute_qber,
    estimate_state_fidelity,
    compute_comprehensive_metrics
)
from .attack_models import AttackType, inject_attack_into_circuit, get_attack_description
from .simulator import run_circuit_simulation, get_simulator
from .qds_protocol import QDSSessionManager

__all__ = [
    "BellState",
    "create_bell_pair",
    "get_theoretical_bell_density_matrix",
    "PauliBasis",
    "PauliOperator",
    "prepare_state",
    "apply_basis_transformation",
    "apply_pauli_correction",
    "build_teleportation_circuit",
    "get_expected_distribution",
    "total_variation_distance",
    "hellinger_distance",
    "chi_square_test",
    "kl_divergence",
    "compute_qber",
    "estimate_state_fidelity",
    "compute_comprehensive_metrics",
    "AttackType",
    "inject_attack_into_circuit",
    "get_attack_description",
    "run_circuit_simulation",
    "get_simulator",
    "QDSSessionManager"
]
