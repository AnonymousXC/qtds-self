import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Bot, Send, Sparkles, ShieldCheck, HelpCircle, Layers, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { AICopilotResponse } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';

export const Copilot: React.FC = () => {
  const [searchParams] = useSearchParams();
  const verificationIdParam = searchParams.get('verification_id') || '';

  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedVerifId, setSelectedVerifId] = useState<string>(verificationIdParam);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; data: any }>>([]);

  // Fetch recent verifications for context selection
  const { data: verifications } = useQuery({
    queryKey: ['verificationsHistory'],
    queryFn: () => api.listVerifications(10)
  });

  React.useEffect(() => {
    if (verifications && verifications.length > 0 && !selectedVerifId) {
      setSelectedVerifId(verifications[0].id);
    }
  }, [verifications, selectedVerifId]);

  const activeVerif = verifications?.find((v) => v.id === selectedVerifId);

  const copilotMutation = useMutation({
    mutationFn: api.explainWithCopilot,
    onSuccess: (resp) => {
      setConversation((prev) => [
        ...prev,
        { role: 'user', data: { query: resp.query } },
        { role: 'assistant', data: resp }
      ]);
      setUserQuery('');
    }
  });

  const handleSend = (text?: string) => {
    const queryToSend = text || userQuery;
    if (!queryToSend.trim()) return;

    copilotMutation.mutate({
      verification_id: selectedVerifId || undefined,
      user_query: queryToSend,
      context_data: activeVerif
        ? {
            status: activeVerif.status,
            attack_type: activeVerif.attack_type,
            evidence: activeVerif.evidence,
            statistical_metrics: activeVerif.statistical_metrics,
            threshold_applied: activeVerif.threshold_applied
          }
        : undefined
    });
  };

  const promptChips = [
    'Why was this session classified under this verdict?',
    'Show the mathematical and statistical distance proof.',
    'Explain how Pauli feedforward corrections preserved the state.',
    'What does the measured QBER indicate about the quantum channel?',
    'What investigation steps and mitigations do you recommend?'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              AI QUANTUM SECURITY COPILOT
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-800/60 rounded">
              AUXILIARY REASONING ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Provider-agnostic conversational assistant that explains deterministic quantum detection outputs, statistics, and physics principles.
          </p>
        </div>

        {/* Active Context Chip */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">CONTEXT:</span>
          <select
            value={selectedVerifId}
            onChange={(e) => setSelectedVerifId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 outline-none focus:border-cyan-500"
          >
            {verifications?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} [{v.status} - {v.attack_type}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Structured Context Inspector Card */}
      {activeVerif && (
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>DETERMINISTIC CONTEXT SUPPLIED TO COPILOT</span>
            </span>
            <VerdictBadge status={activeVerif.status} size="sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">TVD Distance:</span>
              <span className="text-cyan-400 font-bold">{activeVerif.statistical_metrics.total_variation_distance.toFixed(4)}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">QBER Error:</span>
              <span className="text-rose-400 font-bold">{(activeVerif.statistical_metrics.qber * 100).toFixed(1)}%</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">State Fidelity:</span>
              <span className="text-emerald-400 font-bold">{activeVerif.statistical_metrics.fidelity.toFixed(4)}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Attack Type:</span>
              <span className="text-indigo-300 font-bold">{activeVerif.attack_type}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-slate-500">QUICK INVESTIGATION PROMPTS:</div>
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800/60 text-xs font-mono text-slate-300 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread Area */}
      <div className="space-y-4">
        {conversation.length === 0 ? (
          <div className="p-8 rounded-lg bg-slate-900/60 border border-slate-800 text-center space-y-3 font-mono">
            <Bot className="w-10 h-10 text-cyan-400 mx-auto opacity-75" />
            <div className="text-sm font-semibold text-slate-200">Quantum Security Copilot Ready</div>
            <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans">
              Ask any question about quantum teleportation signatures, Bell state entanglement, or the mathematical proofs behind threat classifications.
            </p>
          </div>
        ) : (
          conversation.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-xl p-3.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-100 font-mono text-xs">
                    {msg.data.query}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl p-5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-4">
                  {/* Confidence Note Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{msg.data.confidence_note}</span>
                    </span>
                    <VerdictBadge status={msg.data.verdict} size="sm" />
                  </div>

                  {/* Markdown Explanation Body */}
                  <div className="font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                    {msg.data.explanation}
                  </div>

                  {/* Quantum Principles & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-[11px]">
                    <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-cyan-400 font-semibold">Quantum Physical Foundations:</div>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                        {msg.data.quantum_principles?.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-emerald-400 font-semibold">Recommended Actions:</div>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                        {msg.data.recommended_actions?.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs"
      >
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask Copilot about this quantum verification or attack..."
          className="flex-1 bg-transparent px-3 py-2 text-slate-200 outline-none"
        />
        <button
          type="submit"
          disabled={copilotMutation.isPending || !userQuery.trim()}
          className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-1.5"
        >
          {copilotMutation.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
