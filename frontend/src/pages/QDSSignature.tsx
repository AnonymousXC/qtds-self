import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Send, CheckCircle2, Layers, PlusCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Signature } from '../types';

export const QDSSignature: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>(
    'Financial Authorization Token: Transfer 50,000 credits to Bob (TxID: 0x99A41)'
  );
  const [createdSignature, setCreatedSignature] = useState<Signature | null>(null);

  // New Session Modal states
  const [senderName, setSenderName] = useState<string>('Alice');
  const [receiverName, setReceiverName] = useState<string>('Bob');
  const [keyLength, setKeyLength] = useState<number>(6);
  const [bellState, setBellState] = useState<string>('PHI_PLUS');

  // Fetch all sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['qdsSessions'],
    queryFn: () => api.listSessions(20)
  });

  // Set default session if available
  React.useEffect(() => {
    if (sessions && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  // Create Session Mutation
  const createSessionMutation = useMutation({
    mutationFn: api.createSession,
    onSuccess: (newSess) => {
      queryClient.invalidateQueries({ queryKey: ['qdsSessions'] });
      setSelectedSessionId(newSess.id);
    }
  });

  // Generate Signature Mutation
  const generateSigMutation = useMutation({
    mutationFn: api.generateSignature,
    onSuccess: (sig) => {
      setCreatedSignature(sig);
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });

  const activeSession = sessions?.find((s) => s.id === selectedSessionId);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !messageText.trim()) return;
    generateSigMutation.mutate({
      session_id: selectedSessionId,
      message: messageText,
      signer_id: activeSession?.sender || 'Alice'
    });
  };

  const handleCreateNewSession = () => {
    createSessionMutation.mutate({
      sender: senderName,
      receiver: receiverName,
      bell_state: bellState,
      key_length: keyLength
    });
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-[var(--brand-primary)]" />
            <h1 className="text-lg font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Quantum Digital Signature Generation
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] rounded">
              SIGNER WORKSPACE (ALICE)
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Generate information-theoretically secure digital signatures using teleportation-based quantum public key distribution.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Session Configuration & Key Distribution */}
        <div className="space-y-5">
          {/* Active Session Card */}
          <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] font-mono uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>QDS Session Keypair</span>
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-secondary)] font-sans block mb-1">Select QDS Channel</label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] font-mono text-xs"
                >
                  {sessions?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} ({s.sender} → {s.receiver}) [{s.key_length} tokens]
                    </option>
                  ))}
                </select>
              </div>

              {activeSession && (
                <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] font-sans">Sender / Signer:</span>
                    <span className="text-sky-500 font-semibold">{activeSession.sender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] font-sans">Receiver / Verifier:</span>
                    <span className="text-[var(--text-primary)] font-semibold">{activeSession.receiver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] font-sans">Bell State:</span>
                    <span className="text-indigo-500">{activeSession.bell_state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] font-sans">Session Nonce:</span>
                    <span className="text-[var(--text-secondary)] truncate max-w-[150px]">{activeSession.session_nonce}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Alice Quantum Key Tokens Display */}
            {activeSession && activeSession.key_tokens && (
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <div className="text-xs font-sans text-[var(--text-secondary)] font-medium flex justify-between">
                  <span>Quantum Key States</span>
                  <span className="text-sky-500 font-mono text-[11px]">{activeSession.key_tokens.length} States</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {activeSession.key_tokens.map((token: any) => (
                    <div
                      key={token.index}
                      className="p-2 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-center space-y-0.5"
                    >
                      <div className="text-sky-500 font-bold text-sm">|{token.state}⟩</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{token.basis}-Basis</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Session Form */}
          <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>Initialize New Channel</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[var(--text-secondary)] font-sans block mb-1">Sender</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none font-mono text-xs focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[var(--text-secondary)] font-sans block mb-1">Receiver</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] outline-none font-mono text-xs focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[var(--text-secondary)] font-sans mb-1">
                  <span>Key Sequence Length</span>
                  <span className="font-mono text-sky-500 font-semibold">{keyLength} tokens</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={keyLength}
                  onChange={(e) => setKeyLength(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <button
                onClick={handleCreateNewSession}
                disabled={createSessionMutation.isPending}
                className="w-full py-2 rounded bg-[var(--bg-panel-elevated)] hover:bg-[var(--border-panel)] border border-[var(--border-panel)] text-[var(--text-primary)] font-sans font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {createSessionMutation.isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{createSessionMutation.isPending ? 'Generating EPR Pairs...' : 'Generate New Key Channel'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Message Signer & Output Teleportation Signature */}
        <div className="lg:col-span-2 space-y-5">
          {/* Sign Message Input Card */}
          <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-500" />
              <span>Compose & Sign Transaction Message</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="text-[var(--text-secondary)] font-sans block mb-1.5">Message Content to Sign</label>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Enter message text, transaction payload, or cryptographic hash..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none font-sans text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-[var(--text-muted)] font-sans">
                  Signing with Alice's private Pauli eigenstates & Bell state teleportation.
                </div>
                <button
                  type="submit"
                  disabled={generateSigMutation.isPending || !selectedSessionId}
                  className="px-4 py-2 rounded bg-[var(--brand-primary)] hover:opacity-90 text-white font-sans text-xs font-medium transition-opacity shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {generateSigMutation.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                  <span>{generateSigMutation.isPending ? 'Teleporting...' : 'Generate Quantum Signature'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Generated Signature Output */}
          {createdSignature && (
            <div className="rounded-md bg-[var(--bg-panel)] border border-emerald-500/30 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
                    Quantum Signature Issued ({createdSignature.id})
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
                  READY FOR VERIFICATION
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[var(--text-muted)] font-sans block mb-1">SHA-256 Message Digest:</span>
                  <div className="p-2.5 rounded bg-[var(--code-bg)] border border-[var(--border-panel)] text-sky-500 break-all text-[11px]">
                    {createdSignature.message_digest}
                  </div>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] font-sans block mb-1.5">Teleported Quantum Signature Tokens:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {createdSignature.signature_tokens.map((tok) => (
                      <div
                        key={tok.token_index}
                        className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1 text-[11px]"
                      >
                        <div className="flex justify-between text-[var(--text-secondary)]">
                          <span>Token #{tok.token_index}</span>
                          <span className="text-sky-500 font-semibold">Bit: {tok.message_bit}</span>
                        </div>
                        <div className="text-[var(--text-primary)]">
                          State: <strong className="text-emerald-500">|{tok.quantum_state}⟩</strong> ({tok.measurement_basis})
                        </div>
                        <div className="text-[9px] text-[var(--text-muted)] truncate">{tok.teleportation_channel_id}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/verification?session_id=${createdSignature.session_id}&signature_id=${createdSignature.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-medium transition-colors shadow-xs"
                  >
                    <span>Proceed to Verification (Bob)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
