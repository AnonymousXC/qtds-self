import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Printer, PlusCircle, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { AIReport } from '../types';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              SECURITY AUDIT & INCIDENT REPORTS
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
              FORMAL AUDIT ARTIFACTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured quantum security reports integrating deterministic mathematical metrics, circuit execution parameters, and AI briefings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateFromLatest}
            disabled={generateReportMutation.isPending}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-semibold shadow-md transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Generate New Report</span>
          </button>
          {activeReport && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Report List on Left, Printable Document Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report History (4 cols) */}
        <div className="lg:col-span-4 rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="text-slate-400 font-semibold uppercase tracking-wider pb-2 border-b border-slate-800">
            Generated Reports ({reports?.length || 0})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {reports && reports.length > 0 ? (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3 rounded border cursor-pointer transition-colors space-y-1 ${
                    selectedReportId === rep.id
                      ? 'bg-slate-800 border-cyan-500/60 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-400">{rep.id}</span>
                    <VerdictBadge status={rep.verdict} size="sm" />
                  </div>
                  <div className="text-slate-200 font-medium truncate">{rep.title}</div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(rep.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500">
                No reports generated yet. Click "Generate New Report".
              </div>
            )}
          </div>
        </div>

        {/* Right: Printable Audit Report Document (8 cols) */}
        <div className="lg:col-span-8">
          {activeReport ? (
            <div id="printable-report" className="rounded-lg bg-slate-900 border border-slate-800 p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
              {/* Report Header */}
              <div className="border-b border-slate-700 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-slate-100 font-mono tracking-wide">
                    QUANTUM SECURITY AUDIT REPORT
                  </div>
                  <VerdictBadge status={activeReport.verdict} size="md" />
                </div>
                <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px]">
                  <span>Report ID: <strong className="text-cyan-400">{activeReport.id}</strong></span>
                  <span>Session: <strong className="text-slate-200">{activeReport.session_id}</strong></span>
                  <span>Timestamp: <strong className="text-slate-200">{new Date(activeReport.created_at).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider text-cyan-400">
                  1. Executive Briefing & Incident Analysis
                </div>
                <div className="p-4 rounded bg-slate-950 border border-slate-800 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeReport.summary}
                </div>
              </div>

              {/* Statistical Metrics Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider text-cyan-400">
                  2. Deterministic Quantum Measurement Proofs
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TOTAL VARIATION DISTANCE</span>
                    <span className="text-base font-bold text-cyan-300">
                      {activeReport.statistical_breakdown.total_variation_distance?.toFixed(4) || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">QUANTUM BIT ERROR (QBER)</span>
                    <span className="text-base font-bold text-rose-400">
                      {(activeReport.statistical_breakdown.qber * 100)?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">STATE FIDELITY</span>
                    <span className="text-base font-bold text-emerald-400">
                      {activeReport.statistical_breakdown.fidelity?.toFixed(4) || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">CHI-SQUARE P-VALUE</span>
                    <span className="text-base font-bold text-slate-200">
                      {activeReport.statistical_breakdown.chi_square_p_value?.toFixed(4) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider text-cyan-400">
                  3. Recommended Mitigation Actions
                </div>
                <ul className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1.5 list-disc list-inside text-slate-300">
                  {activeReport.recommendations?.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Compliance & Signature Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                <span>Verified by QTDS Deterministic Security Engine (Zero-ML Architecture)</span>
                <span>System Backend: Qiskit Aer Simulation</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-12 text-center text-slate-500 font-mono">
              Select or generate a report to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
