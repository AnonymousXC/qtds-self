"""
Deterministic Statistical Analysis and Metric Calculations for QDS Security.

Implements information-theoretic and statistical distance metrics:
- Total Variation Distance (TVD)
- Hellinger Distance
- Chi-Square Goodness-of-Fit Test (Statistic and p-value)
- Kullback-Leibler (KL) Divergence
- Quantum Bit Error Rate (QBER)
- State Fidelity Estimation
- Entropy Deviation
"""

from typing import Dict, Any, Tuple
import numpy as np
from scipy.stats import chi2


def total_variation_distance(p: Dict[str, float], q: Dict[str, float]) -> float:
    """
    Computes the Total Variation Distance:
    delta(P, Q) = 1/2 * sum_{x} |P(x) - Q(x)|
    Bounded in [0, 1].
    """
    all_keys = set(p.keys()).union(set(q.keys()))
    tvd = 0.5 * sum(abs(p.get(k, 0.0) - q.get(k, 0.0)) for k in all_keys)
    return float(tvd)


def hellinger_distance(p: Dict[str, float], q: Dict[str, float]) -> float:
    """
    Computes the Hellinger Distance:
    H(P, Q) = 1/sqrt(2) * sqrt( sum_{x} (sqrt(P(x)) - sqrt(Q(x)))^2 )
    Bounded in [0, 1].
    """
    all_keys = set(p.keys()).union(set(q.keys()))
    h_sq = sum((np.sqrt(max(0.0, p.get(k, 0.0))) - np.sqrt(max(0.0, q.get(k, 0.0)))) ** 2 for k in all_keys)
    return float((1.0 / np.sqrt(2.0)) * np.sqrt(h_sq))


def chi_square_test(
    observed_counts: Dict[str, int],
    expected_prob: Dict[str, float],
    total_shots: int
) -> Tuple[float, float, int]:
    """
    Computes Chi-Square statistic and corresponding p-value.
    chi^2 = sum_i (O_i - E_i)^2 / E_i
    
    Returns:
        (chi2_stat, p_value, degrees_of_freedom)
    """
    all_keys = sorted(list(set(observed_counts.keys()).union(set(expected_prob.keys()))))
    chi2_stat = 0.0
    k = len(all_keys)
    df = max(1, k - 1)
    
    for key in all_keys:
        obs = float(observed_counts.get(key, 0))
        exp = float(expected_prob.get(key, 0.0)) * total_shots
        if exp > 1e-6:
            chi2_stat += ((obs - exp) ** 2) / exp
        elif obs > 0:
            # High penalty for observing forbidden state
            chi2_stat += (obs ** 2) / 0.001

    p_value = float(1.0 - chi2.cdf(chi2_stat, df))
    return float(chi2_stat), float(max(0.0, min(1.0, p_value))), df


def kl_divergence(p: Dict[str, float], q: Dict[str, float], epsilon: float = 1e-12) -> float:
    """
    Computes Kullback-Leibler Divergence:
    D_KL(P || Q) = sum_x P(x) * log( (P(x) + eps) / (Q(x) + eps) )
    """
    all_keys = set(p.keys()).union(set(q.keys()))
    kl = 0.0
    for k in all_keys:
        p_val = max(epsilon, p.get(k, 0.0))
        q_val = max(epsilon, q.get(k, 0.0))
        kl += p_val * np.log(p_val / q_val)
    return float(max(0.0, kl))


def compute_qber(observed_counts: Dict[str, int], expected_state: str) -> float:
    """
    Calculates the Quantum Bit Error Rate (QBER) for the target measured qubit:
    ratio of incorrect projective measurement results over total shots.
    """
    total = sum(observed_counts.values())
    if total == 0:
        return 0.0
    
    # In deterministic eigenstate verification:
    # If expected_state is '0' or '+', expected bit is '0'
    # If expected_state is '1' or '-', expected bit is '1'
    expected_bit = "1" if expected_state in ("1", "-", "L") else "0"
    errors = sum(count for bit, count in observed_counts.items() if bit != expected_bit)
    return float(errors / total)


def estimate_state_fidelity(observed_dist: Dict[str, float], expected_dist: Dict[str, float]) -> float:
    """
    Calculates Classical Fidelity (Bhattacharyya coefficient):
    F_cl(P, Q) = ( sum_x sqrt(P(x) * Q(x)) )^2
    Fidelity is 1.0 for perfect overlap, 0.0 for orthogonal states.
    """
    all_keys = set(observed_dist.keys()).union(set(expected_dist.keys()))
    bc = sum(np.sqrt(max(0.0, observed_dist.get(k, 0.0)) * max(0.0, expected_dist.get(k, 0.0))) for k in all_keys)
    fidelity = float(bc ** 2)
    return float(max(0.0, min(1.0, fidelity)))


def compute_comprehensive_metrics(
    observed_counts: Dict[str, int],
    expected_prob: Dict[str, float],
    input_state: str,
    total_shots: int
) -> Dict[str, Any]:
    """
    Generates a full statistical analysis payload for verification decision engine.
    """
    total = sum(observed_counts.values()) or total_shots or 1
    observed_prob = {k: count / total for k, count in observed_counts.items()}
    
    # Fill in missing keys with 0.0
    for k in expected_prob:
        if k not in observed_prob:
            observed_prob[k] = 0.0
            
    tvd = total_variation_distance(observed_prob, expected_prob)
    h_dist = hellinger_distance(observed_prob, expected_prob)
    chi2_val, p_val, df = chi_square_test(observed_counts, expected_prob, total)
    kl = kl_divergence(observed_prob, expected_prob)
    qber = compute_qber(observed_counts, input_state)
    fidelity = estimate_state_fidelity(observed_prob, expected_prob)
    
    return {
        "total_shots": total,
        "observed_distribution": observed_prob,
        "expected_distribution": expected_prob,
        "total_variation_distance": round(tvd, 5),
        "hellinger_distance": round(h_dist, 5),
        "chi_square_statistic": round(chi2_val, 4),
        "chi_square_p_value": round(p_val, 6),
        "degrees_of_freedom": df,
        "kl_divergence": round(kl, 5),
        "qber": round(qber, 5),
        "fidelity": round(fidelity, 5)
    }
