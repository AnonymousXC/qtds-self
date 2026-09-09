# Quantum Threat Detection System (QTDS)
## System Flow, Codebase Mapping & Video Presentation Script

---

# PART 1: End-to-End System Flow & Codebase Architecture Map

This section traces every single step of data, quantum state manipulation, and deterministic detection logic, mapping each to its exact file location and function in the repository.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    HIGH-LEVEL SYSTEM FLOW                                      │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

  [1. Alice & Bob Key Distribution]
         │
         ▼
  [2. Alice Signs Message Payload] ──► SHA-256 Digest ──► Maps to Quantum Token Sequence
         │
         ▼
  [3. Quantum Teleportation Channel] ──► Bell-State Measurement (Alice) ──► Classical Channel (c0, c1)
         │
         ├─── (Optional: Adversary Injects Attack / Noise / Forgery / Replay)
         ▼
  [4. Bob Feedforward Correction] ──► Unitary Fix: Z^c0 · X^c1 ──► State Restored / Collapsed
         │
         ▼
  [5. Projective Measurement] ──► Rotates into Declared Pauli Basis (X, Y, or Z) ──► Readout
         │
         ▼
  [6. Deterministic Statistical Analysis] ──► TVD δ(P,Q), Hellinger H(P,Q), QBER, Fidelity F, χ²
         │
         ▼
  [7. Deterministic Decision Rules] ──► Evaluates Threshold Inequalities (NO AI/ML)
         │
         ├──► SECURE (Passed)
         ├──► SUSPICIOUS (Anomalous)
         └──► MALICIOUS (Forgery / Channel Noise / Replay / Impersonation) + Exact Math Proofs
         │
         ▼
  [8. SOC Logging & Live WebSocket Telemetry] ──► SQLite / PostgreSQL Audit Trail
         │
         ▼
  [9. Auxiliary AI Security Copilot] ──► Consumes JSON Proofs to Explain Physical Collapse to Analyst
```

---

## Detailed Step-by-Step Flow & Codebase Map

### Step 1: Session Initialization & Bell-Pair Entanglement Distribution
- **What it does**:
  Alice and Bob establish a secure QDS session. The system pre-shares $N$ maximally entangled EPR pairs (default $|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$) across the quantum channel.
- **Quantum Principle**: Entanglement Monogamy and Einstein-Podolsky-Rosen (EPR) correlations.
- **Codebase Mapping**:
  - **Quantum Engine**:
    - [`quantum-engine/bell_states.py`](file:///d:/open-source-projects/qtds/quantum-engine/bell_states.py) -> `create_bell_pair(BellState.PHI_PLUS)` creates the 2-qubit Hadamard + CNOT circuit.
    - [`quantum-engine/qds_protocol.py`](file:///d:/open-source-projects/qtds/quantum-engine/qds_protocol.py) -> `QDSSessionManager.initialize_session()` assigns keypairs.
  - **Backend Service & API**:
    - [`backend/app/services/qds_service.py`](file:///d:/open-source-projects/qtds/backend/app/services/qds_service.py) -> `QDSService.create_session()`
    - [`backend/app/api/qds.py`](file:///d:/open-source-projects/qtds/backend/app/api/qds.py) -> `POST /api/qds/session`
  - **Frontend UI**:
    - [`frontend/src/pages/QDSSignature.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/QDSSignature.tsx) -> "Generate New Quantum Keypair" modal & form.

---

### Step 2: Message Digest Computation & Quantum Signature Token Generation
- **What it does**:
  Alice has a message $M$ (e.g. `"Transfer $50,000 to Bob"`). Alice hashes $M$ using SHA-256 to obtain a 256-bit hexadecimal digest. Each hex nibble or bit selects a private Pauli eigenstate $|\psi\rangle \in \{|0\rangle, |1\rangle, |+\rangle, |-\rangle, |R\rangle, |L\rangle\}$ and its corresponding basis $B \in \{Z, X, Y\}$.
- **Quantum Principle**: No-Cloning Theorem ($|\psi\rangle$ cannot be copied by an eavesdropper).
- **Codebase Mapping**:
  - **Quantum Engine**:
    - [`quantum-engine/pauli.py`](file:///d:/open-source-projects/qtds/quantum-engine/pauli.py) -> `prepare_pauli_eigenstate(state_label)` prepares $|0\rangle, |1\rangle, |+\rangle, |-\rangle, |R\rangle, |L\rangle$.
    - [`quantum-engine/qds_protocol.py`](file:///d:/open-source-projects/qtds/quantum-engine/qds_protocol.py) -> `QDSSessionManager.generate_signature_tokens()` generates signed token sequence.
  - **Backend Service & API**:
    - [`backend/app/services/qds_service.py`](file:///d:/open-source-projects/qtds/backend/app/services/qds_service.py) -> `QDSService.generate_signature()`
    - [`backend/app/api/qds.py`](file:///d:/open-source-projects/qtds/backend/app/api/qds.py) -> `POST /api/qds/signature/generate`
  - **Frontend UI**:
    - [`frontend/src/pages/QDSSignature.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/QDSSignature.tsx) -> Message input box, SHA-256 display badge, and token visualizer table.

---

### Step 3: Quantum Teleportation & Adversarial Attack Injection
- **What it does**:
  Alice teleports the private signature state $|\psi\rangle$ (qubit $q_0$) to Bob using EPR pair $(q_1, q_2)$. Alice performs a Bell-State Measurement (BSM) on $(q_0, q_1)$ yielding classical bits $(c_0, c_1)$.
  - *If an attack occurs*: An adversary (Eve) attempts **Signature Forgery**, **Identity Impersonation**, **Replay Attack**, or **Channel Tampering (Depolarizing/Phase noise)** on the flying qubit $q_2$ before Bob receives it.
- **Quantum Principle**: Quantum Teleportation, Quantum Channel Perturbation, and Measurement-Induced Wavefunction Collapse.
- **Codebase Mapping**:
  - **Quantum Engine**:
    - [`quantum-engine/teleportation.py`](file:///d:/open-source-projects/qtds/quantum-engine/teleportation.py) -> `QuantumTeleportationEngine.build_teleportation_circuit()` builds 3-qubit circuit with CNOT, Hadamard, Alice BSM, feedforward corrections, and pre-measurement attack injection.
    - [`quantum-engine/attack_models.py`](file:///d:/open-source-projects/qtds/quantum-engine/attack_models.py) -> `QuantumAttackInjector.apply_attack()` implements `SIGNATURE_FORGERY`, `IMPERSONATION`, `REPLAY_ATTACK`, and `CHANNEL_TAMPERING`.
  - **Backend Service & API**:
    - [`backend/app/services/attack_service.py`](file:///d:/open-source-projects/qtds/backend/app/services/attack_service.py) -> `AttackService.simulate_attack_comparison()`
    - [`backend/app/api/attacks.py`](file:///d:/open-source-projects/qtds/backend/app/api/attacks.py) -> `POST /api/attacks/simulate`
  - **Frontend UI**:
    - [`frontend/src/pages/AttackLab.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/AttackLab.tsx) -> Attack vector dropdown, severity slider, and comparison viewer.

---

### Step 4: Bob's Feedforward Pauli Corrections & Projective Measurement
- **What it does**:
  Bob receives classical bits $(c_0, c_1)$ from Alice. Bob applies unitary correction $U = Z^{c_0} X^{c_1}$ to his qubit $q_2$. If the channel was undisturbed, $q_2$ is now in the exact state $|\psi\rangle$.
  Bob then measures $q_2$ in the declared Pauli basis $B \in \{Z, X, Y\}$ over $N_{\text{shots}}$ (e.g. 2048 shots) on Qiskit Aer.
- **Quantum Principle**: Deferred Measurement Principle & Pauli Basis Transformation ($H$ gate for $X$-basis, $S^\dagger H$ for $Y$-basis).
- **Codebase Mapping**:
  - **Quantum Engine**:
    - [`quantum-engine/pauli.py`](file:///d:/open-source-projects/qtds/quantum-engine/pauli.py) -> `apply_projective_measurement_basis(circuit, qubit, basis)`
    - [`quantum-engine/simulator.py`](file:///d:/open-source-projects/qtds/quantum-engine/simulator.py) -> `execute_circuit_with_shots(circuit, shots)`
  - **Backend Service**:
    - [`backend/app/services/verification_service.py`](file:///d:/open-source-projects/qtds/backend/app/services/verification_service.py) -> `VerificationService.verify_signature()`
  - **Frontend UI**:
    - [`frontend/src/pages/VerificationCenter.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/VerificationCenter.tsx) -> 6-Stage Pipeline (Stage 1 Intake -> Stage 2 Teleport -> Stage 3 Pauli Fix -> Stage 4 Projective Measurement).

---

### Step 5: Deterministic Statistical Analysis (Zero AI/ML)
- **What it does**:
  The system computes 5 rigorous mathematical distance metrics between the **Observed Measurement Distribution** $P$ and the **Theoretical Expected Distribution** $Q$:
  1. **Total Variation Distance (TVD)**: $\delta(P, Q) = \frac{1}{2}\sum_x |P(x) - Q(x)| \in [0, 1]$
  2. **Hellinger Distance**: $H(P, Q) = \frac{1}{\sqrt{2}}\sqrt{\sum_x (\sqrt{P(x)} - \sqrt{Q(x)})^2} \in [0, 1]$
  3. **Quantum Bit Error Rate (QBER)**: Rate of orthogonal bit flips.
  4. **Classical State Overlap Fidelity**: $F(P, Q) = \left(\sum_x \sqrt{P(x) \cdot Q(x)}\right)^2 \in [0, 1]$
  5. **Chi-Square Goodness-of-Fit ($\chi^2$) & $p$-value**: $\chi^2 = \sum \frac{(O_i - E_i)^2}{E_i}$ with degrees of freedom $k-1$.
- **Codebase Mapping**:
  - **Quantum Engine**:
    - [`quantum-engine/statistical_analysis.py`](file:///d:/open-source-projects/qtds/quantum-engine/statistical_analysis.py) -> `StatisticalDistanceEngine.compute_all_metrics()`
  - **Backend Core**:
    - [`backend/app/core/threat_engine.py`](file:///d:/open-source-projects/qtds/backend/app/core/threat_engine.py) -> `DeterministicThreatEngine.evaluate()`

---

### Step 6: Deterministic Threat Decision Rules & Mathematical Proof Generation
- **What it does**:
  Evaluates explicit inequality threshold rules against configurable policies:
  - **Rule 1 (Forgery)**: If $\delta(P, Q) > \theta_{\text{forgery}}$ ($0.1500$) $\implies \text{MALICIOUS (SIGNATURE\_FORGERY)}$.
  - **Rule 2 (Channel Tampering)**: If $\text{QBER} > \theta_{\text{tamper}}$ ($10.0\%$) $\implies \text{MALICIOUS (CHANNEL\_TAMPERING)}$.
  - **Rule 3 (Replay Attack)**: If Nonce is replayed or similarity $> 0.9200 \implies \text{MALICIOUS (REPLAY\_ATTACK)}$.
  - **Rule 4 (Impersonation)**: If Key sequence / Bell parity mismatch $\implies \text{MALICIOUS (IMPERSONATION)}$.
  - **Rule 5 (Clean/Legitimate)**: If $\delta \le 0.1500$, $\text{QBER} \le 10\%$, $F \ge 0.8500$, $p \ge 0.05 \implies \text{SECURE}$.
- **Generates Exact Proof Lines**:
  - e.g. `REJECTED - QUANTUM CHANNEL NOISE DETECTED: Measured QBER is 66.16% > Safety Limit (10.00%).`
  - e.g. `Mathematical Proof: Total Variation Distance delta(P,Q) = 0.6616 > 0.1500.`
  - e.g. `Chi-Square Proof: Rejected with chi^2 = 1836025896.50 (p = 0.000000 < alpha = 0.05).`
- **Codebase Mapping**:
  - **Backend Core Rules**:
    - [`backend/app/core/security_rules.py`](file:///d:/open-source-projects/qtds/backend/app/core/security_rules.py) -> `DeterministicRuleEngine.evaluate_verdict_with_proofs()`
  - **Backend Service & API**:
    - [`backend/app/services/verification_service.py`](file:///d:/open-source-projects/qtds/backend/app/services/verification_service.py) -> `VerificationService.verify_signature()`
    - [`backend/app/api/verification.py`](file:///d:/open-source-projects/qtds/backend/app/api/verification.py) -> `POST /api/qds/signature/verify`
  - **Frontend UI**:
    - [`frontend/src/pages/VerificationCenter.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/VerificationCenter.tsx) -> Verdict Badge, 4 Metric cards with pass/fail badges, and Mathematical Proof Box.

---

### Step 7: SOC Telemetry, Event Auditing & WebSockets
- **What it does**:
  Persists every verification, attack simulation, and security incident into the database (`qtds.db` / PostgreSQL). Emits live telemetry events over WebSockets to connected SOC dashboards.
- **Codebase Mapping**:
  - **Backend Database Models**:
    - [`backend/app/models/session.py`](file:///d:/open-source-projects/qtds/backend/app/models/session.py), [`verification.py`](file:///d:/open-source-projects/qtds/backend/app/models/verification.py), [`security_event.py`](file:///d:/open-source-projects/qtds/backend/app/models/security_event.py)
  - **Backend APIs & WebSockets**:
    - [`backend/app/api/dashboard.py`](file:///d:/open-source-projects/qtds/backend/app/api/dashboard.py) -> `GET /api/dashboard/summary`
    - [`backend/app/api/events.py`](file:///d:/open-source-projects/qtds/backend/app/api/events.py) -> `GET /api/security/events`
    - [`backend/app/api/ws.py`](file:///d:/open-source-projects/qtds/backend/app/api/ws.py) -> `WebSocket /ws/telemetry`
  - **Frontend UI**:
    - [`frontend/src/pages/Dashboard.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/Dashboard.tsx) -> Real-time telemetry cards, TVD charts, active threats radar.
    - [`frontend/src/pages/SecurityEvents.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/SecurityEvents.tsx) -> Immutable audit log viewer with JSON export.

---

### Step 8: Auxiliary AI Quantum Security Copilot
- **What it does**:
  Acts as an intelligent incident response assistant for SOC analysts. It receives the **structured JSON output and mathematical proofs** from the deterministic engine and explains the quantum physical phenomenon (e.g. why intercept-resend eavesdropping destroyed the superposition).
  - *Strict Guardrail*: The Copilot NEVER independently decides whether a signature is valid or malicious.
- **Codebase Mapping**:
  - **Backend Core**:
    - [`backend/app/core/ai_copilot.py`](file:///d:/open-source-projects/qtds/backend/app/core/ai_copilot.py) -> `AICopilotEngine.explain_verification()` (Supports OpenAI-compatible LLMs + offline scientific rule fallback).
  - **Backend API**:
    - [`backend/app/api/ai.py`](file:///d:/open-source-projects/qtds/backend/app/api/ai.py) -> `POST /api/ai/explain`, `POST /api/ai/chat`
  - **Frontend UI**:
    - [`frontend/src/pages/Copilot.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/Copilot.tsx) -> Interactive Copilot chat with verification context selector and quick prompts.

---

### Step 9: Cryptographic Security Audit Reports
- **What it does**:
  Compiles executive summary, deterministic mathematical proofs, circuit parameters, and compliance mitigations into a formal cryptographic audit document with 1-click Print/PDF export.
- **Codebase Mapping**:
  - **Backend API**:
    - [`backend/app/api/reports.py`](file:///d:/open-source-projects/qtds/backend/app/api/reports.py) -> `POST /api/reports/generate`, `GET /api/reports`
  - **Frontend UI**:
    - [`frontend/src/pages/Reports.tsx`](file:///d:/open-source-projects/qtds/frontend/src/pages/Reports.tsx) -> Report generator and PDF export layout.

---

# PART 2: Complete Video Presentation & Pitch Script

Use this script for recording a high-impact demonstration video or presenting live to hackathon judges.

---

## Video Overview (Suggested Duration: 3 to 5 Minutes)

| Timestamp | Section | Visual on Screen | Key Talking Point |
|---|---|---|---|
| **0:00 - 0:45** | Problem & Quantum Threat Solution | Problem statement slide & **Dashboard (`/`)** | Why RSA/ECDSA fail against quantum computers, and how our deterministic QDS + statistical threat engine solves it. |
| **0:45 - 1:30** | Step 1: Alice Signs Message | **QDS Signature (`/qds-signature`)** | Entangled Bell pairs, SHA-256 digest mapping to Pauli eigenstates ($|0\rangle, |1\rangle, |+\rangle, |-\rangle, |R\rangle, |L\rangle$). |
| **1:30 - 2:30** | Step 2: Bob Verifies Legitimate Signature | **Verification Center (`/verification`)** | 6-Stage Quantum Pipeline, feedforward Pauli corrections, TVD $< 0.05 \implies \text{SECURE}$. |
| **2:30 - 3:45** | Step 3: Adversarial Attack & Mathematical Proofs | **Attack Lab (`/attack-lab`)** & **Verification Center** | Injecting Channel Tampering / Forgery. Live mathematical rejection proofs ($\delta, \text{QBER}, F, \chi^2$). **Emphasize: Zero AI in detection path!** |
| **3:45 - 4:30** | Step 4: Auxiliary AI Copilot & Audit Report | **Copilot (`/copilot`)** & **Reports (`/reports`)** | AI explains the physical state collapse from structured data. PDF report generation. |
| **4:30 - 5:00** | Conclusion & 1-Click Judge Demo | **Judge Demo Mode (`/demo`)** | Summary, production-readiness, and test suite verification. |

---

## Full Spoken Script (Word-for-Word)

### [0:00 - 0:45] Introduction & Problem Statement
> **[Speaker Voice]**:
> "Hello judges and viewers. Today, we present our solution for the Smart India Hackathon problem: **'Quantum-Inspired Cyber Threat Detection for Digital Signature Security'**.
>
> Modern digital signatures like RSA and ECDSA are fundamentally vulnerable to Shor's algorithm on quantum computers. Furthermore, standard quantum key distribution systems face threats like intercept-resend eavesdropping, signature forgery, identity impersonation, and quantum replay attacks.
>
> To solve this, we built **QTDS** — a full-stack Quantum Threat Detection System implementing **Teleportation-Based Quantum Digital Signatures** and a **100% Deterministic and Statistical Cyber Threat Detection Engine**.
>
> Crucially, per the official problem requirements, our security detection engine operates **without any AI or ML in the detection path**. Threat classification is purely mathematical, based on Bell-state entanglement, quantum teleportation, Pauli corrections, and statistical distance metrics."

---

### [0:45 - 1:30] Alice's Workspace: Quantum Signature Generation
> **[Action on Screen]**: Open **QDS Signature** (`/qds-signature`). Select or generate a session.
>
> **[Speaker Voice]**:
> "Let's look at how a signature is generated.
>
> Here in Alice's signing console, Alice and Bob share pre-distributed, maximally entangled Bell pairs — $|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$.
>
> Alice enters a financial payload: *'Transfer $50,000 to Bob (TxID: 0x99A41)'*.
>
> When we click **'Generate Quantum Signature'**, the system hashes the payload via SHA-256 and maps each nibble to private Pauli eigenstates in the computational $Z$, diagonal $X$, or circular $Y$ bases — such as $|+\rangle, |-\rangle, |R\rangle, |L\rangle$. By the **No-Cloning Theorem**, these states cannot be cloned or intercepted without physical disturbance."

---

### [1:30 - 2:30] Bob's Workspace: Legitimate Verification
> **[Action on Screen]**: Click **"Proceed to Verification Center"** (`/verification`). Select the signature and click **"Execute Quantum Verification"**.
>
> **[Speaker Voice]**:
> "Now Bob receives the quantum signature tokens over the quantum channel.
>
> In the **Verification Center**, Bob initiates the 6-stage quantum pipeline:
> 1. **Stage 1 (Intake)**: Validates session nonces to prevent replay.
> 2. **Stage 2 (Teleportation)**: Alice measures her qubits in the Bell basis and transmits classical bits $c_0, c_1$.
> 3. **Stage 3 (Pauli Correction)**: Bob applies the feedforward unitary fix $Z^{c_0} X^{c_1}$ to restore the original quantum state.
> 4. **Stage 4 (Projective Measurement)**: Bob rotates his qubit into Alice's declared Pauli basis and measures over 2048 shots on the Qiskit simulator.
> 5. **Stage 5 (Statistical Distance)**: We compute Total Variation Distance $\delta$, QBER, Fidelity $F$, and Chi-Square $\chi^2$.
> 6. **Stage 6 (Verdict)**: The engine evaluates our deterministic threshold rules.
>
> As we see here, under clean channel conditions:
> - Total Variation Distance $\delta = 0.0000 \le 0.1500$.
> - Quantum State Fidelity $F = 1.0000 \ge 0.8500$.
> - Quantum Bit Error Rate $\text{QBER} = 0.00\% \le 10.00\%$.
> - Chi-Square $p$-value is $1.0000 \ge 0.05$.
>
> The signature is deterministically verified as **SECURE**."

---

### [2:30 - 3:45] Simulating Cyber Threats & Deterministic Rejection Proofs
> **[Action on Screen]**: In Verification Center, choose **"Attack Vector: Quantum Channel Tampering (Decoherence Noise)"** at 60% severity. Click **"Execute Quantum Verification"**.
>
> **[Speaker Voice]**:
> "Now let's simulate a real cyber-physical attack. An adversary intercepts the fiber optic line, injecting phase noise and depolarizing disturbances.
>
> When we execute verification, the system immediately catches the intrusion!
>
> Notice the **Verdict: MALICIOUS (CHANNEL_TAMPERING)**.
>
> Look at the **Deterministic Mathematical Rejection Proof Box**:
> - Measured QBER spiked to **66.16%**, violating the $10.00\%$ safety limit.
> - Total Variation Distance $\delta(P,Q) = 0.6616$, exceeding the baseline threshold.
> - The theoretical channel hypothesis is completely rejected with $\chi^2 = 1.83 \times 10^9$ ($p < 0.000001$).
>
> We also have an **Attack Lab** (`/attack-lab`) where we can benchmark Signature Forgery, Identity Impersonation, and Replay Attacks side-by-side with metric delta graphs ($\Delta\delta, \Delta\text{QBER}, \Delta F, \Delta\chi^2$)."

---

### [3:45 - 4:30] Auxiliary AI Security Copilot & Cryptographic Audit Reports
> **[Action on Screen]**: Click **"Explain With AI Copilot"** (`/copilot`). Select a quick prompt chip. Then navigate to **"Audit Reports"** (`/reports`).
>
> **[Speaker Voice]**:
> "Where does AI fit in?
> As required by the problem statement, AI is **strictly auxiliary**. Our **AI Quantum Security Copilot** consumes the structured mathematical proofs produced by the deterministic engine to provide plain-language explanations for SOC analysts.
>
> When asked why the signature was rejected, the Copilot explains that intercept-resend eavesdropping destroyed the entanglement of the $|\Phi^+\rangle$ Bell state, causing wave-function collapse before projective measurement.
>
> Finally, in the **Audit Reports** module, we can generate a formal, printable Cryptographic Incident Report containing the executive summary, mathematical proof lines, and mitigation advisories."

---

### [4:30 - 5:00] Conclusion & Judge Demo Mode
> **[Action on Screen]**: Click **"JUDGE DEMO MODE"** (`/demo`).
>
> **[Speaker Voice]**:
> "To make evaluation effortless, we also built a **1-Click Judge Demo Mode** that automates the entire 5-step lifecycle — from Bell-state generation to threat detection, AI briefing, and report generation in under 60 seconds.
>
> Our codebase includes a complete test suite with **100% pass rate across 13 automated tests**, full Docker containerization, and comprehensive documentation in `usage.md`.
>
> Thank you!"

---

# PART 3: Judge Q&A Defense Cheat-Sheet

Here are answers to potential technical questions from judges:

### Q1: Why is AI/ML not used in the threat detection engine?
> **Answer**:
> "Information-theoretic security in quantum cryptography requires deterministic mathematical guarantees. Machine learning models can suffer from hallucination, adversarial perturbation, and non-deterministic false positives/negatives. By using rigorous statistical mechanics (Total Variation Distance, Hellinger Distance, Chi-Square Goodness-of-Fit, and QBER thresholds), our detection is mathematically provable. AI is used solely as an auxiliary copilot to explain results to human analysts."

### Q2: How does the Quantum Teleportation protocol protect the signature?
> **Answer**:
> "Alice encodes signature tokens into private Pauli eigenstates ($|0\rangle, |1\rangle, |+\rangle, |-\rangle, |R\rangle, |L\rangle$). Rather than transmitting the state physically over an insecure channel where it could be intercepted, Alice teleports the state using pre-shared $|\Phi^+\rangle$ Bell pairs. Bob applies classical feedforward Pauli corrections $Z^{c_0} X^{c_1}$. Any eavesdropper who intercepts the transmission alters the quantum density matrix, which is instantly caught during Bob's projective measurement."

### Q3: What happens during a Quantum Replay Attack?
> **Answer**:
> "In a replay attack, an adversary captures classical measurement bits or resubmits old signature tokens. Our Stage 1 intake validation checks session-specific cryptographic nonces. Even if the adversary tries to resubmit identical tokens, the entanglement state is already collapsed and single-use, causing the statistical similarity test and nonce validator to flag a `REPLAY_ATTACK`."

### Q4: How are the statistical thresholds configured?
> **Answer**:
> "All thresholds (`FORGERY_THRESHOLD`, `CHANNEL_TAMPER_THRESHOLD`, `REPLAY_SIMILARITY_THRESHOLD`, `MIN_ACCEPTABLE_FIDELITY`, `CHI_SQUARE_ALPHA`) can be adjusted live in the **Settings & Thresholds** UI (`/settings`) or via `.env`. Changes update immediately in the backend's active decision engine without requiring a server restart."
