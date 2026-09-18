import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Printer, PlusCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { VerdictBadge } from '../components/VerdictBadge';

export const Reports: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('Quantum Threat Incident Audit Report');

  const { data: reports, isLoading } = useQuery({
    queryKey: ['securityReports'],
    queryFn: api.listReports
  });

  const { data: verifications } = useQuery({
    queryKey: ['verificationsHistory'],
    queryFn: () => api.listVerifications(10)
  });

  React.useEffect(() => {
    if (reports && reports.length > 0 && !selectedReportId) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);

  const activeReport = reports?.find((r) => r.id === selectedReportId);

  const generateReportMutation = useMutation({
    mutationFn: api.generateReport,
    onSuccess: (newRep) => {
      queryClient.invalidateQueries({ queryKey: ['securityReports'] });
      setSelectedReportId(newRep.id);
    }
  });

  const handleGenerateFromLatest = () => {
    const latestVerif = verifications && verifications.length > 0 ? verifications[0] : null;
    generateReportMutation.mutate({
      verification_id: latestVerif ? latestVerif.id : undefined,
      title: reportTitle
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Security Audit & Incident Reports
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded">
              FORMAL AUDIT ARTIFACTS
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Structured quantum security reports integrating deterministic mathematical metrics, circuit execution parameters, and AI briefings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerateFromLatest}
            disabled={generateReportMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-medium shadow-xs transition-colors disabled:opacity-50"
          >
            {generateReportMutation.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>Generate New Report</span>
          </button>
          {activeReport && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-xs font-sans text-[var(--text-secondary)] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Report List on Left, Document Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report History (4 cols) */}
        <div className="lg:col-span-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-4 space-y-3 text-xs">
          <div className="text-[var(--text-muted)] font-sans font-medium uppercase tracking-wider text-[11px] pb-2 border-b border-[var(--border-subtle)]">
            Generated Reports ({reports?.length || 0})
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {reports && reports.length > 0 ? (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3 rounded border cursor-pointer transition-colors space-y-1 ${
                    selectedReportId === rep.id
                      ? 'bg-[var(--bg-panel-elevated)] border-sky-500/50 text-[var(--text-primary)]'
                      : 'bg-[var(--bg-panel-subtle)] border-[var(--border-panel)] hover:bg-[var(--bg-panel-elevated)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold font-mono text-sky-500 text-xs">{rep.id}</span>
                    <VerdictBadge status={rep.verdict} size="sm" />
                  </div>
                  <div className="text-[var(--text-primary)] font-medium font-sans truncate">{rep.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">
                    {new Date(rep.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[var(--text-muted)] font-sans">
                No reports generated yet. Click "Generate New Report".
              </div>
            )}
          </div>
        </div>

        {/* Right: Printable Audit Report Document (8 cols) */}
        <div className="lg:col-span-8">
          {activeReport ? (
            <div id="printable-report" className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-7 space-y-6 text-xs text-[var(--text-secondary)]">
              {/* Report Header */}
              <div className="border-b border-[var(--border-subtle)] pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-[var(--text-primary)] font-sans tracking-wide">
                    Quantum Security Audit Report
                  </div>
                  <VerdictBadge status={activeReport.verdict} size="md" />
                </div>
                <div className="flex flex-wrap items-center justify-between text-[var(--text-muted)] text-[11px] font-mono">
                  <span>Report ID: <strong className="text-sky-500">{activeReport.id}</strong></span>
                  <span>Session: <strong className="text-[var(--text-primary)]">{activeReport.session_id}</strong></span>
                  <span>Timestamp: <strong className="text-[var(--text-primary)]">{new Date(activeReport.created_at).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono text-sky-500">
                  1. Executive Briefing & Incident Analysis
                </div>
                <div className="p-4 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] font-sans text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                  {activeReport.summary}
                </div>
              </div>

              {/* Statistical Metrics Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono text-sky-500">
                  2. Deterministic Quantum Measurement Proofs
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
                    <span className="text-[var(--text-muted)] text-[10px] font-sans block">TOTAL VARIATION DISTANCE</span>
                    <span className="text-base font-bold text-sky-500">
                      {activeReport.statistical_breakdown.total_variation_distance?.toFixed(4) || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
                    <span className="text-[var(--text-muted)] text-[10px] font-sans block">QUANTUM BIT ERROR</span>
                    <span className="text-base font-bold text-rose-500">
                      {(activeReport.statistical_breakdown.qber * 100)?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
                    <span className="text-[var(--text-muted)] text-[10px] font-sans block">STATE FIDELITY</span>
                    <span className="text-base font-bold text-emerald-500">
                      {activeReport.statistical_breakdown.fidelity?.toFixed(4) || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
                    <span className="text-[var(--text-muted)] text-[10px] font-sans block">CHI-SQUARE P-VALUE</span>
                    <span className="text-base font-bold text-[var(--text-primary)]">
                      {activeReport.statistical_breakdown.chi_square_p_value?.toFixed(4) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono text-sky-500">
                  3. Recommended Mitigation Actions
                </div>
                <ul className="p-4 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1.5 list-disc list-inside text-[var(--text-secondary)] font-sans">
                  {activeReport.recommendations?.map((rec, i) => (
                    <li key={i} className="leading-relaxed">{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Compliance & Signature Footer */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between items-center text-[10px] text-[var(--text-muted)] font-mono">
                <span>Verified by QTDS Deterministic Security Engine (Zero-ML Architecture)</span>
                <span>System Backend: Qiskit Aer Simulator</span>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-12 text-center text-[var(--text-muted)] font-sans">
              Select or generate a report to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
