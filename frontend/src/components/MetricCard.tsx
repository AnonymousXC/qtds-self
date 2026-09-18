import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
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
  trend,
  formula
}) => {
  return (
    <div className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] hover:border-[var(--border-hover)] transition-all space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide font-sans">
          {title}
        </span>
        {trend && (
          <span
            className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border ${
              trend.isNeutral
                ? 'bg-[var(--bg-panel-subtle)] text-[var(--text-secondary)] border-[var(--border-panel)]'
                : trend.isPositive
                ? 'bg-[var(--status-secure-bg)] text-[var(--status-secure-text)] border-[var(--status-secure-border)]'
                : 'bg-[var(--status-malicious-bg)] text-[var(--status-malicious-text)] border-[var(--status-malicious-border)]'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
        {value}
      </div>

      {(subtitle || formula) && (
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1.5 border-t border-[var(--border-subtle)]">
          <span className="truncate">{subtitle}</span>
          {formula && (
            <span className="font-mono text-[10px] text-[var(--text-secondary)] shrink-0 ml-2 bg-[var(--bg-panel-subtle)] px-1.5 py-0.2 rounded border border-[var(--border-panel)]">
              {formula}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
