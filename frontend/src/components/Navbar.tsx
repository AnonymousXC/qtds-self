import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, RefreshCw, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  currentSessionId?: string;
  onRefresh?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSessionId, onRefresh }) => {
  const [wsConnected, setWsConnected] = useState(true);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
    } catch {
      setWsConnected(false);
    }
    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <header className="h-14 border-b border-[var(--border-panel)] bg-[var(--bg-panel)] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Product Title / Breadcrumb context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-primary)] text-xs tracking-wide font-mono">
            QTDS // SECURITY PLATFORM
          </span>
          <span className="h-3 w-px bg-[var(--border-panel)] hidden sm:inline-block" />
          <span className="text-[11px] text-[var(--text-muted)] font-sans hidden md:inline">
            Quantum Threat Detection System
          </span>
        </div>
      </div>

      {/* Center Engine Telemetry - Clean System Metadata */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-sans text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-[var(--text-muted)]">Backend:</span>
          <span className="font-mono text-[var(--text-primary)] font-medium">Qiskit Aer</span>
        </div>

        <span className="h-3 w-px bg-[var(--border-panel)]" />

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-[var(--text-muted)]">Engine:</span>
          <span className="font-sans text-[var(--text-primary)] font-medium">Zero-ML Deterministic</span>
        </div>

        <span className="h-3 w-px bg-[var(--border-panel)]" />

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[var(--text-muted)]">Feed:</span>
          <span className="font-mono text-[var(--text-primary)]">{wsConnected ? 'LIVE' : 'POLLING'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {currentSessionId && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] rounded text-[var(--text-secondary)]">
            <span className="text-[var(--text-muted)] text-[10px]">SESSION:</span>
            <span className="text-sky-500 font-medium text-[11px]">{currentSessionId}</span>
          </div>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] rounded transition-colors focus:outline-none"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* 1-Click Judge Demo Quick Action */}
        <Link
          to="/demo"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Judge Demo</span>
        </Link>
      </div>
    </header>
  );
};
