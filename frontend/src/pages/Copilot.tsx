import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Bot, Send, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-[var(--brand-primary)]" />
            <h1 className="text-lg font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Quantum Security Copilot
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] rounded">
              AUXILIARY REASONING ENGINE
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Provider-agnostic conversational assistant that explains deterministic quantum detection outputs, statistics, and physics principles.
          </p>
        </div>

        {/* Active Context Chip */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-muted)] font-sans font-medium">Context:</span>
          <select
            value={selectedVerifId}
            onChange={(e) => setSelectedVerifId(e.target.value)}
            className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] font-mono text-xs"
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
        <div className="p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-primary)] font-medium font-sans flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Deterministic Context Supplied to Copilot</span>
            </span>
            <VerdictBadge status={activeVerif.status} size="sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
            <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <span className="text-[var(--text-muted)] font-sans block text-[10px]">TVD Distance:</span>
              <span className="text-[var(--brand-primary)] font-semibold">{activeVerif.statistical_metrics.total_variation_distance.toFixed(4)}</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <span className="text-[var(--text-muted)] font-sans block text-[10px]">QBER Error:</span>
              <span className="text-rose-500 font-semibold">{(activeVerif.statistical_metrics.qber * 100).toFixed(1)}%</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <span className="text-[var(--text-muted)] font-sans block text-[10px]">State Fidelity:</span>
              <span className="text-[#4FAF9A] font-semibold">{activeVerif.statistical_metrics.fidelity.toFixed(4)}</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <span className="text-[var(--text-muted)] font-sans block text-[10px]">Classification:</span>
              <span className="text-[var(--text-secondary)] font-semibold">{activeVerif.attack_type}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-sans font-medium text-[var(--text-muted)] uppercase tracking-wider">Quick Investigation Prompts</div>
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1 rounded bg-[var(--bg-panel-subtle)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-sans cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread Area */}
      <div className="space-y-4">
        {conversation.length === 0 ? (
          <div className="p-8 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] text-center space-y-3">
            <Bot className="w-7 h-7 text-[var(--text-muted)] mx-auto opacity-75" />
            <div className="text-sm font-semibold text-[var(--text-primary)] font-sans">Quantum Security Copilot Ready</div>
            <p className="text-xs text-[var(--text-muted)] max-w-lg mx-auto font-sans leading-relaxed">
              Ask any question about quantum teleportation signatures, Bell state entanglement, or the mathematical proofs behind threat classifications.
            </p>
          </div>
        ) : (
          conversation.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-xl p-3 rounded-md bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-[var(--text-primary)] font-sans text-xs leading-relaxed">
                    {msg.data.query}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl p-5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] space-y-4">
                  {/* Confidence Note Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] text-[11px]">
                    <span className="text-[var(--brand-primary)] font-medium flex items-center gap-1.5 font-sans">
                      <Bot className="w-3.5 h-3.5" />
                      <span>{msg.data.confidence_note}</span>
                    </span>
                    <VerdictBadge status={msg.data.verdict} size="sm" />
                  </div>

                  {/* Explanation Body */}
                  <div className="font-sans text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line space-y-2">
                    {msg.data.explanation}
                  </div>

                  {/* Quantum Principles & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-sans">
                    <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                      <div className="text-[var(--brand-primary)] font-medium">Quantum Physical Foundations:</div>
                      <ul className="list-disc list-inside text-[var(--text-muted)] space-y-0.5">
                        {msg.data.quantum_principles?.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
                      <div className="text-[#4FAF9A] font-medium">Recommended Actions:</div>
                      <ul className="list-disc list-inside text-[var(--text-muted)] space-y-0.5">
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
        className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] text-xs"
      >
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask Copilot about this quantum verification or attack mechanism..."
          className="flex-1 bg-transparent px-3 py-2 text-[var(--text-primary)] outline-none font-sans text-xs"
        />
        <button
          type="submit"
          disabled={copilotMutation.isPending || !userQuery.trim()}
          className="px-3.5 py-2 rounded bg-[var(--brand-primary)] hover:opacity-90 text-white font-sans font-medium transition-opacity flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {copilotMutation.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
