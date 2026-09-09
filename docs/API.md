# REST API Specification

Interactive OpenAPI documentation is automatically available at:
`http://localhost:8000/docs`

## Core Endpoints

### QDS Protocol
- `POST /api/qds/session` - Create new QDS session with Bell pairs and Alice's key tokens.
- `GET /api/qds/sessions` - List recent QDS sessions.
- `POST /api/qds/signature/generate` - Generate quantum teleportation signature tokens.
- `POST /api/qds/signature/verify` - Execute Qiskit verification circuit and deterministic threat detection.
- `GET /api/qds/lab/simulate-circuit` - Interactive circuit simulation for Quantum Lab.

### Attack Simulator
- `POST /api/attacks/simulate` - Simulate controlled cyber threat and calculate before/after metric deltas.

### Security & Analytics
- `GET /api/dashboard/summary` - Real-time telemetry, TVD curves, and system status.
- `GET /api/security/events` - Filterable audit event ledger.
- `GET /api/security/thresholds` - Fetch active mathematical detection thresholds.
- `POST /api/security/thresholds` - Dynamically update active thresholds.

### AI Copilot & Reports
- `POST /api/ai/explain` - Explain structured detection results using the auxiliary Copilot.
- `POST /api/reports/generate` - Generate formal security audit report.
- `GET /api/reports` - List audit reports.
- `GET /api/reports/{id}` - Fetch audit report artifact.
