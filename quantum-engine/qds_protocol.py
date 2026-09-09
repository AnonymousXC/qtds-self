"""
End-to-End Teleportation-based Quantum Digital Signature (QDS) Protocol.

Protocol Workflow:
1. KEY GENERATION (Alice):
   - Alice creates a private key composed of random Pauli eigenstates: e.g. ['0', '+', 'R', '1', '-']
   - Alice shares entangled Bell pairs with Bob and Charlie (Receivers).
2. SIGNATURE GENERATION:
   - For a message bit $m \in \{0, 1\}$, Alice selects corresponding key quantum states.
   - Alice performs Bell-state measurements to teleport the quantum states to Bob.
   - Alice sends classical measurement outcomes $(c_0, c_1)$ and message timestamp nonce.
3. SIGNATURE VERIFICATION:
   - Bob applies Pauli corrections $Z^{c_0} X^{c_1}$ to his half of the entangled pair.
   - Bob measures his qubit in the expected Pauli basis.
   - Bob compares observed statistics against theoretical eigenstate distribution.
   - Deterministic engine calculates TVD, Hellinger distance, Chi-square, and QBER.
"""

import uuid
import time
from typing import Dict, Any, List, Optional
import numpy as np

try:
    from .bell_states import BellState
    from .pauli import PauliBasis
    from .teleportation import build_teleportation_circuit, get_expected_distribution
    from .attack_models import AttackType, inject_attack_into_circuit, get_attack_description
    from .simulator import run_circuit_simulation
    from .statistical_analysis import compute_comprehensive_metrics
except (ImportError, ValueError):
    from bell_states import BellState
    from pauli import PauliBasis
    from teleportation import build_teleportation_circuit, get_expected_distribution
    from attack_models import AttackType, inject_attack_into_circuit, get_attack_description
    from simulator import run_circuit_simulation
    from statistical_analysis import compute_comprehensive_metrics


class QDSSessionManager:
    """
    Manages teleportation-based QDS protocol execution runs.
    """
    
    @staticmethod
    def generate_quantum_keypair(length: int = 5) -> Dict[str, Any]:
        """
        Generates Alice's quantum signature key tokens.
        Each token consists of:
          - state_label: '0', '1', '+', '-', 'R', 'L'
          - basis: Z, X, Y
          - token_id: unique identifier
        """
        states_pool = ["0", "1", "+", "-", "R", "L"]
        basis_map = {
            "0": PauliBasis.Z, "1": PauliBasis.Z,
            "+": PauliBasis.X, "-": PauliBasis.X,
            "R": PauliBasis.Y, "L": PauliBasis.Y
        }
        
        key_tokens = []
        for i in range(length):
            state = np.random.choice(states_pool)
            key_tokens.append({
                "index": i,
                "token_id": str(uuid.uuid4())[:8],
                "state": str(state),
                "basis": basis_map[state].value
            })
            
        return {
            "key_id": f"qkey_{uuid.uuid4().hex[:10]}",
            "length": length,
            "tokens": key_tokens
        }

    @staticmethod
    def execute_teleportation_qds_verification(
        input_state: str = "+",
        measurement_basis: str = "X",
        bell_state: str = "PHI_PLUS",
        shots: int = 2048,
        attack_type: AttackType = AttackType.NONE,
        attack_severity: float = 0.0,
        tamper_qubit: int = 2,
        include_pauli_corrections: bool = True
    ) -> Dict[str, Any]:
        """
        Executes a real Qiskit teleportation circuit, injects simulated cyber-attacks,
        and performs projective measurement and statistical distance extraction.
        """
        start_time = time.perf_counter()
        
        # 1. Parse enums
        basis_enum = PauliBasis(measurement_basis.upper()) if isinstance(measurement_basis, str) else measurement_basis
        bell_enum = BellState(bell_state.upper()) if isinstance(bell_state, str) else bell_state
        if isinstance(attack_type, str):
            try:
                attack_enum = AttackType(attack_type.upper())
            except Exception:
                attack_enum = AttackType.NONE
        else:
            attack_enum = attack_type or AttackType.NONE
        
        # 2. Build Teleportation Circuit with Attack Injection
        circuit = build_teleportation_circuit(
            input_state=input_state,
            bell_state=bell_enum,
            measurement_basis=basis_enum,
            include_pauli_corrections=include_pauli_corrections,
            attack_type=attack_enum,
            attack_severity=attack_severity,
            tamper_qubit=tamper_qubit
        )
            
        # 3. Run real simulation via Qiskit
        sim_result = run_circuit_simulation(circuit, shots=shots)
        raw_counts = sim_result["counts"]
        
        # 5. Extract Bob's target qubit measurement (c2) from 3-bit outcomes (c2 c1 c0)
        bob_counts = {"0": 0, "1": 0}
        for bitstring, count in raw_counts.items():
            # bitstring format in Qiskit: 'c2 c1 c0' or 'c2c1c0'
            clean_bits = bitstring.replace(" ", "")
            if len(clean_bits) >= 3:
                bob_bit = clean_bits[0]  # c2 is the most significant bit
            else:
                bob_bit = clean_bits[-1]
            bob_counts[bob_bit] = bob_counts.get(bob_bit, 0) + count
            
        # 6. Compute theoretical expected distribution
        expected_dist = get_expected_distribution(input_state, basis_enum)
        
        # 7. Compute deterministic statistical distances
        stats = compute_comprehensive_metrics(
            observed_counts=bob_counts,
            expected_prob=expected_dist,
            input_state=input_state,
            total_shots=shots
        )
        
        elapsed_total = round((time.perf_counter() - start_time) * 1000.0, 2)
        
        return {
            "session_id": f"qds_sess_{uuid.uuid4().hex[:10]}",
            "circuit_id": f"qcirc_{uuid.uuid4().hex[:8]}",
            "qubit_count": 3,
            "classical_bits_count": 3,
            "shots": shots,
            "bell_state": bell_state,
            "input_state": input_state,
            "measurement_basis": measurement_basis,
            "pauli_corrections_applied": include_pauli_corrections,
            "attack_type": attack_type.value,
            "attack_severity": attack_severity,
            "attack_info": get_attack_description(attack_type),
            "raw_counts": raw_counts,
            "bob_measurement_counts": bob_counts,
            "expected_distribution": stats["expected_distribution"],
            "observed_distribution": stats["observed_distribution"],
            "statistical_metrics": {
                "total_variation_distance": stats["total_variation_distance"],
                "hellinger_distance": stats["hellinger_distance"],
                "chi_square_statistic": stats["chi_square_statistic"],
                "chi_square_p_value": stats["chi_square_p_value"],
                "degrees_of_freedom": stats["degrees_of_freedom"],
                "kl_divergence": stats["kl_divergence"],
                "qber": stats["qber"],
                "fidelity": stats["fidelity"]
            },
            "circuit_metadata": {
                "depth": sim_result["circuit_depth"],
                "total_gates": sim_result["total_gates"],
                "gate_breakdown": sim_result["gate_breakdown"],
                "backend": sim_result["backend"],
                "diagram": sim_result["diagram"]
            },
            "execution_time_ms": elapsed_total
        }
