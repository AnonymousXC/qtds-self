import React from 'react';
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
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MeasurementHistogramProps {
  observedDistribution?: Record<string, number>;
  expectedDistribution?: Record<string, number>;
  shots?: number;
  tvd?: number;
  fidelity?: number;
}

export const MeasurementHistogram: React.FC<MeasurementHistogramProps> = ({
  observedDistribution = { '0': 0.985, '1': 0.015 },
  expectedDistribution = { '0': 1.0, '1': 0.0 },
  shots = 2048,
  tvd = 0.015,
  fidelity = 0.99
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const chartData = [
    {
      state: '|0⟩ (State 0)',
      observed: Number(((observedDistribution['0'] || 0) * 100).toFixed(2)),
      expected: Number(((expectedDistribution['0'] || 0) * 100).toFixed(2)),
      obsCount: Math.round((observedDistribution['0'] || 0) * shots),
      expCount: Math.round((expectedDistribution['0'] || 0) * shots)
    },
    {
      state: '|1⟩ (State 1)',
      observed: Number(((observedDistribution['1'] || 0) * 100).toFixed(2)),
      expected: Number(((expectedDistribution['1'] || 0) * 100).toFixed(2)),
      obsCount: Math.round((observedDistribution['1'] || 0) * shots),
      expCount: Math.round((expectedDistribution['1'] || 0) * shots)
    }
  ];

  return (
    <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
            Measurement Probability Distribution
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-[11px]">
            TVD: <strong className={tvd > 0.15 ? 'text-rose-500' : 'text-emerald-500'}>{tvd?.toFixed(4)}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-[11px]">
            Fidelity: <strong className={fidelity < 0.85 ? 'text-rose-500' : 'text-sky-500'}>{fidelity?.toFixed(4)}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-[11px]">
            Shots: <strong className="text-[var(--text-primary)]">{shots}</strong>
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 2" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
            <XAxis dataKey="state" stroke={isLight ? '#64748B' : '#64748B'} fontStyle="normal" fontSize={11} tickLine={false} />
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
              formatter={(val: any, name: any, item: any) => [
                `${val}% (${name === 'observed' ? item.payload.obsCount : item.payload.expCount} shots)`,
                name === 'observed' ? 'Observed Measurements' : 'Theoretical Expected'
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
            <Bar dataKey="expected" fill="#0284C7" name="Theoretical Expected" radius={[2, 2, 0, 0]} />
            <Bar
              dataKey="observed"
              fill={tvd > 0.15 ? '#EF4444' : '#10B981'}
              name="Observed Measurements"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center justify-between">
        <span>Statistical Distance: <code className="text-sky-500">δ(P, Q) = ½ ∑ |P(x) - Q(x)| = {tvd?.toFixed(4)}</code></span>
        <span className={tvd > 0.15 ? 'text-rose-500 font-medium' : 'text-emerald-500 font-medium'}>
          {tvd > 0.15 ? 'ANOMALY DETECTED' : 'WITHIN STATISTICAL TOLERANCE'}
        </span>
      </div>
    </div>
  );
};
