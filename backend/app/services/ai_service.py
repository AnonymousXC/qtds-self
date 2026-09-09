"""
AI Quantum Security Copilot Service.

Provider-agnostic LLM abstraction with local deterministic fallback reasoning.
Strictly consumes structured JSON emitted by the deterministic quantum engine.
NEVER overrides or decides the security verdict independently.
"""

import httpx
from typing import Dict, Any, List, Optional
from ..config import settings


class AISecurityCopilot:
    @staticmethod
    async def explain_security_event(
        user_query: Optional[str],
        structured_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Processes a user query and structured quantum context to produce an explainable security briefing.
        """
        verdict = structured_context.get("status", "UNKNOWN")
        attack_type = structured_context.get("attack_type", "NONE")
        evidence = structured_context.get("evidence", [])
        stats = structured_context.get("statistical_metrics", {})
        circuit = structured_context.get("circuit_metadata", {})
        
        # If OpenAI key is available, call OpenAI-compatible API
        if settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY.strip()) > 5:
            try:
                system_prompt = (
                    "You are the Quantum Security Copilot for an advanced Quantum Digital Signature (QDS) platform. "
                    "You provide clear, mathematically sound, scientific explanations for quantum cyber threat incidents. "
                    "CRITICAL CONSTRAINT: You must NEVER contradict or override the deterministic quantum detection verdict. "
                    "Base your reasoning strictly on the supplied deterministic evidence, TVD, QBER, Chi-Square statistics, "
                    "Bell-state entanglement, and Pauli projective measurement outcomes."
                )
                
                context_summary = f"""
Deterministic Analysis Report:
- Security Verdict: {verdict}
- Attack Classification: {attack_type}
- Total Variation Distance (TVD): {stats.get('total_variation_distance')}
- Quantum Bit Error Rate (QBER): {stats.get('qber')}
- State Fidelity: {stats.get('fidelity')}
- Chi-Square Stat: {stats.get('chi_square_statistic')} (p-value: {stats.get('chi_square_p_value')})
- Applied Threshold: {structured_context.get('threshold_applied')}
- Deterministic Evidence:
{chr(10).join(['  * ' + e for e in evidence])}
"""
                
                user_msg = user_query if user_query else "Explain this verification result and what the quantum statistics indicate."
                
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        f"{settings.OPENAI_BASE_URL}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": settings.OPENAI_MODEL,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": f"{context_summary}\n\nUser Question: {user_msg}"}
                            ],
                            "temperature": 0.2
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation_text = data["choices"][0]["message"]["content"]
                        return {
                            "query": user_msg,
                            "explanation": explanation_text,
                            "verdict": verdict,
                            "attack_type": attack_type,
                            "confidence_note": "AI-generated explanation based on deterministic quantum analysis",
                            "evidence_referenced": evidence,
                            "quantum_principles": [
                                "Bell-state Entanglement (|Phi+> EPR pairs)",
                                "Quantum Teleportation & No-Cloning Theorem",
                                "Projective Measurement in Pauli X/Y/Z Bases",
                                "Statistical Distance Hypothesis Testing"
                            ],
                            "recommended_actions": AISecurityCopilot._generate_recommendations(verdict, attack_type)
                        }
            except Exception:
                # Graceful fallback to offline scientific reasoning engine
                pass

        # Offline / Built-in Deterministic Scientific Reasoning Engine
        explanation = AISecurityCopilot._build_deterministic_explanation(
            user_query=user_query,
            verdict=verdict,
            attack_type=attack_type,
            stats=stats,
            evidence=evidence
        )

        return {
            "query": user_query or "Analyze verification result",
            "explanation": explanation,
            "verdict": verdict,
            "attack_type": attack_type,
            "confidence_note": "Deterministic quantum scientific analysis engine",
            "evidence_referenced": evidence,
            "quantum_principles": [
                "Bell-state Entanglement (|Phi+> EPR pairs)",
                "Quantum Teleportation Protocol (Bennett et al. 1993)",
                "Pauli Eigenstates & Projective Measurements",
                "Total Variation Distance & QBER Thresholding"
            ],
            "recommended_actions": AISecurityCopilot._generate_recommendations(verdict, attack_type)
        }

    @staticmethod
    def _build_deterministic_explanation(
        user_query: Optional[str],
        verdict: str,
        attack_type: str,
        stats: Dict[str, Any],
        evidence: List[str]
    ) -> str:
        tvd = stats.get("total_variation_distance", 0.0)
        qber = stats.get("qber", 0.0)
        fidelity = stats.get("fidelity", 1.0)
        chi2 = stats.get("chi_square_statistic", 0.0)
        p_val = stats.get("chi_square_p_value", 1.0)

        if verdict == "SECURE":
            return (
                f"### Analysis: Legitimate Signature Verified\n\n"
                f"The deterministic quantum verification pipeline confirms the digital signature is **authentic and untampered**.\n\n"
                f"- **Total Variation Distance (TVD)** is **{tvd:.4f}**, well below the anomaly threshold (0.1500).\n"
                f"- **Quantum State Fidelity** is **{fidelity:.4f}**, proving that the teleported quantum token retained maximum overlap with Alice's original state $|\\psi\\rangle$.\n"
                f"- **Quantum Bit Error Rate (QBER)** was measured at **{qber * 100:.2f}%**, indicating zero depolarizing channel noise or eavesdropping.\n"
                f"- The **Chi-Square goodness-of-fit test** ($\chi^2 = {chi2:.2f}, p = {p_val:.4f}$) confirms that the observed projective measurement counts match the theoretical Pauli eigenstate distribution."
            )
        elif attack_type == "SIGNATURE_FORGERY":
            return (
                f"### Incident Briefing: Signature Forgery Detected\n\n"
                f"The deterministic detection engine intercepted a **forged quantum signature**.\n\n"
                f"- **Total Variation Distance (TVD)** spiked to **{tvd:.4f}**, exceeding the safety limit (0.1500).\n"
                f"- **State Fidelity collapsed to {fidelity:.4f}**, which is a direct physical consequence of the **Quantum No-Cloning Theorem**: an adversary attempting to guess or forge Alice's unknown quantum token without knowing the Pauli basis introduces orthogonal state projections.\n"
                f"- **Projective measurements** in the verification basis revealed a severe divergence from the expected eigenstate."
            )
        elif attack_type == "CHANNEL_TAMPERING":
            return (
                f"### Incident Briefing: Quantum Channel Tampering / Intercept-Resend\n\n"
                f"An active eavesdropping or decoherence attack was detected on the optical quantum link.\n\n"
                f"- **Quantum Bit Error Rate (QBER)** reached **{qber * 100:.2f}%**, exceeding the safety threshold (10.00%).\n"
                f"- The **Chi-Square test rejected the channel hypothesis** with $\chi^2 = {chi2:.2f}$ ($p = {p_val:.6f} < 0.05$).\n"
                f"- In teleportation-based QDS, any intercept-resend or depolarizing disturbance on the entangled EPR channel breaks Bell state correlation, inducing detectable measurement errors."
            )
        elif attack_type == "REPLAY_ATTACK":
            return (
                f"### Incident Briefing: Quantum Signature Replay Attack\n\n"
                f"The security framework detected an adversary attempting to reuse a previously captured signature token.\n\n"
                f"- The signature token collided with an **expired session nonce**.\n"
                f"- In a true teleportation QDS protocol, each signature requires fresh entanglement generation. Resubmitting classical measurement outcomes without establishing a new EPR pair violates protocol temporal consistency."
            )
        elif attack_type == "IMPERSONATION":
            return (
                f"### Incident Briefing: Identity Impersonation Attack\n\n"
                f"An unauthorized sender attempted to sign using a forged identity or unauthorized quantum key sequence.\n\n"
                f"- The sender's public key tokens failed to bind to Alice's registered Pauli key sequence.\n"
                f"- Projective measurements resulted in complete parity inversion in the verification basis (TVD = {tvd:.4f})."
            )
        else:
            return (
                f"### Security Review\n\n"
                f"Verdict: **{verdict}** (Threat Type: **{attack_type}**).\n"
                f"TVD: {tvd:.4f}, QBER: {qber * 100:.2f}%, Fidelity: {fidelity:.4f}."
            )

    @staticmethod
    def _generate_recommendations(verdict: str, attack_type: str) -> List[str]:
        if verdict == "SECURE":
            return [
                "Accept digital signature and execute authenticated transaction.",
                "Archive quantum session telemetry in audit ledger.",
                "Maintain active EPR entanglement channel for subsequent messages."
            ]
        elif attack_type == "CHANNEL_TAMPERING":
            return [
                "Immediate halt of current QDS transmission channel.",
                "Trigger Quantum Channel Calibration and check optical fiber attenuation.",
                "Switch to alternate entangled Bell pair distribution path.",
                "Log eavesdropping attempt to Security Operations Center."
            ]
        elif attack_type == "SIGNATURE_FORGERY":
            return [
                "Reject signature immediately and flag sender IP / key ID.",
                "Revoke public key binding for compromised session.",
                "Require Alice to regenerate quantum private key sequence."
            ]
        elif attack_type == "REPLAY_ATTACK":
            return [
                "Drop replayed transaction and invalidate nonce.",
                "Enforce strict monotonic timestamp nonce validation on verifier endpoints.",
                "Alert incident response team of replay activity."
            ]
        else:
            return [
                "Quarantine verification attempt for manual security review.",
                "Inspect raw Qiskit measurement histograms."
            ]
