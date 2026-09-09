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
    <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-mono">
            MEASUREMENT PROBABILITY DISTRIBUTION
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            TVD: <strong className={tvd > 0.15 ? 'text-rose-400' : 'text-emerald-400'}>{tvd?.toFixed(4)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            Fidelity: <strong className={fidelity < 0.85 ? 'text-rose-400' : 'text-cyan-400'}>{fidelity?.toFixed(4)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            Shots: <strong className="text-slate-200">{shots}</strong>
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="state" stroke="#64748b" fontStyle="normal" fontSize={12} />
            <YAxis stroke="#64748b" unit="%" domain={[0, 100]} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              formatter={(val: any, name: any, item: any) => [
                `${val}% (${name === 'observed' ? item.payload.obsCount : item.payload.expCount} shots)`,
                name === 'observed' ? 'Observed Measurements' : 'Theoretical Expected'
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
            <Bar dataKey="expected" fill="#3b82f6" name="Theoretical Expected" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="observed"
              fill={tvd > 0.15 ? '#f43f5e' : '#10b981'}
              name="Observed Measurements"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Statistical Distance: <code className="text-cyan-300">δ(P, Q) = ½ ∑ |P(x) - Q(x)| = {tvd?.toFixed(4)}</code></span>
        <span className={tvd > 0.15 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
          {tvd > 0.15 ? 'ANOMALY DETECTED' : 'WITHIN STATISTICAL TOLERANCE'}
        </span>
      </div>
    </div>
  );
};
