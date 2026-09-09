export type AttackType = 
  | 'NONE'
  | 'SIGNATURE_FORGERY'
  | 'IMPERSONATION'
  | 'REPLAY_ATTACK'
  | 'CHANNEL_TAMPERING';

export type SecurityStatus = 'SECURE' | 'SUSPICIOUS' | 'MALICIOUS';

export interface KeyToken {
  index: number;
  token_id: string;
  state: string; // '0' | '1' | '+' | '-' | 'R' | 'L'
  basis: string; // 'Z' | 'X' | 'Y'
}

export interface QDSSession {
  id: string;
  sender: string;
  receiver: string;
  session_nonce: string;
  status: string;
  created_at: string;
  qubit_count: number;
  bell_state: string;
  key_length: number;
  key_tokens: KeyToken[];
}

export interface SignatureToken {
  token_index: number;
  token_id: string;
  message_bit: number;
  quantum_state: string;
  measurement_basis: string;
  teleportation_channel_id: string;
}

export interface Signature {
  id: string;
  session_id: string;
  message: string;
  message_digest: string;
  signer_id: string;
  created_at: string;
  signature_tokens: SignatureToken[];
}

export interface StatisticalMetrics {
  total_variation_distance: number;
  hellinger_distance: number;
  chi_square_statistic: number;
  chi_square_p_value: number;
  degrees_of_freedom: number;
  kl_divergence: number;
  qber: number;
  fidelity: number;
}

export interface CircuitMetadata {
  depth: number;
  total_gates: number;
  gate_breakdown: Record<string, number>;
  backend: string;
  diagram: string;
}

export interface VerificationAttempt {
  id: string;
  session_id: string;
  signature_id: string;
  verifier_id: string;
  status: SecurityStatus;
  attack_type: string;
  statistical_metrics: StatisticalMetrics;
  anomaly_score: number;
  forgery_probability: number;
  threshold_applied: number;
  evidence: string[];
  observed_distribution: Record<string, number>;
  expected_distribution: Record<string, number>;
  circuit_metadata: CircuitMetadata;
  execution_time_ms: number;
  timestamp: string;
}

export interface SecurityEvent {
  id: string;
  session_id?: string;
  event_type: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  attack_type: string;
  status: string;
  risk_score: number;
  details: string;
  metadata_payload: Record<string, any>;
  timestamp: string;
}

export interface DashboardSummary {
  system_health: string;
  quantum_backend: string;
  total_sessions: number;
  total_signatures: number;
  total_verifications: number;
  secure_verifications: number;
  threats_detected: number;
  attacks_blocked: number;
  average_tvd: number;
  average_qber: number;
  active_threat_level: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  recent_events: SecurityEvent[];
  attack_distribution: Record<string, number>;
  verification_timeline: Array<{
    id: string;
    time: string;
    status: string;
    attack_type: string;
    tvd: number;
    qber: number;
    fidelity: number;
  }>;
}

export interface AttackComparison {
  attack_type: string;
  severity: number;
  normal_run: any;
  attack_run: any;
  metrics_delta: {
    tvd_delta: number;
    hellinger_delta: number;
    qber_delta: number;
    fidelity_drop: number;
    chi2_increase: number;
  };
  detection_verdict: SecurityStatus;
  evidence: string[];
}

export interface ThresholdConfig {
  forgery_threshold: number;
  replay_similarity_threshold: number;
  channel_tamper_threshold: number;
  chi_square_alpha: number;
  min_acceptable_fidelity: number;
}

export interface AICopilotResponse {
  query: string;
  explanation: string;
  verdict: string;
  attack_type: string;
  confidence_note: string;
  evidence_referenced: string[];
  quantum_principles: string[];
  recommended_actions: string[];
}

export interface AIReport {
  id: string;
  session_id: string;
  title: string;
  verdict: string;
  attack_type: string;
  summary: string;
  quantum_evidence: Record<string, any>;
  statistical_breakdown: Record<string, any>;
  recommendations: string[];
  created_at: string;
}
