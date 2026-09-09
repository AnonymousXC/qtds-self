import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Activity, Radio, PlayCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  currentSessionId?: string;
  onRefresh?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSessionId, onRefresh }) => {
  const [wsConnected, setWsConnected] = useState(true);

  useEffect(() => {
    // Check WebSocket health or setup simple ping
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
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg">
          Q
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100 tracking-wide text-sm font-mono">QTDS-ENGINE</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded">
              v1.0 RESEARCH
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Quantum-Inspired Cyber Threat Detection for Digital Signatures</p>
        </div>
      </div>

      {/* Center Metadata Telemetry */}
      <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950/60 border border-slate-800 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">SIMULATOR:</span>
          <span className="text-cyan-300 font-medium">Qiskit Aer (Local)</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950/60 border border-slate-800 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-500">ENGINE:</span>
          <span className="text-emerald-400 font-medium">Deterministic & Statistical (Zero ML)</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950/60 border border-slate-800 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">TELEMETRY:</span>
          <span className="text-slate-200">{wsConnected ? 'ACTIVE' : 'POLLING'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {currentSessionId && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-slate-800/70 border border-slate-700/60 rounded text-slate-300">
            <span className="text-slate-500">SESSION:</span>
            <span className="text-cyan-400 font-bold">{currentSessionId}</span>
          </div>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-md transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* 1-Click Judge Demo Quick Action */}
        <Link
          to="/demo"
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm shadow-cyan-500/20"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>JUDGE DEMO MODE</span>
        </Link>
      </div>
    </header>
  );
};
