import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Send, CheckCircle2, ShieldCheck, Hash, Layers, FileCode, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import { QDSSession, Signature } from '../types';

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              QUANTUM DIGITAL SIGNATURE GENERATION
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
              ALICE (SIGNER WORKSPACE)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate information-theoretically secure digital signatures using teleportation-based quantum public key distribution.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Session Configuration & Key Distribution */}
        <div className="space-y-6">
          {/* Active Session Card */}
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>QDS SESSION KEYPAIR</span>
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select QDS Session</label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none focus:border-cyan-500"
                >
                  {sessions?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} ({s.sender} → {s.receiver}) [{s.key_length} tokens]
                    </option>
                  ))}
                </select>
              </div>

              {activeSession && (
                <div className="p-3 rounded bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sender / Signer:</span>
                    <span className="text-cyan-400 font-semibold">{activeSession.sender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Receiver / Verifier:</span>
                    <span className="text-slate-300 font-semibold">{activeSession.receiver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bell State:</span>
                    <span className="text-indigo-300">{activeSession.bell_state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nonce:</span>
                    <span className="text-slate-400 truncate max-w-[150px]">{activeSession.session_nonce}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Alice Quantum Key Tokens Display */}
            {activeSession && activeSession.key_tokens && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-400 font-semibold flex justify-between">
                  <span>Quantum Key States</span>
                  <span className="text-cyan-400">{activeSession.key_tokens.length} States</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {activeSession.key_tokens.map((token: any) => (
                    <div
                      key={token.index}
                      className="p-2 rounded bg-slate-950 border border-slate-800 text-center space-y-0.5"
                    >
                      <div className="text-cyan-300 font-bold text-sm">|{token.state}⟩</div>
                      <div className="text-[10px] text-slate-500">{token.basis}-Basis</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Session Form */}
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>INITIALIZE NEW QDS CHANNEL</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">Sender</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Receiver</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Key Sequence Length: {keyLength}</label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={keyLength}
                  onChange={(e) => setKeyLength(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <button
                onClick={handleCreateNewSession}
                disabled={createSessionMutation.isPending}
                className="w-full py-2 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold transition-colors"
              >
                {createSessionMutation.isPending ? 'Generating EPR Pairs...' : 'Generate New Quantum Keypair'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Message Signer & Output Teleportation Signature */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sign Message Input Card */}
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>COMPOSE & SIGN TRANSACTION MESSAGE</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1.5">Message Content to Sign</label>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Enter message text, transaction payload, or cryptographic hash..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-200 focus:border-cyan-500 outline-none font-sans text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500">
                  Signing with Alice's private Pauli eigenstates & Bell state teleportation.
                </div>
                <button
                  type="submit"
                  disabled={generateSigMutation.isPending || !selectedSessionId}
                  className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {generateSigMutation.isPending ? 'Teleporting Signature...' : 'Generate Quantum Signature'}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Signature Output */}
          {createdSignature && (
            <div className="rounded-lg bg-slate-900 border border-emerald-800/60 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-100 font-mono">
                    QUANTUM SIGNATURE ISSUED ({createdSignature.id})
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded">
                  READY FOR VERIFICATION
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">SHA-256 Message Digest:</span>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 break-all text-[11px]">
                    {createdSignature.message_digest}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1.5">Teleported Quantum Signature Tokens:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {createdSignature.signature_tokens.map((tok) => (
                      <div
                        key={tok.token_index}
                        className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-[11px]"
                      >
                        <div className="flex justify-between text-slate-400">
                          <span>Token #{tok.token_index}</span>
                          <span className="text-cyan-400 font-bold">Bit: {tok.message_bit}</span>
                        </div>
                        <div className="text-slate-200">
                          State: <strong className="text-emerald-400">|{tok.quantum_state}⟩</strong> ({tok.measurement_basis})
                        </div>
                        <div className="text-[9px] text-slate-500 truncate">{tok.teleportation_channel_id}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/verification?session_id=${createdSignature.session_id}&signature_id=${createdSignature.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                  >
                    <span>Proceed to Verification Center (Bob)</span>
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
