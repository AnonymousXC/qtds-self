import React, { useState } from 'react';
import { Cpu, Layers, Info, Terminal } from 'lucide-react';

interface QuantumCircuitVisualizerProps {
  inputState?: string;
  measurementBasis?: string;
  bellState?: string;
  depth?: number;
  totalGates?: number;
  backendName?: string;
  qasmDiagram?: string;
  attackType?: string;
  attackSeverity?: number;
}

export const QuantumCircuitVisualizer: React.FC<QuantumCircuitVisualizerProps> = ({
  inputState = '+',
  measurementBasis = 'X',
  bellState = 'PHI_PLUS',
  depth = 6,
  totalGates = 11,
  backendName = 'Local Qiskit Aer',
  qasmDiagram,
  attackType = 'NONE',
  attackSeverity = 0
}) => {
  const [viewMode, setViewMode] = useState<'svg' | 'ascii'>('svg');

  return (
    <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4">
      {/* Circuit Header & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-mono">
            QUANTUM TELEPORTATION CIRCUIT
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            <span className="text-slate-500">QUBITS:</span>
            <span className="text-cyan-400 font-semibold">3</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            <span className="text-slate-500">DEPTH:</span>
            <span className="text-slate-200 font-semibold">{depth}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            <span className="text-slate-500">GATES:</span>
            <span className="text-slate-200 font-semibold">{totalGates}</span>
          </div>

          <div className="flex items-center rounded bg-slate-950 border border-slate-800 p-0.5">
            <button
              onClick={() => setViewMode('svg')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                viewMode === 'svg' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                viewMode === 'ascii' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              QASM/ASCII
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'svg' ? (
        /* High Fidelity SVG Quantum Circuit */
        <div className="overflow-x-auto py-4 px-2 bg-slate-950/90 rounded-md border border-slate-800/80">
          <svg viewBox="0 0 920 230" className="w-full min-w-[800px] h-auto font-mono text-xs select-none">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Qubit Wire 0 (Alice Input) */}
            <text x="20" y="45" fill="#94a3b8" fontWeight="600">q[0] (Alice)</text>
            <line x1="120" y1="40" x2="880" y2="40" stroke="#334155" strokeWidth="2" />

            {/* Qubit Wire 1 (Alice EPR) */}
            <text x="20" y="105" fill="#94a3b8" fontWeight="600">q[1] (EPR-A)</text>
            <line x1="120" y1="100" x2="880" y2="100" stroke="#334155" strokeWidth="2" />

            {/* Qubit Wire 2 (Bob EPR / Receiver) */}
            <text x="20" y="165" fill="#94a3b8" fontWeight="600">q[2] (Bob-Recv)</text>
            <line x1="120" y1="160" x2="880" y2="160" stroke="#334155" strokeWidth="2" />

            {/* Classical Register Wire */}
            <text x="20" y="210" fill="#64748b" fontWeight="600">c (Classical)</text>
            <line x1="120" y1="205" x2="880" y2="205" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="120" y1="208" x2="880" y2="208" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Stage 1: State Preparation on q[0] */}
            <rect x="140" y="22" width="40" height="36" rx="4" fill="#083344" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="160" y="45" fill="#67e8f9" textAnchor="middle" fontWeight="bold">|{inputState}⟩</text>

            {/* Stage 2: Bell Pair Entanglement on q[1] and q[2] */}
            <rect x="195" y="82" width="34" height="36" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <text x="212" y="105" fill="#a5b4fc" textAnchor="middle" fontWeight="bold">H</text>

            {/* CNOT Control (q1) to Target (q2) */}
            <circle cx="260" cy="100" r="5" fill="#6366f1" />
            <line x1="260" y1="100" x2="260" y2="160" stroke="#6366f1" strokeWidth="2" />
            <circle cx="260" cy="160" r="10" fill="#0b0f19" stroke="#6366f1" strokeWidth="2" />
            <line x1="260" y1="153" x2="260" y2="167" stroke="#6366f1" strokeWidth="2" />
            <line x1="253" y1="160" x2="267" y2="160" stroke="#6366f1" strokeWidth="2" />

            {/* Stage 3: Alice Bell Measurement on q[0] and q[1] */}
            {/* CNOT (q0 -> q1) */}
            <circle cx="320" cy="40" r="5" fill="#0ea5e9" />
            <line x1="320" y1="40" x2="320" y2="100" stroke="#0ea5e9" strokeWidth="2" />
            <circle cx="320" cy="100" r="10" fill="#0b0f19" stroke="#0ea5e9" strokeWidth="2" />
            <line x1="320" y1="93" x2="320" y2="107" stroke="#0ea5e9" strokeWidth="2" />
            <line x1="313" y1="100" x2="327" y2="100" stroke="#0ea5e9" strokeWidth="2" />

            {/* Hadamard on q[0] */}
            <rect x="360" y="22" width="34" height="36" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="377" y="45" fill="#bae6fd" textAnchor="middle" fontWeight="bold">H</text>

            {/* Stage 4: Bob Pauli Corrections on q[2] */}
            {/* CX correction (q1 -> q2) */}
            <circle cx="430" cy="100" r="4" fill="#10b981" />
            <line x1="430" y1="100" x2="430" y2="160" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="415" y="142" width="30" height="36" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="430" y="165" fill="#6ee7b7" textAnchor="middle" fontWeight="bold">X</text>

            {/* CZ correction (q0 -> q2) */}
            <circle cx="490" cy="40" r="4" fill="#10b981" />
            <line x1="490" y1="40" x2="490" y2="160" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="475" y="142" width="30" height="36" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="490" y="165" fill="#6ee7b7" textAnchor="middle" fontWeight="bold">Z</text>

            {/* Attack Perturbation Badge (if active) */}
            {attackType !== 'NONE' && (
              <g transform="translate(540, 138)">
                <rect x="0" y="0" width="70" height="44" rx="4" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                <text x="35" y="18" fill="#fda4af" textAnchor="middle" fontSize="9" fontWeight="bold">ATTACK</text>
                <text x="35" y="32" fill="#fecdd3" textAnchor="middle" fontSize="9">
                  {attackType === 'CHANNEL_TAMPERING' ? 'Rx(θ)+Rz' : attackType === 'SIGNATURE_FORGERY' ? 'Ry(Forged)' : 'Key-Swap'}
                </text>
              </g>
            )}

            {/* Alice Measurement Meters on q[0] and q[1] */}
            <rect x="640" y="22" width="34" height="36" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 648 48 A 10 10 0 0 1 666 48 L 664 36" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="657" y1="58" x2="657" y2="205" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />

            <rect x="640" y="82" width="34" height="36" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 648 108 A 10 10 0 0 1 666 108 L 664 96" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="657" y1="118" x2="657" y2="205" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Stage 5: Bob Projective Basis Rotation */}
            {measurementBasis === 'X' && (
              <g transform="translate(710, 142)">
                <rect x="0" y="0" width="34" height="36" rx="4" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
                <text x="17" y="23" fill="#86efac" textAnchor="middle" fontWeight="bold">H</text>
              </g>
            )}
            {measurementBasis === 'Y' && (
              <g transform="translate(710, 142)">
                <rect x="0" y="0" width="44" height="36" rx="4" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
                <text x="22" y="23" fill="#86efac" textAnchor="middle" fontSize="10" fontWeight="bold">S†·H</text>
              </g>
            )}

            {/* Bob Verification Measurement Meter into c[2] */}
            <rect x="780" y="142" width="38" height="36" rx="4" fill="#042f2e" stroke="#14b8a6" strokeWidth="1.5" />
            <path d="M 789 168 A 10 10 0 0 1 809 168 L 807 156" fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
            <line x1="799" y1="178" x2="799" y2="205" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
      ) : (
        /* QASM & ASCII Diagram */
        <div className="p-4 rounded-md bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800">
          <pre>{qasmDiagram || '// Qiskit Quantum Teleportation Circuit QASM\nOPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[3];\nh q[1];\ncx q[1],q[2];\ncx q[0],q[1];\nh q[0];\ncx q[1],q[2];\ncz q[0],q[2];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\nmeasure q[2] -> c[2];'}</pre>
        </div>
      )}

      {/* Protocol Explanation Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-400">
        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
          <span className="text-cyan-400 font-semibold">1. EPR Entanglement:</span> Alice & Bob share Bell state <code className="text-slate-200">|{bellState}⟩</code>.
        </div>
        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
          <span className="text-emerald-400 font-semibold">2. Quantum Feedforward:</span> Bob applies Pauli <code className="text-slate-200">Z^c0 · X^c1</code> corrections.
        </div>
        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
          <span className="text-purple-400 font-semibold">3. Basis Verification:</span> Projective measurement in Pauli <code className="text-slate-200">{measurementBasis}</code> basis.
        </div>
      </div>
    </div>
  );
};
