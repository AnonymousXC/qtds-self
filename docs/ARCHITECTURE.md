# System Architecture & Technical Design

## 1. Overview

The **Quantum Threat Detection System (QTDS)** is a production-grade full-stack platform designed to provide information-theoretic digital signature security and deterministic cyber-threat detection for teleportation-based Quantum Digital Signature (QDS) protocols.

```
+-------------------------------------------------------------------------+
|                              FRONTEND                                   |
|   React + TypeScript + Vite + Tailwind CSS + DaisyUI + Recharts         |
|   10 Views: Dashboard, Quantum Lab, QDS Signer, Verification Center,    |
|   Attack Lab, Threat Analytics, Security Events, Copilot, Reports, Demo |
+-------------------------------------------------------------------------+
                                   |  ^
                REST APIs (JSON)   |  |  WebSocket Telemetry Stream
                                   v  |
+-------------------------------------------------------------------------+
|                              BACKEND                                    |
|   FastAPI + Pydantic v2 + SQLAlchemy (Async) + Uvicorn                  |
|   -------------------------------------------------------------------   |
|   [QDS Service]          [Verification Service]     [Attack Service]    |
|   [Statistics Service]   [Report Service]           [AI Copilot Engine] |
+-------------------------------------------------------------------------+
                                   |
         +-------------------------+-------------------------+
         |                                                   |
         v                                                   v
+-----------------------------------+   +---------------------------------+
|          QUANTUM ENGINE           |   |       DETERMINISTIC ENGINE      |
|  Qiskit Aer / Statevector Sim     |   |  - Total Variation Distance     |
|  - Bell Pairs (|Phi+>, |Psi+>, etc)|   |  - Hellinger Distance           |
|  - Teleportation Protocol         |   |  - Chi-Square Goodness of Fit   |
|  - Pauli Corrections (X, Z)       |   |  - Quantum Bit Error Rate (QBER)|
|  - Projective Measurements        |   |  - Quantum State Fidelity       |
|  - Physical Channel Perturbation  |   |  (STRICTLY ZERO AI/ML)          |
+-----------------------------------+   +---------------------------------+
```

---

## 2. Component Breakdown

### 2.1 Quantum Engine (`/quantum-engine`)
- **`bell_states.py`**: Prepares maximally entangled two-qubit EPR Bell states:
  $$\begin{aligned}
  |\Phi^+\rangle &= \frac{|00\rangle + |11\rangle}{\sqrt{2}}, & |\Phi^-\rangle &= \frac{|00\rangle - |11\rangle}{\sqrt{2}} \\
  |\Psi^+\rangle &= \frac{|01\rangle + |10\rangle}{\sqrt{2}}, & |\Psi^-\rangle &= \frac{|01\rangle - |10\rangle}{\sqrt{2}}
  \end{aligned}$$
- **`teleportation.py`**: Executes Bennett et al. (1993) teleportation protocol. Alice measures her input qubit and her entangled half in the Bell basis, transmitting classical bits $(c_0, c_1)$ to Bob, who applies conditional Pauli corrections $Z^{c_0} X^{c_1}$.
- **`pauli.py`**: Projective measurement transforms into computational $Z$, diagonal $X$, and circular $Y$ bases.
- **`statistical_analysis.py`**: Calculates Total Variation Distance, Hellinger Distance, $\chi^2$ goodness-of-fit, KL divergence, and state fidelity.
- **`attack_models.py`**: Controlled physical noise injection (depolarizing channels, phase flip, state forgery rotations, and key swap impersonation).

### 2.2 Deterministic Threat Detection Engine (`backend/app/core/`)
- Purely mathematical and statistical decision engine.
- Zero AI/ML in the decision path.
- Compares measured statistical metrics against configurable parameters:
  - `FORGERY_THRESHOLD` ($0.1500$)
  - `CHANNEL_TAMPER_THRESHOLD` ($0.1000$)
  - `REPLAY_SIMILARITY_THRESHOLD` ($0.9200$)
  - `MIN_ACCEPTABLE_FIDELITY` ($0.8500$)
  - `CHI_SQUARE_ALPHA` ($0.0500$)

### 2.3 Auxiliary AI Quantum Security Copilot (`backend/app/services/ai_service.py`)
- Provider-agnostic LLM client (OpenAI-compatible) with built-in offline deterministic scientific reasoning engine.
- Only consumes structured JSON produced by the deterministic engine.
- Strictly forbidden from overriding security verdicts.
