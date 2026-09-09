import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Filter, Download, Search, AlertOctagon, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import { SecurityEvent } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';

export const SecurityEvents: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [attackFilter, setAttackFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['securityEvents', severityFilter, attackFilter],
    queryFn: () =>
      api.listSecurityEvents({
        limit: 100,
        severity: severityFilter || undefined,
        attack_type: attackFilter || undefined
      }),
    refetchInterval: 5000
  });

  const filteredEvents = events?.filter((evt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      evt.id.toLowerCase().includes(q) ||
      evt.event_type.toLowerCase().includes(q) ||
      evt.details.toLowerCase().includes(q) ||
      (evt.session_id && evt.session_id.toLowerCase().includes(q))
    );
  });

  const handleExportJSON = () => {
    if (!filteredEvents) return;
    const blob = new Blob([JSON.stringify(filteredEvents, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qtds_security_events_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              SECURITY AUDIT LEDGER & EVENTS
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
              IMMUTABLE AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological audit records of all quantum key distributions, teleportation signatures, verification attempts, and detected attack events.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search event ID, session, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="INFO">INFO</option>
          </select>
        </div>

        {/* Attack Type */}
        <div>
          <select
            value={attackFilter}
            onChange={(e) => setAttackFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none"
          >
            <option value="">All Attack Types</option>
            <option value="NONE">Legitimate (NONE)</option>
            <option value="SIGNATURE_FORGERY">Signature Forgery</option>
            <option value="IMPERSONATION">Impersonation</option>
            <option value="REPLAY_ATTACK">Replay Attack</option>
            <option value="CHANNEL_TAMPERING">Channel Tampering</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Attack Vector</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => {
                  const isExpanded = expandedEventId === evt.id;
                  return (
                    <React.Fragment key={evt.id}>
                      <tr
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-cyan-400 flex items-center gap-1.5 font-semibold">
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          <span>{evt.id}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(evt.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-200 font-semibold">{evt.event_type}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evt.severity === 'CRITICAL'
                                ? 'bg-rose-950 text-rose-400 border border-rose-900'
                                : evt.severity === 'HIGH'
                                ? 'bg-orange-950 text-orange-400 border border-orange-900'
                                : evt.severity === 'MEDIUM'
                                ? 'bg-amber-950 text-amber-400 border border-amber-900'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {evt.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4">
                          <VerdictBadge status={evt.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-sm truncate">{evt.details}</td>
                      </tr>

                      {/* Expanded Payload Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-b border-slate-800">
                          <td colSpan={7} className="p-4 space-y-2">
                            <div className="text-[11px] font-semibold text-slate-400">Structured Payload Metadata:</div>
                            <pre className="p-3 rounded bg-slate-900 text-cyan-300 text-[11px] overflow-x-auto border border-slate-800">
                              {JSON.stringify(evt.metadata_payload, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No security events matching filter criteria.
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
