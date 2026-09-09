"""
Bell State Preparation and Quantum Entanglement Utilities for QDS.

Implements the four maximally entangled two-qubit Bell states (EPR pairs):
|Phi+> = (|00> + |11>) / sqrt(2)
|Phi-> = (|00> - |11>) / sqrt(2)
|Psi+> = (|01> + |10>) / sqrt(2)
|Psi-> = (|01> - |10>) / sqrt(2)
"""

from enum import Enum
from typing import Dict, List, Tuple
import numpy as np
from qiskit import QuantumCircuit, QuantumRegister


class BellState(str, Enum):
    PHI_PLUS = "PHI_PLUS"   # (|00> + |11>) / sqrt(2)
    PHI_MINUS = "PHI_MINUS" # (|00> - |11>) / sqrt(2)
    PSI_PLUS = "PSI_PLUS"   # (|01> + |10>) / sqrt(2)
    PSI_MINUS = "PSI_MINUS" # (|01> - |10>) / sqrt(2)


def create_bell_pair(
    bell_state: BellState = BellState.PHI_PLUS,
    circuit: QuantumCircuit = None,
    qubit_a: int = 0,
    qubit_b: int = 1
) -> QuantumCircuit:
    """
    Constructs or appends a Bell state preparation circuit on the designated qubits.
    
    Args:
        bell_state: Which of the four Bell states to prepare.
        circuit: Optional existing QuantumCircuit to append to.
        qubit_a: Index of first qubit (Alice's half).
        qubit_b: Index of second qubit (Bob's half).
        
    Returns:
        QuantumCircuit containing the Bell state preparation gates.
    """
    if circuit is None:
        circuit = QuantumCircuit(max(qubit_a, qubit_b) + 1)
    
    # 1. Hadamard on first qubit to create superposition (|0> + |1>)/sqrt(2)
    circuit.h(qubit_a)
    
    # 2. CNOT with control qubit_a and target qubit_b creates entanglement
    circuit.cx(qubit_a, qubit_b)
    
    # 3. Apply phase/bit flips for other Bell states
    if bell_state == BellState.PHI_MINUS:
        circuit.z(qubit_a)
    elif bell_state == BellState.PSI_PLUS:
        circuit.x(qubit_b)
    elif bell_state == BellState.PSI_MINUS:
        circuit.z(qubit_a)
        circuit.x(qubit_b)
        
    return circuit


def get_theoretical_bell_density_matrix(bell_state: BellState) -> np.ndarray:
    """
    Returns theoretical 4x4 density matrix |B><B| for validation and fidelity checks.
    """
    s2 = 1.0 / np.sqrt(2)
    if bell_state == BellState.PHI_PLUS:
        vec = np.array([s2, 0, 0, s2], dtype=complex)
    elif bell_state == BellState.PHI_MINUS:
        vec = np.array([s2, 0, 0, -s2], dtype=complex)
    elif bell_state == BellState.PSI_PLUS:
        vec = np.array([0, s2, s2, 0], dtype=complex)
    elif bell_state == BellState.PSI_MINUS:
        vec = np.array([0, s2, -s2, 0], dtype=complex)
    else:
        raise ValueError(f"Unknown Bell state {bell_state}")
        
    return np.outer(vec, np.conj(vec))
