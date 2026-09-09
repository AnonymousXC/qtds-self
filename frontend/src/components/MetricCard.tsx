import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  formula?: string;
  statusColor?: 'cyan' | 'emerald' | 'rose' | 'amber' | 'slate';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  formula,
  statusColor = 'cyan'
}) => {
  const borderColors = {
    cyan: 'border-slate-800 hover:border-cyan-800/60',
    emerald: 'border-slate-800 hover:border-emerald-800/60',
    rose: 'border-slate-800 hover:border-rose-800/60',
    amber: 'border-slate-800 hover:border-amber-800/60',
    slate: 'border-slate-800 hover:border-slate-700'
  }[statusColor];

  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-950/40 border-cyan-900/50',
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50',
    rose: 'text-rose-400 bg-rose-950/40 border-rose-900/50',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-900/50',
    slate: 'text-slate-400 bg-slate-800 border-slate-700'
  }[statusColor];

  return (
    <div className={`p-4 rounded-lg bg-slate-900/90 border ${borderColors} transition-all space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-1.5 rounded-md border ${iconColors}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono tracking-tight text-slate-100">{value}</div>
        {trend && (
          <span
            className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded ${
              trend.isNeutral
                ? 'bg-slate-800 text-slate-300'
                : trend.isPositive
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                : 'bg-rose-950 text-rose-400 border border-rose-900/50'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {(subtitle || formula) && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span>{subtitle}</span>
          {formula && <span className="font-mono text-[10px] text-cyan-400/80">{formula}</span>}
        </div>
      )}
    </div>
  );
};
