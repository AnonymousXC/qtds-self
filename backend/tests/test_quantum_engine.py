"""
Automated Unit Tests for Quantum Engine.
"""

import sys
import os
import pytest
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../quantum-engine")))
from bell_states import BellState, create_bell_pair, get_theoretical_bell_density_matrix
from pauli import prepare_state, apply_basis_transformation, PauliBasis, EIGENSTATES
from teleportation import build_teleportation_circuit, get_expected_distribution
from statistical_analysis import (
    total_variation_distance,
    hellinger_distance,
    chi_square_test,
    compute_qber,
    estimate_state_fidelity
)
from attack_models import AttackType, inject_attack_into_circuit
from simulator import run_circuit_simulation
from qds_protocol import QDSSessionManager


def test_bell_state_generation():
    circ = create_bell_pair(BellState.PHI_PLUS)
    assert circ.num_qubits == 2
    assert circ.depth() >= 2
    
    rho = get_theoretical_bell_density_matrix(BellState.PHI_PLUS)
    assert rho.shape == (4, 4)
    assert np.isclose(np.trace(rho), 1.0)


def test_teleportation_noiseless_fidelity():
    # Teleport |+> state and measure in X basis
    res = QDSSessionManager.execute_teleportation_qds_verification(
        input_state="+",
        measurement_basis="X",
        bell_state="PHI_PLUS",
        shots=1024,
        attack_type=AttackType.NONE
    )
    
    assert res["qubit_count"] == 3
    assert res["execution_time_ms"] > 0
    # In ideal teleportation of |+> measured in X basis, outcome is '0' with high probability (>95%)
    bob_counts = res["bob_measurement_counts"]
    prob_0 = bob_counts.get("0", 0) / 1024
    assert prob_0 > 0.90
    assert res["statistical_metrics"]["total_variation_distance"] < 0.10
    assert res["statistical_metrics"]["fidelity"] > 0.90


def test_statistical_distance_calculations():
    p = {"0": 1.0, "1": 0.0}
    q = {"0": 1.0, "1": 0.0}
    assert total_variation_distance(p, q) == 0.0
    assert hellinger_distance(p, q) == 0.0
    assert estimate_state_fidelity(p, q) == 1.0
    
    # Orthogonal states
    r = {"0": 0.0, "1": 1.0}
    assert np.isclose(total_variation_distance(p, r), 1.0)
    assert np.isclose(hellinger_distance(p, r), 1.0)
    assert np.isclose(estimate_state_fidelity(p, r), 0.0)


def test_channel_tampering_attack():
    # Inject depolarizing noise
    res = QDSSessionManager.execute_teleportation_qds_verification(
        input_state="+",
        measurement_basis="X",
        bell_state="PHI_PLUS",
        shots=1024,
        attack_type=AttackType.CHANNEL_TAMPERING,
        attack_severity=0.60
    )
    
    # Perturbation causes TVD and QBER to elevate
    assert res["statistical_metrics"]["qber"] > 0.10
    assert res["statistical_metrics"]["total_variation_distance"] > 0.10
