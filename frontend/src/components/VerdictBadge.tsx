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

  let colorClasses = 'bg-[var(--bg-panel-elevated)] text-[var(--text-secondary)] border-[var(--border-panel)]';
  let Icon = ShieldCheck;
  let label = normalized;

  if (normalized === 'SECURE') {
    colorClasses = 'bg-[var(--status-secure-bg)] text-[var(--status-secure-text)] border-[var(--status-secure-border)]';
    Icon = ShieldCheck;
    label = 'SECURE (AUTHENTIC)';
  } else if (normalized === 'SUSPICIOUS') {
    colorClasses = 'bg-[var(--status-suspicious-bg)] text-[var(--status-suspicious-text)] border-[var(--status-suspicious-border)]';
    Icon = AlertTriangle;
    label = 'SUSPICIOUS (MARGINAL)';
  } else if (normalized === 'MALICIOUS') {
    colorClasses = 'bg-[var(--status-malicious-bg)] text-[var(--status-malicious-text)] border-[var(--status-malicious-border)]';
    Icon = ShieldAlert;
    label = 'MALICIOUS (THREAT DETECTED)';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono tracking-tight border rounded ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
