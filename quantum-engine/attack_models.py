"""
Deterministic Quantum Attack Simulation Models.

Implements controlled cyber-physical quantum attack injections:
1. NO_ATTACK: Ideal/normal operation
2. SIGNATURE_FORGERY: Adversary tries to forge unknown quantum state
3. IMPERSONATION: Adversary attempts to sign as a legitimate party with mismatched keys
4. REPLAY_ATTACK: Adversary intercepts and retransmits expired signature token / state
5. CHANNEL_TAMPERING: Eavesdropper or physical disturbance alters quantum channel (depolarizing/phase noise)
"""

from enum import Enum
from typing import Dict, Any, Tuple, Optional
import numpy as np
from qiskit import QuantumCircuit
try:
    from .pauli import prepare_state, PauliBasis
    from .bell_states import create_bell_pair, BellState
except (ImportError, ValueError):
    from pauli import prepare_state, PauliBasis
    from bell_states import create_bell_pair, BellState


class AttackType(str, Enum):
    NONE = "NONE"
    SIGNATURE_FORGERY = "SIGNATURE_FORGERY"
    IMPERSONATION = "IMPERSONATION"
    REPLAY_ATTACK = "REPLAY_ATTACK"
    CHANNEL_TAMPERING = "CHANNEL_TAMPERING"


def apply_channel_tampering(
    circuit: QuantumCircuit,
    qubit_index: int,
    noise_severity: float = 0.35,
    noise_type: str = "depolarizing"
) -> QuantumCircuit:
    """
    Simulates quantum channel tampering by applying physical disturbance gates on the quantum line.
    - noise_severity: 0.0 (clean) to 1.0 (severe destruction)
    - noise_type: "depolarizing", "bit_flip", "phase_flip", "intercept_resend"
    """
    if noise_severity <= 0.001:
        return circuit
        
    angle = float(noise_severity * np.pi)
    
    if noise_type == "depolarizing":
        # Arbitrary rotation representing depolarizing channel mixture
        circuit.rx(angle, qubit_index)
        circuit.rz(angle * 0.75, qubit_index)
    elif noise_type == "bit_flip":
        circuit.rx(angle, qubit_index)
    elif noise_type == "phase_flip":
        circuit.rz(angle, qubit_index)
    elif noise_type == "intercept_resend":
        # Intercept-resend measurement collapse simulation
        circuit.h(qubit_index)
        circuit.ry(angle, qubit_index)
        circuit.h(qubit_index)
        
    return circuit


def inject_attack_into_circuit(
    circuit: QuantumCircuit,
    attack_type: AttackType,
    severity: float = 0.5,
    tamper_qubit: int = 2
) -> QuantumCircuit:
    """
    Injects attack manipulations directly into a Qiskit quantum circuit before measurement.
    """
    if attack_type == AttackType.NONE or severity <= 0.001:
        return circuit
        
    if attack_type == AttackType.CHANNEL_TAMPERING:
        # Depolarizing/Phase noise on Bob's quantum line (qubit 2)
        apply_channel_tampering(circuit, qubit_index=tamper_qubit, noise_severity=severity, noise_type="depolarizing")
        
    elif attack_type == AttackType.SIGNATURE_FORGERY:
        # Forger injects orthogonal / state rotation on input state
        rotation_angle = (0.3 + 0.7 * severity) * np.pi
        circuit.ry(rotation_angle, 0)
        circuit.rz(rotation_angle * 0.5, 0)
        
    elif attack_type == AttackType.IMPERSONATION:
        # Impersonator uses invalid entanglement basis
        circuit.x(2)
        circuit.z(2)
        
    elif attack_type == AttackType.REPLAY_ATTACK:
        # Replay attack: quantum circuit itself is valid in isolation, but classical metadata/nonce is forged/replayed
        pass
        
    return circuit


def get_attack_description(attack_type: AttackType) -> Dict[str, str]:
    """
    Provides standard technical descriptions for threat analysis reports.
    """
    descriptions = {
        AttackType.NONE: {
            "name": "Legitimate Transmission",
            "mechanism": "Normal quantum teleportation protocol execution without interference.",
            "expected_signature": "Low TVD (<0.05), QBER near zero, State Fidelity > 0.95."
        },
        AttackType.SIGNATURE_FORGERY: {
            "name": "Quantum Signature Forgery",
            "mechanism": "Adversary injects forged quantum states without knowing Alice's private key basis.",
            "expected_signature": "High TVD (>0.15), elevated Chi-Square statistic, collapsed Fidelity."
        },
        AttackType.IMPERSONATION: {
            "name": "Identity Impersonation Attack",
            "mechanism": "Adversary mimics Alice's signature token with an unauthorized quantum key pair.",
            "expected_signature": "Complete parity inversion in Pauli basis measurements, TVD > 0.40."
        },
        AttackType.REPLAY_ATTACK: {
            "name": "Quantum Signature Replay Attack",
            "mechanism": "Adversary retransmits previously captured signature measurement tokens for a different session.",
            "expected_signature": "Temporal token collision, non-matching session nonce, repeated statistical hash."
        },
        AttackType.CHANNEL_TAMPERING: {
            "name": "Quantum Channel Tampering / Eavesdropping",
            "mechanism": "Active optical fiber perturbation or intercept-resend attack inducing quantum decoherence.",
            "expected_signature": "QBER > 0.10, proportional TVD increase matching depolarizing noise severity."
        }
    }
    return descriptions.get(attack_type, descriptions[AttackType.NONE])
