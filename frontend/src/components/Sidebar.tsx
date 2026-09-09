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
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { to: '/quantum-lab', label: 'Quantum Lab', icon: Atom },
    { to: '/qds-signature', label: 'QDS Signature', icon: KeyRound },
    { to: '/verification', label: 'Verification Center', icon: ShieldAlert },
    { to: '/attack-lab', label: 'Attack Lab', icon: Flame },
    { to: '/threat-analytics', label: 'Threat Analytics', icon: LineChart },
    { to: '/security-events', label: 'Security Events', icon: History },
    { to: '/copilot', label: 'Security Copilot', icon: Bot },
    { to: '/reports', label: 'Audit Reports', icon: FileText },
    { to: '/demo', label: 'Judge Demo Mode', icon: Sparkles, highlight: true },
    { to: '/settings', label: 'Settings & Thresholds', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="py-4">
        <div className="px-5 mb-3 text-[11px] font-mono tracking-wider text-slate-500 uppercase">
          Navigation Modules
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? item.highlight
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-800 text-cyan-400 border border-slate-700 font-semibold shadow-sm'
                      : item.highlight
                      ? 'text-cyan-400/90 hover:bg-cyan-950/40 hover:text-cyan-300 border border-cyan-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                    2-MIN
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Protocol Architecture Footer */}
      <div className="p-4 m-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between text-slate-300">
          <span>QDS PROTOCOL</span>
          <span className="text-emerald-400 text-[10px]">ACTIVE</span>
        </div>
        <div className="text-[10px] text-slate-500 space-y-0.5">
          <div>• Teleportation Signing</div>
          <div>• Pauli X/Z Corrections</div>
          <div>• Statistical TVD Distance</div>
          <div>• Zero-ML Detection Engine</div>
        </div>
      </div>
    </aside>
  );
};
