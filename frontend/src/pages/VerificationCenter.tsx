import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  Play,
  Layers,
  Bot,
  FileText,
  RefreshCw,
  PlusCircle,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { VerificationAttempt } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';
import { MeasurementHistogram } from '../components/MeasurementHistogram';

export const VerificationCenter: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const initialSessionId = searchParams.get('session_id') || '';
  const initialSignatureId = searchParams.get('signature_id') || '';

  const [selectedSessionId, setSelectedSessionId] = useState<string>(initialSessionId);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>(initialSignatureId);
  const [verifierId, setVerifierId] = useState<string>('Bob');
  const [shots, setShots] = useState<number>(2048);
  const [attackType, setAttackType] = useState<string>('NONE');
  const [attackSeverity, setAttackSeverity] = useState<number>(0.0);

  const [verificationResult, setVerificationResult] = useState<VerificationAttempt | null>(null);

  // Fetch all sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['qdsSessions'],
    queryFn: () => api.listSessions(20)
  });

  // Set default session if available
  useEffect(() => {
    if (sessions && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  // Fetch signatures for selected session
  const { data: signatures, isLoading: signaturesLoading } = useQuery({
    queryKey: ['sessionSignatures', selectedSessionId],
    queryFn: () => (selectedSessionId ? api.listSignaturesBySession(selectedSessionId) : Promise.resolve([])),
    enabled: !!selectedSessionId
  });

  // Auto-select latest signature
  useEffect(() => {
    if (signatures && signatures.length > 0 && !selectedSignatureId) {
      setSelectedSignatureId(signatures[0].id);
    }
  }, [signatures, selectedSignatureId]);

  // Verification Mutation
  const verifyMutation = useMutation({
    mutationFn: api.verifySignature,
    onSuccess: (data) => {
      setVerificationResult(data);
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['verificationsHistory'] });
      queryClient.invalidateQueries({ queryKey: ['securityEvents'] });
    }
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) return;

    verifyMutation.mutate({
      session_id: selectedSessionId,
      signature_id: selectedSignatureId || 'latest',
      verifier_id: verifierId,
      shots,
      attack_type: attackType,
      attack_severity: attackSeverity
    });
  };

  const selectedSignature = signatures?.find((s) => s.id === selectedSignatureId);

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Signature Verification Workspace
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded">
              VERIFIER WORKSPACE (BOB)
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Deterministic quantum verification pipeline applying Pauli corrections, projective measurements, and statistical distance proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/qds-signature"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-xs font-sans font-medium transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Signature (Alice)</span>
          </Link>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Attack Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <form onSubmit={handleVerify} className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4 text-xs">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>Verification Parameters</span>
            </h3>

            <div>
              <label className="text-[var(--text-secondary)] font-sans block mb-1">Target QDS Channel</label>
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  setSelectedSignatureId('');
                }}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-3 py-2 text-[var(--text-primary)] outline-none focus:border-sky-500 font-mono text-xs"
              >
                {sessions?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} ({s.sender} → {s.receiver}) [{s.key_length} tokens]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[var(--text-secondary)] font-sans">Target Signature</label>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{signatures?.length || 0} in channel</span>
              </div>
              <select
                value={selectedSignatureId}
                onChange={(e) => setSelectedSignatureId(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-3 py-2 text-[var(--text-primary)] outline-none focus:border-sky-500 font-mono text-xs"
              >
                {signatures && signatures.length > 0 ? (
                  signatures.map((sig) => (
                    <option key={sig.id} value={sig.id}>
                      {sig.id} - "{sig.message.slice(0, 28)}..."
                    </option>
                  ))
                ) : (
                  <option value="">(Auto-generate signature on verify)</option>
                )}
              </select>
            </div>

            {selectedSignature && (
              <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[11px] space-y-1">
                <div className="text-[var(--text-muted)] font-sans">Message Payload:</div>
                <div className="text-[var(--text-primary)] font-sans leading-relaxed">{selectedSignature.message}</div>
                <div className="text-[10px] font-mono text-sky-500 truncate pt-1">
                  SHA-256: {selectedSignature.message_digest}
                </div>
              </div>
            )}

            <div>
              <label className="text-[var(--text-secondary)] font-sans block mb-1">Verifier Node Identity</label>
              <input
                type="text"
                value={verifierId}
                onChange={(e) => setVerifierId(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-3 py-2 text-[var(--text-primary)] outline-none font-mono text-xs focus:border-sky-500"
              />
            </div>

            {/* Controlled Cyber Attack Injection */}
            <div className="p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-2.5">
              <div className="text-[11px] font-semibold text-[var(--text-primary)] font-sans flex items-center justify-between">
                <span>Simulate Cyber Threat Vector</span>
                <span className="text-[10px] text-amber-500 font-mono">OPTIONAL</span>
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-sans block mb-1 text-[11px]">Threat Vector</label>
                <select
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none text-xs font-sans focus:border-sky-500"
                >
                  <option value="NONE">No Attack (Legitimate Signature)</option>
                  <option value="SIGNATURE_FORGERY">Signature Forgery (Adversary State Guessing)</option>
                  <option value="IMPERSONATION">Identity Impersonation (Key Mismatch)</option>
                  <option value="REPLAY_ATTACK">Quantum Replay Attack (Nonce Reuse)</option>
                  <option value="CHANNEL_TAMPERING">Quantum Channel Tampering (Decoherence Noise)</option>
                </select>
              </div>

              {attackType !== 'NONE' && attackType !== 'REPLAY_ATTACK' && (
                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-sans mb-1">
                    <span>Attack Severity</span>
                    <span className="text-rose-500 font-mono font-bold">{(attackSeverity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={attackSeverity}
                    onChange={(e) => setAttackSeverity(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-secondary)] font-sans mb-1">
                <span>Simulator Shots</span>
                <span className="font-mono text-sky-500 font-semibold">{shots}</span>
              </div>
              <input
                type="range"
                min="512"
                max="4096"
                step="512"
                value={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending || !selectedSessionId}
              className="w-full py-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans font-medium flex items-center justify-center gap-2 transition-colors shadow-xs text-xs disabled:opacity-50"
            >
              {verifyMutation.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating Quantum Circuit...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Quantum Verification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: 6-Stage Pipeline, Rejection Proofs & Histograms (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 6-Stage Pipeline Visualization */}
          <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-3.5">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono pb-2 border-b border-[var(--border-subtle)]">
              Deterministic Quantum Verification Pipeline
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px] font-mono">
              <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                <div className="text-sky-500 font-semibold">1. Intake</div>
                <div className="text-[var(--text-muted)] text-[9px]">Nonce & Token</div>
                <div className="text-[10px] text-emerald-500 font-semibold">
                  {verificationResult?.attack_type === 'REPLAY_ATTACK' ? 'REPLAY!' : 'PASSED'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                <div className="text-sky-500 font-semibold">2. Teleport</div>
                <div className="text-[var(--text-muted)] text-[9px]">EPR Pair |Φ+⟩</div>
                <div className="text-[10px] text-emerald-500 font-semibold">MEASURED</div>
              </div>

              <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                <div className="text-sky-500 font-semibold">3. Pauli Fix</div>
                <div className="text-[var(--text-muted)] text-[9px]">Z^c0 · X^c1</div>
                <div className="text-[10px] text-emerald-500 font-semibold">APPLIED</div>
              </div>

              <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                <div className="text-sky-500 font-semibold">4. Proj. Meas.</div>
                <div className="text-[var(--text-muted)] text-[9px]">Pauli Basis</div>
                <div className="text-[10px] text-emerald-500 font-semibold">COLLAPSED</div>
              </div>

              <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                <div className="text-sky-500 font-semibold">5. Statistics</div>
                <div className="text-[var(--text-muted)] text-[9px]">TVD, H, χ²</div>
                <div className="text-[10px] text-sky-500 font-semibold">
                  {verificationResult ? `δ=${verificationResult.statistical_metrics.total_variation_distance.toFixed(3)}` : 'READY'}
                </div>
              </div>

              <div className={`p-2.5 rounded border space-y-1 ${
                verificationResult?.status === 'MALICIOUS'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : verificationResult?.status === 'SECURE'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-[var(--bg-panel-subtle)] border-[var(--border-panel)] text-[var(--text-muted)]'
              }`}>
                <div className="font-semibold">6. Verdict</div>
                <div className="text-[9px]">Decision Rule</div>
                <div className="text-[10px] font-bold">
                  {verificationResult ? verificationResult.status : 'PENDING'}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Verdict & Detailed Mathematical Proof Card */}
          {verificationResult && (
            <div className={`rounded-md border p-5 space-y-5 ${
              verificationResult.status === 'MALICIOUS'
                ? 'bg-rose-500/5 border-rose-500/30'
                : verificationResult.status === 'SUSPICIOUS'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-emerald-500/5 border-emerald-500/30'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <VerdictBadge status={verificationResult.status} size="lg" />
                  <span className="text-xs text-[var(--text-secondary)] font-sans">
                    Classification: <strong className="font-mono text-rose-500">{verificationResult.attack_type}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/copilot?verification_id=${verificationResult.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-sky-500 text-xs font-sans font-medium transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Explain with Copilot</span>
                  </Link>

                  <Link
                    to={`/reports?verification_id=${verificationResult.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-xs font-sans font-medium transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Audit Report</span>
                  </Link>
                </div>
              </div>

              {/* Statistical Proof Distance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-[var(--bg-panel)] border border-[var(--border-panel)]">
                  <div className="text-[var(--text-muted)] text-[10px] font-sans">TOTAL VARIATION DISTANCE</div>
                  <div className={`text-base font-bold ${verificationResult.statistical_metrics.total_variation_distance > 0.15 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    δ = {verificationResult.statistical_metrics.total_variation_distance.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    Threshold: ≤ {verificationResult.threshold_applied.toFixed(4)}
                  </div>
                  <div className={`text-[9px] font-semibold mt-1 ${verificationResult.statistical_metrics.total_variation_distance > 0.15 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {verificationResult.statistical_metrics.total_variation_distance > 0.15 ? 'FAIL: δ > 0.1500' : 'PASS: δ ≤ 0.1500'}
                  </div>
                </div>

                <div className="p-3 rounded bg-[var(--bg-panel)] border border-[var(--border-panel)]">
                  <div className="text-[var(--text-muted)] text-[10px] font-sans">QUANTUM BIT ERROR</div>
                  <div className={`text-base font-bold ${verificationResult.statistical_metrics.qber > 0.10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {(verificationResult.statistical_metrics.qber * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Limit: ≤ 10.00%</div>
                  <div className={`text-[9px] font-semibold mt-1 ${verificationResult.statistical_metrics.qber > 0.10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {verificationResult.statistical_metrics.qber > 0.10 ? 'FAIL: QBER > 10%' : 'PASS: QBER ≤ 10%'}
                  </div>
                </div>

                <div className="p-3 rounded bg-[var(--bg-panel)] border border-[var(--border-panel)]">
                  <div className="text-[var(--text-muted)] text-[10px] font-sans">STATE FIDELITY</div>
                  <div className={`text-base font-bold ${verificationResult.statistical_metrics.fidelity < 0.85 ? 'text-rose-500' : 'text-sky-500'}`}>
                    F = {verificationResult.statistical_metrics.fidelity.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Min Bound: ≥ 0.8500</div>
                  <div className={`text-[9px] font-semibold mt-1 ${verificationResult.statistical_metrics.fidelity < 0.85 ? 'text-rose-500' : 'text-sky-500'}`}>
                    {verificationResult.statistical_metrics.fidelity < 0.85 ? 'FAIL: F < 0.8500' : 'PASS: F ≥ 0.8500'}
                  </div>
                </div>

                <div className="p-3 rounded bg-[var(--bg-panel)] border border-[var(--border-panel)]">
                  <div className="text-[var(--text-muted)] text-[10px] font-sans">CHI-SQUARE TEST</div>
                  <div className="text-base font-bold text-[var(--text-primary)]">
                    p = {verificationResult.statistical_metrics.chi_square_p_value.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">χ² = {verificationResult.statistical_metrics.chi_square_statistic.toFixed(2)}</div>
                  <div className={`text-[9px] font-semibold mt-1 ${verificationResult.statistical_metrics.chi_square_p_value < 0.05 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {verificationResult.statistical_metrics.chi_square_p_value < 0.05 ? 'REJECT: p < 0.05' : 'ACCEPT: p ≥ 0.05'}
                  </div>
                </div>
              </div>

              {/* Rigorous Deterministic Proof Explanations */}
              <div className="space-y-2 p-3.5 rounded bg-[var(--bg-panel)] border border-[var(--border-panel)] text-xs">
                <div className="text-xs font-semibold text-sky-500 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Deterministic Mathematical Rejection & Acceptance Proof</span>
                </div>
                <ul className="space-y-1.5 text-[var(--text-secondary)] font-sans">
                  {verificationResult.evidence.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-sky-500 mt-0.5 font-bold font-mono">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Histogram Visualizer for current verification */}
          {verificationResult && (
            <MeasurementHistogram
              observedDistribution={verificationResult.observed_distribution}
              expectedDistribution={verificationResult.expected_distribution}
              shots={shots}
              tvd={verificationResult.statistical_metrics.total_variation_distance}
              fidelity={verificationResult.statistical_metrics.fidelity}
            />
          )}
        </div>
      </div>
    </div>
  );
};
