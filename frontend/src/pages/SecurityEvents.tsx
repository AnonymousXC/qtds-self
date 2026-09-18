import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Download, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import { VerdictBadge } from '../components/VerdictBadge';

export const SecurityEvents: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [attackFilter, setAttackFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-[var(--brand-primary)]" />
            <h1 className="text-lg font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Security Audit Ledger & Events
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] rounded">
              IMMUTABLE AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Chronological audit records of all quantum key distributions, teleportation signatures, verification attempts, and detected attack events.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-xs font-sans text-[var(--text-secondary)] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] text-xs">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search event ID, session, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded pl-8 pr-3 py-1.5 text-[var(--text-primary)] outline-none focus:border-sky-500 font-sans text-xs"
          />
        </div>

        {/* Severity */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none font-sans text-xs focus:border-sky-500"
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
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none font-sans text-xs focus:border-sky-500"
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
      <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--table-header-bg)] font-medium">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => {
                  const isExpanded = expandedEventId === evt.id;
                  return (
                    <React.Fragment key={evt.id}>
                      <tr
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="hover:bg-[var(--table-hover-bg)] cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-3 text-sky-500 flex items-center gap-1.5 font-medium">
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
                          <span>{evt.id}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[var(--text-muted)]">
                          {new Date(evt.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--text-primary)] font-medium">{evt.event_type}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                              evt.severity === 'CRITICAL'
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : evt.severity === 'HIGH'
                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                : evt.severity === 'MEDIUM'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-[var(--bg-panel-subtle)] text-[var(--text-muted)] border border-[var(--border-panel)]'
                            }`}
                          >
                            {evt.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] border ${
                              evt.attack_type !== 'NONE'
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : 'bg-[var(--bg-panel-subtle)] text-[var(--text-muted)] border border-[var(--border-panel)]'
                            }`}
                          >
                            {evt.attack_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <VerdictBadge status={evt.status} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 text-[var(--text-secondary)] max-w-sm truncate font-sans">{evt.details}</td>
                      </tr>

                      {/* Expanded Payload Row */}
                      {isExpanded && (
                        <tr className="bg-[var(--bg-panel-subtle)] border-b border-[var(--border-panel)]">
                          <td colSpan={7} className="p-4 space-y-2">
                            <div className="text-[11px] font-medium text-[var(--text-muted)] font-sans">Structured Payload Metadata:</div>
                            <pre className="p-3 rounded bg-[var(--bg-panel)] text-sky-500 text-[11px] overflow-x-auto border border-[var(--border-panel)]">
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
                  <td colSpan={7} className="py-8 text-center text-[var(--text-muted)] font-sans">
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
