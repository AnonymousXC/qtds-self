import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Flame, Play, RefreshCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { AttackComparison } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';
import { useTheme } from '../context/ThemeContext';

export const AttackLab: React.FC = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [attackType, setAttackType] = useState<string>('CHANNEL_TAMPERING');
  const [severity, setSeverity] = useState<number>(0.5);
  const [shots, setShots] = useState<number>(2048);
  const [inputState, setInputState] = useState<string>('+');
  const [measurementBasis, setMeasurementBasis] = useState<string>('X');

  const [comparisonResult, setComparisonResult] = useState<AttackComparison | null>(null);

  const attackMutation = useMutation({
    mutationFn: api.simulateAttack,
    onSuccess: (data) => {
      setComparisonResult(data);
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    attackMutation.mutate({
      attack_type: attackType,
      severity,
      shots,
      input_state: inputState,
      measurement_basis: measurementBasis
    });
  };

  const comparisonChartData = comparisonResult
    ? [
        {
          state: '|0⟩ State',
          Normal: Number(((comparisonResult.normal_run.observed_distribution['0'] || 0) * 100).toFixed(2)),
          Attacked: Number(((comparisonResult.attack_run.observed_distribution['0'] || 0) * 100).toFixed(2))
        },
        {
          state: '|1⟩ State',
          Normal: Number(((comparisonResult.normal_run.observed_distribution['1'] || 0) * 100).toFixed(2)),
          Attacked: Number(((comparisonResult.attack_run.observed_distribution['1'] || 0) * 100).toFixed(2))
        }
      ]
    : [];

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-rose-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Quantum Cyber Attack Simulator & Lab
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded">
              ADVERSARIAL INJECTION
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Inject controlled physical and protocol cyber threats into live Qiskit teleportation circuits and inspect statistical degradation.
          </p>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <form onSubmit={handleSimulate} className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] text-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-[var(--text-secondary)] font-sans block mb-1 font-medium">Threat Vector</label>
            <select
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none focus:border-sky-500 font-sans text-xs"
            >
              <option value="CHANNEL_TAMPERING">Channel Noise / Jamming</option>
              <option value="SIGNATURE_FORGERY">Signature Forgery (State Guessing)</option>
              <option value="IMPERSONATION">Identity Impersonation (Key Desync)</option>
              <option value="REPLAY_ATTACK">Quantum Replay Attack (Nonce Reuse)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[var(--text-secondary)] font-sans mb-1">
              <span className="font-medium">Perturbation Severity</span>
              <span className="text-rose-500 font-mono font-bold">{(severity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer mt-1.5"
            />
          </div>

          <div>
            <label className="text-[var(--text-secondary)] font-sans block mb-1 font-medium">Target State |ψ⟩</label>
            <select
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none font-mono text-xs focus:border-sky-500"
            >
              <option value="+">|+⟩ Hadamard Basis</option>
              <option value="-">|-⟩ Phase-Flip</option>
              <option value="0">|0⟩ Computational Zero</option>
              <option value="1">|1⟩ Computational One</option>
              <option value="R">|R⟩ Circular Right</option>
            </select>
          </div>

          <div>
            <label className="text-[var(--text-secondary)] font-sans block mb-1 font-medium">Measurement Basis</label>
            <select
              value={measurementBasis}
              onChange={(e) => setMeasurementBasis(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none font-mono text-xs focus:border-sky-500"
            >
              <option value="X">X-Basis [|+⟩, |-⟩]</option>
              <option value="Z">Z-Basis [|0⟩, |1⟩]</option>
              <option value="Y">Y-Basis [|R⟩, |L⟩]</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={attackMutation.isPending}
              className="w-full py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-sans font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              {attackMutation.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Launch Attack</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comparative Analysis Section */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Delta KPI Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] space-y-1">
              <div className="text-[var(--text-muted)] text-[10px] font-sans">DETECTION VERDICT</div>
              <div className="mt-1">
                <VerdictBadge status={comparisonResult.detection_verdict} size="sm" />
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)]">
              <div className="text-[var(--text-muted)] text-[10px] font-sans">TVD SHIFT (Δδ)</div>
              <div className="text-lg font-bold text-rose-500">
                +{comparisonResult.metrics_delta.tvd_delta.toFixed(4)}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {comparisonResult.normal_run.statistical_metrics.total_variation_distance.toFixed(3)} →{' '}
                {comparisonResult.attack_run.statistical_metrics.total_variation_distance.toFixed(3)}
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)]">
              <div className="text-[var(--text-muted)] text-[10px] font-sans">QBER ERROR INCREASE</div>
              <div className="text-lg font-bold text-rose-500">
                +{(comparisonResult.metrics_delta.qber_delta * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {(comparisonResult.normal_run.statistical_metrics.qber * 100).toFixed(1)}% →{' '}
                {(comparisonResult.attack_run.statistical_metrics.qber * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)]">
              <div className="text-[var(--text-muted)] text-[10px] font-sans">STATE FIDELITY DROP</div>
              <div className="text-lg font-bold text-amber-500">
                -{(comparisonResult.metrics_delta.fidelity_drop * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {comparisonResult.normal_run.statistical_metrics.fidelity.toFixed(3)} →{' '}
                {comparisonResult.attack_run.statistical_metrics.fidelity.toFixed(3)}
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)]">
              <div className="text-[var(--text-muted)] text-[10px] font-sans">CHI-SQUARE DIVERGENCE</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                Δχ² = +{comparisonResult.metrics_delta.chi2_increase.toFixed(1)}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Null hypothesis rejected</div>
            </div>
          </div>

          {/* Side-by-Side Distribution Chart & Evidence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span>Normal Baseline vs Attacked Distribution</span>
                <span className="text-[11px] text-rose-500 font-mono">Divergence Detected</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
                    <XAxis dataKey="state" stroke={isLight ? '#64748B' : '#64748B'} fontSize={11} tickLine={false} />
                    <YAxis stroke={isLight ? '#64748B' : '#64748B'} unit="%" domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isLight ? '#FFFFFF' : '#0E131A',
                        borderColor: isLight ? '#D0D7DE' : '#2A394E',
                        color: isLight ? '#1B222C' : '#F1F5F9',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
                    <Bar dataKey="Normal" fill="#10B981" name="Normal (Authentic)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Attacked" fill="#EF4444" name={`Attacked (${attackType})`} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Evidence & Physical Mechanism Box */}
            <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4 text-xs">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span>Deterministic Classification Reasoning</span>
                <span className="text-[10px] text-sky-500 font-mono">Zero-ML Engine</span>
              </h3>

              <div className="p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-2">
                <div className="text-xs font-semibold text-rose-500 font-sans">Threat Signatures Identified:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[var(--text-secondary)] font-sans">
                  {comparisonResult.evidence.map((e, idx) => (
                    <li key={idx} className="leading-relaxed">{e}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[11px] text-[var(--text-muted)] space-y-1.5 font-sans">
                <div className="font-semibold text-[var(--text-primary)]">Quantum Physical Mechanism:</div>
                <p className="leading-relaxed">
                  {comparisonResult.attack_run.attack_info?.mechanism ||
                    'Perturbation collapses entangled correlations into orthogonal subspaces.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
