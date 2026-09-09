# Deterministic Threat Detection Logic & Statistical Rules

## 1. Zero AI/ML Principle

In compliance with the official Smart India Hackathon problem statement, the core cyber threat detection engine operates **strictly without AI/ML models**. 

Instead, threat identification relies on:
- **Total Variation Distance ($\delta$)**
- **Hellinger Distance ($H$)**
- **Chi-Square Goodness-of-Fit Test ($\chi^2$ and $p$-value)**
- **Quantum Bit Error Rate ($\text{QBER}$)**
- **State Overlap Fidelity ($F$)**
- **Temporal Nonce Verification**

---

## 2. Mathematical Metric Definitions

### Total Variation Distance (TVD)
$$\delta(P, Q) = \frac{1}{2} \sum_{x \in \{0, 1\}} |P(x) - Q(x)|$$
Bounded in $[0, 1]$. In an ideal channel, $\delta < 0.05$. If $\delta > \text{FORGERY\_THRESHOLD}$ ($0.15$), a state forgery threat is flagged.

### Hellinger Distance
$$H(P, Q) = \frac{1}{\sqrt{2}} \sqrt{\sum_{x} \left(\sqrt{P(x)} - \sqrt{Q(x)}\right)^2}$$
Quantifies geometric distance on the unit sphere in Hilbert space.

### Chi-Square Goodness-of-Fit
$$\chi^2 = \sum_{i=1}^k \frac{(O_i - E_i)^2}{E_i}$$
Calculates $p$-value against $1$ degree of freedom. If $p < \alpha = 0.05$, the null hypothesis (clean channel) is rejected.

---

## 3. Threat Classification Rules

| Threat Vector | Detection Condition | Decision Verdict |
|---|---|---|
| **Legitimate Signature** | $\delta \le 0.15 \land \text{QBER} \le 0.10 \land F \ge 0.85$ | `SECURE` |
| **Signature Forgery** | $\delta > 0.15 \lor F < 0.85$ | `MALICIOUS (SIGNATURE_FORGERY)` |
| **Quantum Channel Tampering** | $\text{QBER} > 0.10 \lor (p < 0.05 \land \delta > 0.08)$ | `MALICIOUS (CHANNEL_TAMPERING)` |
| **Replay Attack** | Nonce Reuse Collision across sessions | `MALICIOUS (REPLAY_ATTACK)` |
| **Identity Impersonation** | Public Key Token Mismatch $\land \delta > 0.40$ | `MALICIOUS (IMPERSONATION)` |
