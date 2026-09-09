# AI Integration & Quantum Security Copilot

## 1. Role of AI in the Architecture

> [!IMPORTANT]
> The AI Security Copilot is strictly an **auxiliary reasoning and summarization tool**.
> It NEVER performs threat classification or decides whether a signature is authentic.

### Deterministic Isolation Architecture
```
[ Qiskit Simulation ] 
        ↓
[ Deterministic Detection Engine ] → (Status: MALICIOUS, TVD: 0.28, QBER: 18%)
        ↓
[ Structured JSON Context ]
        ↓
[ AI Quantum Security Copilot ] → (Explains physical mechanism to user/auditor)
```

## 2. LLM Provider Configuration

The backend supports any OpenAI-compatible LLM endpoint via environment variables:

```bash
# In .env or docker-compose
OPENAI_API_KEY="your-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_MODEL="gpt-4o-mini"
```

### Offline Fallback Engine
If `OPENAI_API_KEY` is not provided, the Copilot automatically activates its **built-in deterministic scientific reasoning engine**, ensuring full capability in offline or air-gapped environments without failure.
