# Quantum Model & Teleportation-Based QDS Protocol

## 1. Information-Theoretic Security Foundation

Classical digital signatures (e.g. RSA, ECDSA) rely on computational hardness assumptions (e.g., integer factorization, discrete logarithms) that are vulnerable to polynomial-time quantum algorithms such as **Shor's Algorithm**.

Quantum Digital Signatures (QDS) provide **information-theoretic security** guaranteed by the fundamental laws of quantum physics:
1. **Quantum No-Cloning Theorem**: An adversary cannot duplicate an unknown quantum state $|\psi\rangle$ without altering it.
2. **Entanglement Monogamy**: Entangled Bell pairs shared between legitimate parties cannot be correlated with an eavesdropper without detectably reducing state fidelity.
3. **Projective Measurement Uncertainty**: Measuring a quantum state in non-commuting Pauli bases ($X, Y, Z$) collapses the superposition, inducing detectable Quantum Bit Error Rates (QBER).

---

## 2. Teleportation-Based Signature Protocol

### Step 1: Quantum Key Distribution (Alice & Bob)
Alice prepares sequences of random Pauli eigenstates:
$$|\psi_i\rangle \in \{|0\rangle, |1\rangle, |+\rangle, |-\rangle, |R\rangle, |L\rangle\}$$
Alice and Bob share maximally entangled EPR Bell states:
$$|\Phi^+\rangle_{12} = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$$

### Step 2: Signature Generation
For each message block, Alice uses her private quantum tokens:
1. Alice performs a joint Bell-state measurement on her token qubit $q_0$ and her half of the EPR pair $q_1$.
2. Alice records the classical 2-bit measurement outcome:
   $$c_0 = M(q_0), \quad c_1 = M(q_1)$$
3. Alice transmits $(c_0, c_1)$ and the message digest over an authenticated classical channel.

### Step 3: Signature Verification
Bob receives the classical bits and applies conditional Pauli operations to his entangled qubit $q_2$:
$$\sigma_{\text{Bob}} = Z^{c_0} \cdot X^{c_1}$$
Bob performs a projective measurement in the declared basis:
- If Alice prepared $|\psi\rangle$ in $X$-basis, Bob applies a Hadamard gate $H$ and measures in computational basis.
- If authentic, Bob observes the expected eigenvalue with fidelity $F \approx 1.0$.
