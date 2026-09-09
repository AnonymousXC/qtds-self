import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  Activity,
  KeyRound,
  Cpu,
  Flame,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  History,
  Bot,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { VerdictBadge } from '../components/VerdictBadge';

export const Dashboard: React.FC = () => {
  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: api.getDashboardSummary,
    refetchInterval: 5000 // Live polling every 5s
  });

  const attackData = summary
    ? Object.entries(summary.attack_distribution).map(([key, value]) => ({
        name: key.replace('_', ' '),
        count: value
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              SECURITY OPERATIONS CENTER
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time deterministic quantum threat detection and teleportation-based digital signature telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/demo"
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-mono text-xs font-semibold shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-CLICK JUDGE DEMO</span>
          </Link>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="System Security Status"
          value={summary?.active_threat_level || 'LOW'}
          subtitle="Deterministic Rules Engine"
          icon={ShieldCheck}
          statusColor={
            summary?.active_threat_level === 'CRITICAL'
              ? 'rose'
              : summary?.active_threat_level === 'HIGH'
              ? 'amber'
              : 'emerald'
          }
          trend={{
            value: summary?.active_threat_level === 'LOW' ? 'OPTIMAL' : 'ATTACKS DETECTED',
            isPositive: summary?.active_threat_level === 'LOW'
          }}
        />

        <MetricCard
          title="Quantum Digital Signatures"
          value={summary?.total_signatures ?? 0}
          subtitle={`Across ${summary?.total_sessions ?? 0} EPR Sessions`}
          icon={KeyRound}
          statusColor="cyan"
          formula="Teleportation Bennett-93"
        />

        <MetricCard
          title="Verifications & Integrity"
          value={`${summary?.secure_verifications ?? 0} / ${summary?.total_verifications ?? 0}`}
          subtitle="Valid Quantum Teleportations"
          icon={Activity}
          statusColor="emerald"
          trend={{
            value: `${summary?.threats_detected ?? 0} Blocked Threats`,
            isPositive: (summary?.threats_detected ?? 0) === 0,
            isNeutral: false
          }}
        />

        <MetricCard
          title="Mean TVD Distance"
          value={summary?.average_tvd?.toFixed(4) ?? '0.0210'}
          subtitle="Total Variation Distance"
          icon={Cpu}
          statusColor={summary && summary.average_tvd > 0.15 ? 'rose' : 'cyan'}
          formula="δ(P,Q) < 0.1500 (Threshold)"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification History Line Chart */}
        <div className="lg:col-span-2 rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100 font-mono">
                STATISTICAL TVD TELEMETRY OVER TIME
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Safety Threshold: <span className="text-rose-400 font-bold">0.1500</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary?.verification_timeline || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 0.6]} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="tvd"
                  name="TVD Distance δ"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#06b6d4' }}
                />
                <Line
                  type="monotone"
                  dataKey="qber"
                  name="QBER Error Rate"
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Vector Distribution */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-100 font-mono">
                ATTACK VECTORS
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Classifications</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackData} layout="vertical" margin={{ left: 20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Detected Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Security Audit Log Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-mono">
              RECENT SECURITY EVENTS & TELEMETRY STREAM
            </h3>
          </div>
          <Link
            to="/security-events"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Events</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Attack Classification</th>
                <th className="py-2.5 px-3">Status Verdict</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {summary?.recent_events && summary.recent_events.length > 0 ? (
                summary.recent_events.slice(0, 7).map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-semibold">{evt.event_type}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{evt.session_id || 'N/A'}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          evt.attack_type !== 'NONE'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-900/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {evt.attack_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <VerdictBadge status={evt.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-md truncate">{evt.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No security events recorded yet. Run a signature verification or attack simulation to generate live events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
