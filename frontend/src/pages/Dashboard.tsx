import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Activity,
  KeyRound,
  Cpu,
  Flame,
  ArrowUpRight,
  TrendingUp,
  History,
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
import { useTheme } from '../context/ThemeContext';

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: api.getDashboardSummary,
    refetchInterval: 5000
  });

  const attackData = summary
    ? Object.entries(summary.attack_distribution).map(([key, value]) => ({
        name: key.replace('_', ' '),
        count: value
      }))
    : [];

  return (
    <div className="space-y-7">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Security Operations Center
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time deterministic quantum threat detection and teleportation-based digital signature telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/demo"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-medium transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge Demo Mode</span>
          </Link>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-xs font-sans text-[var(--text-secondary)] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards - Compact & Visually Focused */}
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
          formula="Bennett-93 EPR"
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
          formula="δ < 0.1500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification History Line Chart */}
        <div className="lg:col-span-2 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
                Statistical TVD Telemetry Over Time
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Safety Threshold: <span className="text-rose-500 font-semibold">0.1500</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary?.verification_timeline || []} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
                <XAxis dataKey="time" stroke={isLight ? '#64748B' : '#64748B'} fontSize={11} tickLine={false} />
                <YAxis stroke={isLight ? '#64748B' : '#64748B'} domain={[0, 0.6]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0E131A',
                    borderColor: isLight ? '#D0D7DE' : '#2A394E',
                    color: isLight ? '#1B222C' : '#F1F5F9',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="tvd"
                  name="TVD Distance δ"
                  stroke="#0284C7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0284C7' }}
                />
                <Line
                  type="monotone"
                  dataKey="qber"
                  name="QBER Error Rate"
                  stroke="#EF4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 2, fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Vector Distribution */}
        <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
                Attack Vectors
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Classifications</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackData} layout="vertical" margin={{ left: 10, right: 15, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke={isLight ? '#E2E8F0' : '#1E293B'} horizontal={false} />
                <XAxis type="number" stroke={isLight ? '#64748B' : '#64748B'} fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke={isLight ? '#475569' : '#94A3B8'} fontSize={10} width={95} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0E131A',
                    borderColor: isLight ? '#D0D7DE' : '#2A394E',
                    color: isLight ? '#1B222C' : '#F1F5F9',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 2, 2, 0]} name="Detected Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Security Audit Log Table - Clean Flat Design */}
      <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-500" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Recent Security Events & Telemetry Stream
            </h3>
          </div>
          <Link
            to="/security-events"
            className="text-xs font-sans text-sky-500 hover:text-sky-600 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All Events</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--table-header-bg)]">
                <th className="py-2.5 px-3 font-medium">Timestamp</th>
                <th className="py-2.5 px-3 font-medium">Event Type</th>
                <th className="py-2.5 px-3 font-medium">Session</th>
                <th className="py-2.5 px-3 font-medium">Classification</th>
                <th className="py-2.5 px-3 font-medium">Verdict</th>
                <th className="py-2.5 px-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {summary?.recent_events && summary.recent_events.length > 0 ? (
                summary.recent_events.slice(0, 7).map((evt) => (
                  <tr key={evt.id} className="hover:bg-[var(--table-hover-bg)] transition-colors">
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-primary)] font-medium">{evt.event_type}</td>
                    <td className="py-2.5 px-3 text-sky-500">{evt.session_id || 'N/A'}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          evt.attack_type !== 'NONE'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : 'bg-[var(--bg-panel-subtle)] text-[var(--text-muted)] border border-[var(--border-panel)]'
                        }`}
                      >
                        {evt.attack_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <VerdictBadge status={evt.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)] max-w-md truncate font-sans">{evt.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[var(--text-muted)] font-sans">
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
