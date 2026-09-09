import axios from 'axios';
import {
  QDSSession,
  Signature,
  VerificationAttempt,
  DashboardSummary,
  AttackComparison,
  SecurityEvent,
  ThresholdConfig,
  AICopilotResponse,
  AIReport
} from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Dashboard
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await client.get('/dashboard/summary');
    return res.data;
  },

  // QDS Sessions
  createSession: async (data: { sender?: string; receiver?: string; bell_state?: string; key_length?: number }): Promise<QDSSession> => {
    const res = await client.post('/qds/session', data);
    return res.data;
  },

  listSessions: async (limit: number = 20): Promise<QDSSession[]> => {
    const res = await client.get(`/qds/sessions?limit=${limit}`);
    return res.data;
  },

  getSession: async (sessionId: string): Promise<QDSSession> => {
    const res = await client.get(`/qds/session/${sessionId}`);
    return res.data;
  },

  // Signatures
  generateSignature: async (data: { session_id: string; message: string; signer_id?: string }): Promise<Signature> => {
    const res = await client.post('/qds/signature/generate', data);
    return res.data;
  },

  getSignature: async (signatureId: string): Promise<Signature> => {
    const res = await client.get(`/qds/signature/${signatureId}`);
    return res.data;
  },

  listSignaturesBySession: async (sessionId: string): Promise<Signature[]> => {
    const res = await client.get(`/qds/session/${sessionId}/signatures`);
    return res.data;
  },

  // Verification
  verifySignature: async (data: {
    session_id: string;
    signature_id: string;
    verifier_id?: string;
    shots?: number;
    attack_type?: string;
    attack_severity?: number;
    tamper_qubit?: number;
  }): Promise<VerificationAttempt> => {
    const res = await client.post('/qds/signature/verify', data);
    return res.data;
  },

  listVerifications: async (limit: number = 50): Promise<VerificationAttempt[]> => {
    const res = await client.get(`/qds/verifications?limit=${limit}`);
    return res.data;
  },

  getVerification: async (verificationId: string): Promise<VerificationAttempt> => {
    const res = await client.get(`/qds/verification/${verificationId}`);
    return res.data;
  },

  // Quantum Lab
  simulateQuantumLabCircuit: async (params: {
    input_state: string;
    measurement_basis: string;
    bell_state: string;
    shots: number;
    attack_type?: string;
    attack_severity?: number;
  }) => {
    const res = await client.get('/qds/lab/simulate-circuit', { params });
    return res.data;
  },

  // Attacks
  simulateAttack: async (data: {
    session_id?: string;
    attack_type: string;
    severity?: number;
    shots?: number;
    input_state?: string;
    measurement_basis?: string;
    bell_state?: string;
  }): Promise<AttackComparison> => {
    const res = await client.post('/attacks/simulate', data);
    return res.data;
  },

  // Security Events & Thresholds
  listSecurityEvents: async (params?: { limit?: number; severity?: string; attack_type?: string }): Promise<SecurityEvent[]> => {
    const res = await client.get('/security/events', { params });
    return res.data;
  },

  getThresholds: async (): Promise<ThresholdConfig> => {
    const res = await client.get('/security/thresholds');
    return res.data;
  },

  updateThresholds: async (data: ThresholdConfig): Promise<ThresholdConfig> => {
    const res = await client.post('/security/thresholds', data);
    return res.data;
  },

  // AI Copilot
  explainWithCopilot: async (data: {
    verification_id?: string;
    session_id?: string;
    user_query?: string;
    context_data?: any;
  }): Promise<AICopilotResponse> => {
    const res = await client.post('/ai/explain', data);
    return res.data;
  },

  // Reports
  generateReport: async (data: {
    verification_id?: string;
    session_id?: string;
    title?: string;
  }): Promise<AIReport> => {
    const res = await client.post('/reports/generate', data);
    return res.data;
  },

  listReports: async (): Promise<AIReport[]> => {
    const res = await client.get('/reports');
    return res.data;
  },

  getReport: async (reportId: string): Promise<AIReport> => {
    const res = await client.get(`/reports/${reportId}`);
    return res.data;
  }
};
