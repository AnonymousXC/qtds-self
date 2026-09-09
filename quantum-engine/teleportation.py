"""
Teleportation-Based Quantum Protocol Engine.

Implements the standard 3-qubit Bennett et al. (1993) teleportation protocol:
- Qubit 0: Alice's unknown input state |psi> = alpha|0> + beta|1> (representing signature token)
- Qubit 1: Alice's half of entangled EPR Bell pair |Phi+>
- Qubit 2: Bob's half of entangled EPR Bell pair |Phi+>

Protocol steps:
1. Prepare input state |psi> on Qubit 0
2. Create Bell state (|00> + |11>)/sqrt(2) on Qubit 1 and Qubit 2
3. Alice performs Bell-state measurement on Qubit 0 and Qubit 1 (CNOT(0,1), H(0), measure)
4. Alice sends 2 classical bits (c0, c1) to Bob
5. Bob applies Pauli corrections (X if c1=1, Z if c0=1) to Qubit 2
6. Qubit 2 now exactly matches state |psi> (fidelity = 1.0 in ideal noiseless channel)
"""

from typing import Dict, Any, Optional, Tuple
import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
try:
    from .bell_states import create_bell_pair, BellState
    from .pauli import prepare_state, apply_basis_transformation, PauliBasis
except (ImportError, ValueError):
    from bell_states import create_bell_pair, BellState
    from pauli import prepare_state, apply_basis_transformation, PauliBasis


def build_teleportation_circuit(
    input_state: str = "+",
    bell_state: BellState = BellState.PHI_PLUS,
    measurement_basis: PauliBasis = PauliBasis.Z,
    include_pauli_corrections: bool = True,
    attack_type: Optional[Any] = None,
    attack_severity: float = 0.0,
    tamper_qubit: int = 2
) -> QuantumCircuit:
    """
    Builds an end-to-end Qiskit QuantumCircuit for teleporting a state and performing
    verification measurement on the received qubit.
    """
    qr = QuantumRegister(3, name="q")
    cr = ClassicalRegister(3, name="c")
    circuit = QuantumCircuit(qr, cr, name="QDS_Teleportation")
    
    # 1. State preparation on q[0]
    prepare_state(input_state, circuit, qubit=0)
    circuit.barrier(label="Prep")
    
    # Forgery attack on Alice's state
    if attack_type and (getattr(attack_type, "value", str(attack_type)) == "SIGNATURE_FORGERY") and attack_severity > 0.001:
        rotation_angle = (0.3 + 0.7 * attack_severity) * np.pi
        circuit.ry(rotation_angle, 0)
        circuit.rz(rotation_angle * 0.5, 0)
        circuit.barrier(label="Adversary_Forgery")

    # 2. Entangled EPR pair creation on q[1] and q[2]
    create_bell_pair(bell_state, circuit, qubit_a=1, qubit_b=2)
    circuit.barrier(label="Entangle")
    
    # Impersonation attack on entanglement channel
    if attack_type and (getattr(attack_type, "value", str(attack_type)) == "IMPERSONATION"):
        circuit.x(2)
        circuit.z(2)
        circuit.barrier(label="Impersonation")

    # 3. Alice's Bell-basis measurement interactions on q[0] & q[1]
    circuit.cx(0, 1)
    circuit.h(0)
    circuit.barrier(label="Alice_Bell_Ops")

    # 4. Bob's Pauli correction operations on q[2]
    if include_pauli_corrections:
        circuit.cx(1, 2)
        circuit.cz(0, 2)
        circuit.barrier(label="Pauli_Correction")
    
    # 5. Channel tampering noise on Bob's line before projective measurement
    if attack_type and (getattr(attack_type, "value", str(attack_type)) == "CHANNEL_TAMPERING") and attack_severity > 0.001:
        angle = float(attack_severity * np.pi)
        circuit.rx(angle, tamper_qubit)
        circuit.rz(angle * 0.75, tamper_qubit)
        circuit.barrier(label="Channel_Noise")

    # 6. Measure Alice's classical bits
    circuit.measure(0, cr[0])
    circuit.measure(1, cr[1])
    circuit.barrier(label="Alice_Readout")
    
    # 7. Bob's projective measurement in the expected basis
    apply_basis_transformation(measurement_basis, circuit, qubit=2)
    circuit.measure(2, cr[2])
    
    return circuit


def get_expected_distribution(
    input_state: str,
    measurement_basis: PauliBasis
) -> Dict[str, float]:
    """
    Calculates the exact theoretical probability distribution for Bob's measurement outcome ('0' vs '1')
    given the input state and the measurement basis.
    
    Returns:
        Dict with keys "0" and "1" mapping to probability [0.0, 1.0].
    """
    if measurement_basis == PauliBasis.Z:
        if input_state == "0":
            return {"0": 1.0, "1": 0.0}
        elif input_state == "1":
            return {"0": 0.0, "1": 1.0}
        elif input_state in ("+", "-", "R", "L"):
            return {"0": 0.5, "1": 0.5}
            
    elif measurement_basis == PauliBasis.X:
        if input_state == "+":
            return {"0": 1.0, "1": 0.0}
        elif input_state == "-":
            return {"0": 0.0, "1": 1.0}
        elif input_state in ("0", "1", "R", "L"):
            return {"0": 0.5, "1": 0.5}
            
    elif measurement_basis == PauliBasis.Y:
        if input_state == "R":
            return {"0": 1.0, "1": 0.0}
        elif input_state == "L":
            return {"0": 0.0, "1": 1.0}
        elif input_state in ("0", "1", "+", "-"):
            return {"0": 0.5, "1": 0.5}
            
    # Default fallback for arbitrary superpositions
    return {"0": 0.5, "1": 0.5}
