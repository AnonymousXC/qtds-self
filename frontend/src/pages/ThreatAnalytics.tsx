import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart as LineChartIcon, Calculator } from 'lucide-react';
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
import { useTheme } from '../context/ThemeContext';

export const ThreatAnalytics: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <LineChartIcon className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Mathematical & Statistical Threat Analytics
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded">
              RIGOROUS METRICS
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Information-theoretic distances and hypothesis test telemetry behind the deterministic quantum threat detection engine.
          </p>
        </div>
      </div>

      {/* 4 Core Mathematical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] space-y-2.5">
          <div className="text-[var(--text-primary)] font-sans font-medium flex justify-between items-center">
            <span>Total Variation Distance</span>
            <span className="font-mono text-sky-500 font-semibold text-xs">δ(P, Q)</span>
          </div>
          <div className="p-2.5 rounded bg-[var(--code-bg)] border border-[var(--border-panel)] font-mono text-sky-500 text-[11px]">
            δ(P, Q) = ½ ∑ |P(x) - Q(x)|
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
            Measures the maximum difference in probability assigned to any verification event. Safety threshold: δ ≤ 0.1500.
          </p>
        </div>

        <div className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] space-y-2.5">
          <div className="text-[var(--text-primary)] font-sans font-medium flex justify-between items-center">
            <span>Hellinger Distance</span>
            <span className="font-mono text-indigo-500 font-semibold text-xs">H(P, Q)</span>
          </div>
          <div className="p-2.5 rounded bg-[var(--code-bg)] border border-[var(--border-panel)] font-mono text-indigo-500 text-[11px]">
            H = (1/√2) √(∑ (√P - √Q)²)
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
            Quantifies the geometric divergence of state vectors in Hilbert space. Resilient against isolated probability outliers.
          </p>
        </div>

        <div className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] space-y-2.5">
          <div className="text-[var(--text-primary)] font-sans font-medium flex justify-between items-center">
            <span>Chi-Square Test</span>
            <span className="font-mono text-emerald-500 font-semibold text-xs">χ² & p-value</span>
          </div>
          <div className="p-2.5 rounded bg-[var(--code-bg)] border border-[var(--border-panel)] font-mono text-emerald-500 text-[11px]">
            χ² = ∑ (O_i - E_i)² / E_i
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
            Hypothesis test confirming whether observed projective outcomes match theoretical eigenstate statistics (α = 0.05).
          </p>
        </div>

        <div className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] space-y-2.5">
          <div className="text-[var(--text-primary)] font-sans font-medium flex justify-between items-center">
            <span>Quantum State Fidelity</span>
            <span className="font-mono text-emerald-500 font-semibold text-xs">F(P, Q)</span>
          </div>
          <div className="p-2.5 rounded bg-[var(--code-bg)] border border-[var(--border-panel)] font-mono text-emerald-500 text-[11px]">
            F = (∑ √(P(x) · Q(x)))²
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
            Classical overlap metric of teleported qubit measurements. Must remain above 0.8500 for authentic signatures.
          </p>
        </div>
      </div>

      {/* Multi-Metric Telemetry Chart */}
      <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-500" />
            <span>Historical Statistical Divergence Curves</span>
          </h3>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Telemetry Stream</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
              <XAxis dataKey="index" stroke={isLight ? '#64748B' : '#64748B'} fontSize={11} tickLine={false} />
              <YAxis stroke={isLight ? '#64748B' : '#64748B'} domain={[0, 1]} fontSize={11} tickLine={false} axisLine={false} />
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
              <Line type="monotone" dataKey="tvd" name="TVD Distance δ" stroke="#0284C7" strokeWidth={2} dot={{ r: 3, fill: '#0284C7' }} />
              <Line type="monotone" dataKey="hellinger" name="Hellinger Distance H" stroke="#6366F1" strokeWidth={1.5} dot={{ r: 2, fill: '#6366F1' }} />
              <Line type="monotone" dataKey="fidelity" name="State Fidelity F" stroke="#10B981" strokeWidth={1.5} dot={{ r: 2, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
