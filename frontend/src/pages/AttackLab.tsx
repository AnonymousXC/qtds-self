import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Flame, Play, ShieldAlert, ArrowRight, TrendingUp, Cpu, Info, RefreshCw } from 'lucide-react';
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

export const AttackLab: React.FC = () => {
  const queryClient = useQueryClient();
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              QUANTUM CYBER ATTACK SIMULATOR & LAB
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded">
              ADVERSARIAL INJECTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inject controlled physical and protocol cyber threats into live Qiskit teleportation circuits and inspect statistical degradation.
          </p>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <form onSubmit={handleSimulate} className="p-5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Threat Vector</label>
            <select
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="CHANNEL_TAMPERING">Quantum Channel Noise / Eavesdropping</option>
              <option value="SIGNATURE_FORGERY">Signature Forgery (State Guessing)</option>
              <option value="IMPERSONATION">Identity Impersonation (Key Desync)</option>
              <option value="REPLAY_ATTACK">Quantum Replay Attack (Nonce Reuse)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span className="font-semibold">Perturbation Severity</span>
              <span className="text-rose-400 font-bold">{(severity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Target State |ψ⟩</label>
            <select
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none"
            >
              <option value="+">|+⟩ Hadamard Basis</option>
              <option value="-">|-⟩ Phase-Flip</option>
              <option value="0">|0⟩ Computational Zero</option>
              <option value="1">|1⟩ Computational One</option>
              <option value="R">|R⟩ Circular Right</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Pauli Measurement Basis</label>
            <select
              value={measurementBasis}
              onChange={(e) => setMeasurementBasis(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none"
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
              className="w-full py-2.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {attackMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
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
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">DETECTION VERDICT</div>
              <div className="mt-1">
                <VerdictBadge status={comparisonResult.detection_verdict} size="sm" />
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">TVD SHIFT (Δδ)</div>
              <div className="text-lg font-bold text-rose-400">
                +{comparisonResult.metrics_delta.tvd_delta.toFixed(4)}
              </div>
              <div className="text-[10px] text-slate-400">
                {comparisonResult.normal_run.statistical_metrics.total_variation_distance.toFixed(3)} →{' '}
                {comparisonResult.attack_run.statistical_metrics.total_variation_distance.toFixed(3)}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">QBER ERROR INCREASE</div>
              <div className="text-lg font-bold text-rose-400">
                +{(comparisonResult.metrics_delta.qber_delta * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400">
                {(comparisonResult.normal_run.statistical_metrics.qber * 100).toFixed(1)}% →{' '}
                {(comparisonResult.attack_run.statistical_metrics.qber * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">STATE FIDELITY DROP</div>
              <div className="text-lg font-bold text-amber-400">
                -{(comparisonResult.metrics_delta.fidelity_drop * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400">
                {comparisonResult.normal_run.statistical_metrics.fidelity.toFixed(3)} →{' '}
                {comparisonResult.attack_run.statistical_metrics.fidelity.toFixed(3)}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px]">CHI-SQUARE DIVERGENCE</div>
              <div className="text-lg font-bold text-slate-200">
                Δχ² = +{comparisonResult.metrics_delta.chi2_increase.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400">Null hypothesis rejected</div>
            </div>
          </div>

          {/* Side-by-Side Distribution Chart & Evidence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center justify-between pb-3 border-b border-slate-800">
                <span>NORMAL BASELINE vs ATTACKED MEASUREMENTS</span>
                <span className="text-xs text-rose-400 font-mono">Divergence Detected</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="state" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" unit="%" domain={[0, 100]} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <Bar dataKey="Normal" fill="#10b981" name="Normal (Clean Teleportation)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Attacked" fill="#f43f5e" name={`Attacked (${attackType})`} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Evidence & Physical Mechanism Box */}
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 font-mono text-xs">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center justify-between pb-3 border-b border-slate-800">
                <span>DETERMINISTIC CLASSIFICATION REASONING</span>
                <span className="text-[10px] text-cyan-400">Zero AI / ML</span>
              </h3>

              <div className="p-3 rounded bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-slate-300">
                <div className="text-xs font-semibold text-rose-400">Threat Signatures Identified:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                  {comparisonResult.evidence.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Quantum Physical Mechanism:</div>
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
