import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Bot,
  FileText,
  Activity,
  Cpu,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  Scale,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { VerificationAttempt, Signature } from '../types';
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
  const { data: signatures, isLoading: signaturesLoading, refetch: refetchSignatures } = useQuery({
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              SIGNATURE VERIFICATION WORKSPACE
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
              BOB (RECEIVER / VERIFIER)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic quantum verification pipeline applying Pauli corrections, projective measurements, and statistical distance proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/qds-signature"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-mono font-semibold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Generate New Signature (Alice)</span>
          </Link>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Attack Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <form onSubmit={handleVerify} className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>VERIFICATION PARAMETERS</span>
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">Target QDS Session</label>
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  setSelectedSignatureId('');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none focus:border-cyan-500"
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
                <label className="text-slate-400">Target Signature Token</label>
                <span className="text-[10px] text-slate-500">{signatures?.length || 0} signatures in session</span>
              </div>
              <select
                value={selectedSignatureId}
                onChange={(e) => setSelectedSignatureId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none focus:border-cyan-500"
              >
                {signatures && signatures.length > 0 ? (
                  signatures.map((sig) => (
                    <option key={sig.id} value={sig.id}>
                      {sig.id} - "{sig.message.slice(0, 30)}..."
                    </option>
                  ))
                ) : (
                  <option value="">(Auto-generate signature on verify)</option>
                )}
              </select>
            </div>

            {selectedSignature && (
              <div className="p-3 rounded bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-400">Message Payload:</div>
                <div className="text-slate-200 font-sans">{selectedSignature.message}</div>
                <div className="text-[10px] text-cyan-400 truncate pt-1">
                  SHA-256: {selectedSignature.message_digest}
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-400 block mb-1">Verifier Node Identity</label>
              <input
                type="text"
                value={verifierId}
                onChange={(e) => setVerifierId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none"
              />
            </div>

            {/* Controlled Cyber Attack Injection */}
            <div className="p-3 rounded bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>SIMULATE CYBER THREAT VECTOR</span>
                <span className="text-[10px] text-amber-400 font-mono">OPTIONAL</span>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 text-[11px]">Attack Vector</label>
                <select
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 outline-none text-xs"
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
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Attack Severity</span>
                    <span className="text-rose-400 font-bold">{(attackSeverity * 100).toFixed(0)}%</span>
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
              <label className="text-slate-400 block mb-1">Simulator Shots: {shots}</label>
              <input
                type="range"
                min="512"
                max="4096"
                step="512"
                value={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending || !selectedSessionId}
              className="w-full py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-md text-xs"
            >
              {verifyMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Simulating Quantum Circuit...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Quantum Verification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: 6-Stage Pipeline, Detailed Rejection Proofs & Histograms (8 cols) */}
        <div className="lg:col-span-8 space-y-5 font-mono">
          {/* 6-Stage Pipeline Visualization */}
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              Deterministic Quantum Verification Pipeline
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px]">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">1. Intake</div>
                <div className="text-slate-400 text-[9px]">Nonce & Token</div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  {verificationResult?.attack_type === 'REPLAY_ATTACK' ? 'REPLAY!' : 'PASSED'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">2. Teleport</div>
                <div className="text-slate-400 text-[9px]">EPR Pair |Φ+⟩</div>
                <div className="text-[10px] text-emerald-400 font-bold">MEASURED</div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">3. Pauli Fix</div>
                <div className="text-slate-400 text-[9px]">Z^c0 · X^c1</div>
                <div className="text-[10px] text-emerald-400 font-bold">APPLIED</div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">4. Proj. Meas.</div>
                <div className="text-slate-400 text-[9px]">Pauli Basis</div>
                <div className="text-[10px] text-emerald-400 font-bold">COLLAPSED</div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">5. Statistics</div>
                <div className="text-slate-400 text-[9px]">TVD, H, χ²</div>
                <div className="text-[10px] text-cyan-300 font-bold">
                  {verificationResult ? `δ=${verificationResult.statistical_metrics.total_variation_distance.toFixed(3)}` : 'READY'}
                </div>
              </div>

              <div className={`p-2.5 rounded border space-y-1 ${
                verificationResult?.status === 'MALICIOUS'
                  ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                  : verificationResult?.status === 'SECURE'
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <div className="font-bold">6. Verdict</div>
                <div className="text-[9px]">Decision Rule</div>
                <div className="text-[10px] font-bold">
                  {verificationResult ? verificationResult.status : 'PENDING'}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Verdict & Detailed Mathematical Proof Card */}
          {verificationResult && (
            <div className={`rounded-lg border p-6 space-y-5 ${
              verificationResult.status === 'MALICIOUS'
                ? 'bg-rose-950/30 border-rose-800/80'
                : verificationResult.status === 'SUSPICIOUS'
                ? 'bg-amber-950/30 border-amber-800/80'
                : 'bg-emerald-950/30 border-emerald-800/80'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <VerdictBadge status={verificationResult.status} size="lg" />
                  <span className="text-xs text-slate-300">
                    Attack Classification: <strong className="text-rose-400">{verificationResult.attack_type}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/copilot?verification_id=${verificationResult.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 text-xs font-semibold"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Explain With AI Copilot</span>
                  </Link>

                  <Link
                    to={`/reports?verification_id=${verificationResult.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Audit Report</span>
                  </Link>
                </div>
              </div>

              {/* Statistical Proof Distance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">TOTAL VARIATION DISTANCE</div>
                  <div className={`text-base font-bold ${verificationResult.statistical_metrics.total_variation_distance > 0.15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    δ = {verificationResult.statistical_metrics.total_variation_distance.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Threshold: ≤ {verificationResult.threshold_applied.toFixed(4)}
                  </div>
                  <div className={`text-[9px] font-bold mt-1 ${verificationResult.statistical_metrics.total_variation_distance > 0.15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {verificationResult.statistical_metrics.total_variation_distance > 0.15 ? 'FAIL: δ > 0.1500' : 'PASS: δ ≤ 0.1500'}
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">QUANTUM BIT ERROR (QBER)</div>
                  <div className={`text-base font-bold ${verificationResult.statistical_metrics.qber > 0.10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {(verificationResult.statistical_metrics.qber * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Safety Limit: ≤ 10.00%</div>
                  <div className={`text-[9px] font-bold mt-1 ${verificationResult.statistical_metrics.qber > 0.10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {verificationResult.statistical_metrics.qber > 0.10 ? 'FAIL: QBER > 10%' : 'PASS: QBER ≤ 10%'}
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">STATE FIDELITY F(P,Q)</div>
                  <div className={`text-base font-bold ${verificationResult.statistical_metrics.fidelity < 0.85 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    F = {verificationResult.statistical_metrics.fidelity.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Min Bound: ≥ 0.8500</div>
                  <div className={`text-[9px] font-bold mt-1 ${verificationResult.statistical_metrics.fidelity < 0.85 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {verificationResult.statistical_metrics.fidelity < 0.85 ? 'FAIL: F < 0.8500' : 'PASS: F ≥ 0.8500'}
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">CHI-SQUARE GOODNESS-OF-FIT</div>
                  <div className="text-base font-bold text-slate-200">
                    p = {verificationResult.statistical_metrics.chi_square_p_value.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">χ² = {verificationResult.statistical_metrics.chi_square_statistic.toFixed(2)}</div>
                  <div className={`text-[9px] font-bold mt-1 ${verificationResult.statistical_metrics.chi_square_p_value < 0.05 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {verificationResult.statistical_metrics.chi_square_p_value < 0.05 ? 'REJECT: p < 0.05' : 'ACCEPT: p ≥ 0.05'}
                  </div>
                </div>
              </div>

              {/* Rigorous Deterministic Proof Explanations */}
              <div className="space-y-2 p-4 rounded bg-slate-950/90 border border-slate-800 text-xs">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>DETERMINISTIC MATHEMATICAL REJECTION & ACCEPTANCE PROOF</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  {verificationResult.evidence.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-400 mt-0.5 font-bold">•</span>
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
