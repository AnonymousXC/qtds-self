# Quantum-Inspired Cyber Threat Detection for Digital Signature Security

[![Status](https://img.shields.io/badge/Status-Production%20Ready-10b981?style=flat-square)]()
[![Engine](https://img.shields.io/badge/Quantum%20Engine-Qiskit%20Aer-06b6d4?style=flat-square)]()
[![Threat%20Detection](https://img.shields.io/badge/Detection%20Engine-Deterministic%20(Zero--ML)-10b981?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)]()

A full-stack, research-grade quantum cybersecurity platform implementing a teleportation-based Quantum Digital Signature (QDS) protocol with a **100% deterministic & statistical threat detection engine** (Total Variation Distance, Hellinger Distance, Chi-Square goodness-of-fit, QBER, State Overlap Fidelity) and an auxiliary **AI Quantum Security Copilot**.

---

## Key Features

- **Teleportation-Based QDS Protocol**: Real Qiskit circuits implementing Bell pair entanglement ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$), Alice Bell-basis measurements, classical feedforward Pauli corrections ($Z^{c_0} X^{c_1}$), and projective measurements in Pauli $X, Y, Z$ bases.
- **Deterministic Threat Detection (Zero AI/ML)**: Strictly rule-based, information-theoretic security engine detecting:
  - Signature Forgery
  - Identity Impersonation
  - Quantum Replay Attacks
  - Quantum Channel Tampering & Eavesdropping
- **Quantum Cyber Attack Simulator**: Interactive attack lab injecting depolarizing noise, state guessing, and key desync with live side-by-side distribution comparisons.
- **Auxiliary AI Quantum Security Copilot**: Context-aware cyber assistant explaining deterministic quantum telemetry and incident briefs (OpenAI-compatible with offline deterministic reasoning fallback).
- **1-Click Judge Demo Mode**: Guided 2-minute demonstration flow specifically tailored for hackathon evaluations.
- **10 Core Engineering Views**: Overview Dashboard, Quantum Lab, QDS Signature, Verification Center, Attack Lab, Threat Analytics, Security Events, Security Copilot, Audit Reports, and Settings.

---

## Quick Start (Local Run)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
# From repository root
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r backend/requirements.txt
```

Run Backend Server:
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running with Docker Compose

```bash
docker compose up --build
```
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## Running Automated Tests

```bash
.\.venv\Scripts\pytest backend/tests/ -v
```

All 13 unit and integration tests validate:
- Bell state preparation & trace normalization
- Teleportation fidelity and Pauli correction mappings
- Statistical distance calculations (TVD, Hellinger, Chi-square, Fidelity)
- Deterministic classification of Forgery, Replay, Impersonation, and Channel Tampering
- FastAPI REST endpoint lifecycles and AI Copilot responses

---

## Repository Structure

```
qtds/
├── quantum-engine/              # Pure scientific Python package (Qiskit & SciPy)
│   ├── bell_states.py          # EPR Bell state preparation
│   ├── teleportation.py        # Teleportation protocol circuit generator
│   ├── pauli.py                # Pauli operators & projective bases
│   ├── statistical_analysis.py # TVD, Hellinger, Chi-Square, Fidelity, QBER
│   ├── attack_models.py        # Controlled cyber attack injections
│   ├── simulator.py            # Qiskit Aer simulation manager
│   └── qds_protocol.py         # End-to-end QDS protocol orchestrator
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py             # Entrypoint & CORS
│   │   ├── config.py           # Configuration & thresholds
│   │   ├── core/               # Deterministic detection rules & thresholds
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic v2 schemas
│   │   ├── services/           # QDS, Verification, Attack, AI Copilot services
│   │   └── api/                # REST endpoints & WebSockets
│   ├── tests/                  # Automated pytest suite
│   └── requirements.txt
├── frontend/                   # React + TypeScript + Vite + Tailwind + DaisyUI
│   ├── src/
│   │   ├── components/         # Circuit visualizer, Histogram, Badges
│   │   ├── pages/              # 10 views + Judge Demo Mode
│   │   ├── services/           # Axios API client
│   │   └── types/              # TypeScript schemas
├── docs/                       # Technical Guides & Protocol Specifications
├── docker-compose.yml          # Container orchestrator
└── README.md
```

---

## Documentation
- [System Flow, Codebase Map & Video Script](SYSTEM_FLOW_AND_VIDEO_SCRIPT.md)
- [Platform User Manual](usage.md)
- [Architecture Design](docs/ARCHITECTURE.md)
- [Quantum Teleportation Model](docs/QUANTUM_MODEL.md)
- [Deterministic Threat Detection](docs/THREAT_DETECTION.md)
- [REST API Specification](docs/API.md)
- [AI Copilot Integration](docs/AI_INTEGRATION.md)
- [Judge 2-Minute Demo Guide](docs/DEMO_GUIDE.md)
