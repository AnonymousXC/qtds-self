import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { SecurityStatus } from '../types';

interface VerdictBadgeProps {
  status: SecurityStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const normalized = (status || 'UNKNOWN').toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = ShieldCheck;
  let label = normalized;

  if (normalized === 'SECURE') {
    colorClasses = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
    Icon = ShieldCheck;
    label = 'SECURE (AUTHENTIC)';
  } else if (normalized === 'SUSPICIOUS') {
    colorClasses = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
    Icon = AlertTriangle;
    label = 'SUSPICIOUS (MARGINAL)';
  } else if (normalized === 'MALICIOUS') {
    colorClasses = 'bg-rose-950/80 text-rose-400 border-rose-800/60';
    Icon = ShieldAlert;
    label = 'MALICIOUS (THREAT DETECTED)';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border rounded-md ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
