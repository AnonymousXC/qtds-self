import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart as LineChartIcon, BookOpen, Calculator, ShieldCheck, Cpu } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { MetricCard } from '../components/MetricCard';

export const ThreatAnalytics: React.FC = () => {
  const { data: verifications } = useQuery({
    queryKey: ['verificationsHistory'],
    queryFn: () => api.listVerifications(20)
  });

  const chartData = verifications
    ? verifications.slice().reverse().map((v, i) => ({
        index: `#${i + 1}`,
        tvd: Number(v.statistical_metrics.total_variation_distance.toFixed(4)),
        hellinger: Number(v.statistical_metrics.hellinger_distance.toFixed(4)),
        qber: Number((v.statistical_metrics.qber * 100).toFixed(2)),
        fidelity: Number(v.statistical_metrics.fidelity.toFixed(4)),
        status: v.status,
        attack: v.attack_type
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <LineChartIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              MATHEMATICAL & STATISTICAL THREAT ANALYTICS
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
              RIGOROUS METRICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Information-theoretic distances and hypothesis test telemetry behind the deterministic quantum threat detection engine.
          </p>
        </div>
      </div>

      {/* 4 Core Mathematical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 font-semibold flex justify-between">
            <span>Total Variation Distance</span>
            <span className="text-cyan-400">δ(P, Q)</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-cyan-300 text-[11px]">
            δ(P, Q) = ½ ∑ |P(x) - Q(x)|
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Measures the maximum difference in probability assigned to any verification event. Threshold: 0.1500.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 font-semibold flex justify-between">
            <span>Hellinger Distance</span>
            <span className="text-cyan-400">H(P, Q)</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-cyan-300 text-[11px]">
            H = (1/√2) √(∑ (√P - √Q)²)
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Quantifies the geometric divergence of state vectors in Hilbert space. Resilient to small probability outliers.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 font-semibold flex justify-between">
            <span>Chi-Square Test</span>
            <span className="text-cyan-400">χ² & p-value</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-cyan-300 text-[11px]">
            χ² = ∑ (O_i - E_i)² / E_i
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Goodness-of-fit hypothesis test confirming whether projective outcomes match theoretical eigenstate statistics.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 font-semibold flex justify-between">
            <span>Quantum State Fidelity</span>
            <span className="text-cyan-400">F(P, Q)</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-cyan-300 text-[11px]">
            F = (∑ √(P(x) · Q(x)))²
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Classical overlap metric of teleported qubit measurements. Must stay above 0.8500 for legitimate signatures.
          </p>
        </div>
      </div>

      {/* Multi-Metric Telemetry Chart */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>HISTORICAL STATISTICAL DIVERGENCE CURVES</span>
          </h3>
          <span className="text-xs text-slate-400">Recent Verifications</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="index" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" domain={[0, 1]} fontSize={11} />
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
              <Line type="monotone" dataKey="tvd" name="TVD Distance δ" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="hellinger" name="Hellinger H" stroke="#a855f7" strokeWidth={1.5} />
              <Line type="monotone" dataKey="fidelity" name="State Fidelity F" stroke="#10b981" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
