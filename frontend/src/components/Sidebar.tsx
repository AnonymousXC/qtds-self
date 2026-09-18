import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Atom,
  KeyRound,
  ShieldAlert,
  Flame,
  LineChart,
  History,
  Bot,
  FileText,
  Settings,
  Sparkles,
  Shield,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navSections = [
    {
      title: 'Operations & Telemetry',
      items: [
        { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
        { to: '/threat-analytics', label: 'Threat Analytics', icon: LineChart },
        { to: '/security-events', label: 'Security Events', icon: History },
      ]
    },
    {
      title: 'Quantum Workspace',
      items: [
        { to: '/quantum-lab', label: 'Quantum Lab', icon: Atom },
        { to: '/qds-signature', label: 'QDS Signature', icon: KeyRound },
        { to: '/verification', label: 'Verification Center', icon: ShieldAlert },
        { to: '/attack-lab', label: 'Attack Simulator', icon: Flame },
      ]
    },
    {
      title: 'Intelligence & Audit',
      items: [
        { to: '/copilot', label: 'Security Copilot', icon: Bot },
        { to: '/reports', label: 'Audit Reports', icon: FileText },
        { to: '/demo', label: 'Judge Demo Mode', icon: Sparkles, highlight: true },
        { to: '/settings', label: 'Settings & Thresholds', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[var(--bg-panel)] border-r border-[var(--border-panel)] flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[var(--border-panel)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] flex items-center justify-center text-sky-500 font-mono font-bold text-sm">
            <Shield className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--text-primary)] text-sm tracking-tight">QTDS Console</span>
              <span className="px-1.5 py-0.2 bg-[var(--bg-panel-elevated)] text-[var(--text-muted)] border border-[var(--border-panel)] rounded text-[9px] font-mono">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] truncate">Quantum Defense Engine</p>
          </div>
        </div>
      </div>

      {/* Navigation Modules with Calm, Intentional Spacing */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-2 text-[10px] font-sans font-medium tracking-wider text-[var(--text-muted)] uppercase">
              {section.title}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
                        isActive
                          ? item.highlight
                            ? 'bg-sky-500/10 text-sky-500 border-l-2 border-sky-500 pl-[8px] font-semibold'
                            : 'bg-[var(--bg-panel-elevated)] text-[var(--text-primary)] border-l-2 border-sky-500 pl-[8px] font-semibold'
                          : item.highlight
                          ? 'text-sky-500/90 hover:bg-[var(--bg-panel-subtle)] hover:text-sky-500'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel-subtle)]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[var(--text-muted)]" />
                    <span className="truncate">{item.label}</span>
                    {item.highlight && (
                      <span className="ml-auto px-1.5 py-0.2 text-[9px] font-mono bg-sky-500/10 text-sky-500 rounded border border-sky-500/20">
                        DEMO
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Protocol Architecture Diagnostic Status Footer */}
      <div className="p-3 m-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[11px] space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Radio className="w-3 h-3 text-emerald-500" />
            <span>QDS PROTOCOL</span>
          </span>
          <span className="text-emerald-500 font-medium px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px]">
            ACTIVE
          </span>
        </div>
        <div className="text-[10px] font-mono text-[var(--text-secondary)] space-y-0.5 border-t border-[var(--border-panel)] pt-1.5">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Signing:</span>
            <span>Teleportation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Correction:</span>
            <span>Pauli X/Z</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Metric:</span>
            <span>TVD &le; 0.1500</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
