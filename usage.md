# Quantum Threat Detection System (QTDS) - Platform User Manual

Welcome to the **Quantum-Inspired Cyber Threat Detection for Digital Signature Security (QTDS)** platform. This guide covers the complete feature set, architecture, and step-by-step instructions on how to use every module of this research and cybersecurity console.

---

## 1. What is QTDS?

QTDS is a full-stack platform implementing information-theoretically secure **Quantum Digital Signatures (QDS)** based on quantum teleportation and a **100% deterministic & statistical cyber threat detection engine** (Zero AI/ML in the detection path).

### Core Features:
- **Teleportation-Based QDS Protocol**: Uses Bell-state entanglement ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$), Alice Bell-basis measurements, classical feedforward Pauli corrections ($Z^{c_0} X^{c_1}$), and projective measurements.
- **Deterministic Detection Engine**: Evaluates Total Variation Distance (TVD), Hellinger Distance, Chi-Square Goodness-of-Fit ($\chi^2$), Quantum Bit Error Rate (QBER), and State Overlap Fidelity against configurable statistical thresholds.
- **Controlled Cyber Attack Simulator**: Injects real cyber-physical perturbations: Signature Forgery, Identity Impersonation, Quantum Replay Attacks, and Optical Channel Tampering / Eavesdropping.
- **Auxiliary AI Quantum Security Copilot**: Explains deterministic detection results, quantum principles (No-Cloning Theorem, Pauli bases, Bell states), and recommends investigation actions.
- **1-Click Judge Demo Mode**: Step-by-step 2-minute evaluation workflow tailored for hackathon judging.

---

## 2. Navigating the Platform

The navigation sidebar gives you access to all 10 specialized engineering modules:

```
┌────────────────────────────────────────────────────────────────────────┐
│ NAVIGATION MODULES                                                     │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Overview Dashboard    │ Live SOC telemetry, TVD curves & audit logs │
│ 2. Quantum Lab           │ Interactive Qiskit circuit builder & states │
│ 3. QDS Signature         │ Alice's signing workspace (Key distribution)│
│ 4. Verification Center   │ Bob's 6-stage quantum verification pipeline │
│ 5. Attack Lab            │ Normal vs Attacked distribution comparisons │
│ 6. Threat Analytics      │ Deep mathematical formulas & telemetry      │
│ 7. Security Events       │ Filterable immutable audit trail & JSON log │
│ 8. Security Copilot      │ Auxiliary AI reasoning on quantum telemetry │
│ 9. Audit Reports         │ Formal security reports & PDF export        │
│ 10. Judge Demo Mode      │ 1-Click 2-minute presentation demo          │
│ 11. Settings             │ Dynamic statistical threshold policy tuning │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Usage Workflows

### Workflow A: 1-Click Judge Demo (Fastest Way to Experience the System)
1. Click **"JUDGE DEMO MODE"** in the top-right navbar or sidebar (`/demo`).
2. **Step 1: Generate Quantum Signature**: Alice distributes EPR pairs and teleports quantum signature tokens.
3. **Step 2: Verify Legitimate Signature**: Bob verifies the signature in clean conditions ($\text{TVD} < 0.05 \implies \text{SECURE}$).
4. **Step 3: Inject Quantum Attack**: Simulate an adversary attempting channel eavesdropping or forgery. The engine immediately intercepts it and flags it as **`MALICIOUS`** with mathematical proof lines.
5. **Step 4: Consult AI Copilot**: The Copilot generates an incident briefing explaining the physical collapse of the quantum state.
6. **Step 5: Generate Formal Audit Report**: Creates a downloadable cryptographic audit report.

---

### Workflow B: Signing a Custom Message (Alice's Workspace)
1. Go to **"QDS Signature"** (`/qds-signature`).
2. Select an active QDS session or click **"Generate New Quantum Keypair"** to distribute fresh Bell pairs ($|\Phi^+\rangle$).
3. Enter your custom transaction message or payload in the text area (e.g. `Transfer 50,000 credits to Bob (TxID: 0x99A41)`).
4. Click **"Generate Quantum Signature"**.
5. The system computes the SHA-256 digest and teleports private Pauli eigenstate signature tokens.
6. Click **"Proceed to Verification Center (Bob)"** to verify this signature.

---

### Workflow C: Verifying a Signature & Inspecting Rejection Proofs (Bob's Workspace)
1. Go to **"Verification Center"** (`/verification`).
2. Select the target session and signature from the dropdowns.
3. Choose an optional attack vector to simulate or leave as **`No Attack (Legitimate Signature)`**.
4. Set the simulator shots (e.g., `2048`).
5. Click **"Execute Quantum Verification"**.
6. The 6-Stage Pipeline executes:
   - **Stage 1 (Intake)**: Nonce & Token validation.
   - **Stage 2 (Teleport)**: Bell measurement readout.
   - **Stage 3 (Pauli Fix)**: Feedforward Pauli corrections $Z^{c_0} X^{c_1}$.
   - **Stage 4 (Projective Measurement)**: Rotation into declared Pauli basis ($X, Y, Z$).
   - **Stage 5 (Statistical Analysis)**: Computation of TVD $\delta(P, Q)$, QBER, Fidelity $F(P, Q)$, and $\chi^2$ statistic.
   - **Stage 6 (Verdict)**: Deterministic classification (`SECURE`, `SUSPICIOUS`, or `MALICIOUS`).
7. Inspect the **Detailed Mathematical Proof Box** displaying the exact inequalities that triggered the decision (e.g. $\delta = 0.4888 > 0.1500$, $\text{QBER} = 48.88\% > 10.00\%$).

---

### Workflow D: Adversarial Attack Simulation & Distribution Comparison
1. Go to **"Attack Lab"** (`/attack-lab`).
2. Choose a threat vector:
   - **Quantum Channel Tampering**: Injects depolarizing noise and phase rotation onto the fiber line.
   - **Signature Forgery**: Adversary tries to forge Alice's unknown state.
   - **Identity Impersonation**: Key desynchronization / invalid Bell pair.
   - **Quantum Replay Attack**: Resubmitting valid tokens across expired session nonces.
3. Adjust the **Attack Severity Slider** (10% to 100%).
4. Click **"Launch Attack"**.
5. Inspect the side-by-side **Normal Baseline vs Attacked Histogram** and the metric deltas ($\Delta\delta, \Delta\text{QBER}, \Delta F, \Delta\chi^2$).

---

### Workflow E: Asking the AI Quantum Security Copilot
1. Go to **"Security Copilot"** (`/copilot`).
2. Select a recent verification attempt from the context dropdown.
3. Choose a quick prompt chip or type any custom query:
   - *"Why was this session classified under this verdict?"*
   - *"Show the mathematical and statistical distance proof."*
   - *"Explain how Pauli feedforward corrections preserved the state."*
4. The Copilot reasons strictly over the structured measurement context, citing quantum physical principles (No-Cloning Theorem, Entanglement Monogamy, Projective Measurement collapse) and mitigation actions.

---

### Workflow F: Generating & Exporting Security Audit Reports
1. Go to **"Audit Reports"** (`/reports`).
2. Click **"Generate New Report"** to bundle the latest verification attempt.
3. Inspect the formal layout containing the Executive Summary, Mathematical Measurement Proofs, Circuit Metadata, and Mitigations.
4. Click **"Print / Save PDF"** to export a clean audit artifact.

---

### Workflow G: Tuning Statistical Detection Thresholds
1. Go to **"Settings & Thresholds"** (`/settings`).
2. Adjust:
   - `FORGERY_THRESHOLD` (Default: `0.1500`)
   - `CHANNEL_TAMPER_THRESHOLD` (Default: `10.0%`)
   - `REPLAY_SIMILARITY_THRESHOLD` (Default: `0.9200`)
   - `MIN_ACCEPTABLE_FIDELITY` (Default: `0.8500`)
   - `CHI_SQUARE_ALPHA` (Default: `0.0500`)
3. Click **"Save & Apply Thresholds"**. The backend updates its decision policy immediately in memory without server restart.

---

## 4. How to Start the Application

### Option 1: Local Development
```bash
# Terminal 1: Backend
.\.venv\Scripts\python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
- Open in browser: `http://localhost:5173`
- API Swagger Docs: `http://localhost:8000/docs`

### Option 2: Docker Compose (All-in-One)
```bash
docker compose up --build
```
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 5. Running the Automated Test Suite

```bash
.\.venv\Scripts\pytest backend/tests/ -v
```
All 13 unit and integration tests validate the quantum simulator, Pauli corrections, statistical distance metrics, and attack detection rules.
