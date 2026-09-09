"""
Pauli Operators, Bases, and Projective Measurement Logic.

Implements Pauli matrices I, X, Y, Z, Pauli eigenstates in computational (Z),
Hadamard (X), and circular (Y) bases, and projective measurement transformations.
"""

from enum import Enum
from typing import Dict, Tuple, List
import numpy as np
from qiskit import QuantumCircuit


class PauliBasis(str, Enum):
    Z = "Z"  # Computational basis {|0>, |1>}
    X = "X"  # Hadamard/Diagonal basis {|+>, |->}
    Y = "Y"  # Circular basis {|i>, |-i>} (or {|R>, |L>})


class PauliOperator(str, Enum):
    I = "I"
    X = "X"
    Y = "Y"
    Z = "Z"


# Matrix representations
PAULI_MATRICES = {
    PauliOperator.I: np.array([[1, 0], [0, 1]], dtype=complex),
    PauliOperator.X: np.array([[0, 1], [1, 0]], dtype=complex),
    PauliOperator.Y: np.array([[0, -1j], [1j, 0]], dtype=complex),
    PauliOperator.Z: np.array([[1, 0], [0, -1]], dtype=complex),
}

# Standard Eigenstate vectors
EIGENSTATES = {
    # Z basis
    "0": np.array([1, 0], dtype=complex),
    "1": np.array([0, 1], dtype=complex),
    # X basis: |+> = (|0>+|1>)/sqrt(2), |-> = (|0>-|1>)/sqrt(2)
    "+": np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=complex),
    "-": np.array([1/np.sqrt(2), -1/np.sqrt(2)], dtype=complex),
    # Y basis: |R> = (|0>+i|1>)/sqrt(2), |L> = (|0>-i|1>)/sqrt(2)
    "R": np.array([1/np.sqrt(2), 1j/np.sqrt(2)], dtype=complex),
    "L": np.array([1/np.sqrt(2), -1j/np.sqrt(2)], dtype=complex),
}


def prepare_state(state_label: str, circuit: QuantumCircuit = None, qubit: int = 0) -> QuantumCircuit:
    """
    Appends gates to prepare a single qubit in one of the 6 standard BB84/6-state eigenstates:
    '0', '1', '+', '-', 'R', 'L'.
    """
    if circuit is None:
        circuit = QuantumCircuit(qubit + 1)
        
    if state_label == "0":
        pass  # Qubit defaults to |0>
    elif state_label == "1":
        circuit.x(qubit)
    elif state_label == "+":
        circuit.h(qubit)
    elif state_label == "-":
        circuit.x(qubit)
        circuit.h(qubit)
    elif state_label == "R":
        circuit.h(qubit)
        circuit.s(qubit)  # ( |0> + i|1> ) / sqrt(2)
    elif state_label == "L":
        circuit.x(qubit)
        circuit.h(qubit)
        circuit.s(qubit)  # ( |0> - i|1> ) / sqrt(2)
    else:
        raise ValueError(f"Unsupported state label: {state_label}")
        
    return circuit


def apply_basis_transformation(basis: PauliBasis, circuit: QuantumCircuit, qubit: int = 0) -> QuantumCircuit:
    """
    Rotates qubit into standard computational Z-basis prior to projective measurement.
    - Z basis: No rotation needed.
    - X basis: Hadamard (H) gate maps {|+>, |->} to {|0>, |1>}.
    - Y basis: S^dagger then H maps {|R>, |L>} to {|0>, |1>}.
    """
    if basis == PauliBasis.Z:
        pass
    elif basis == PauliBasis.X:
        circuit.h(qubit)
    elif basis == PauliBasis.Y:
        circuit.sdg(qubit)
        circuit.h(qubit)
    else:
        raise ValueError(f"Unsupported Pauli basis: {basis}")
        
    return circuit


def apply_pauli_correction(c_z: int, c_x: int, circuit: QuantumCircuit, qubit: int = 2) -> QuantumCircuit:
    """
    Applies conditional Pauli correction Z^c_z * X^c_x on Bob's qubit based on Alice's classical measurement bits.
    In teleportation:
    (m1, m0) = (0, 0) -> Identity (I)
    (m1, m0) = (0, 1) -> X gate
    (m1, m0) = (1, 0) -> Z gate
    (m1, m0) = (1, 1) -> Z then X (i.e. ZX = -iY)
    """
    if c_x == 1:
        circuit.x(qubit)
    if c_z == 1:
        circuit.z(qubit)
        
    return circuit
