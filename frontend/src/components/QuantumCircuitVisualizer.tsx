import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();

  const isLight = theme === 'light';
  const wireStroke = isLight ? '#94A3B8' : '#334155';
  const classicalWireStroke = isLight ? '#64748B' : '#475569';
  const gridStroke = isLight ? '#E2E8F0' : '#161F2C';
  const labelFill = isLight ? '#475569' : '#94A3B8';
  const stateBoxFill = isLight ? '#E0F2FE' : '#0C2D48';
  const stateBoxStroke = isLight ? '#0284C7' : '#0284C7';
  const stateTextFill = isLight ? '#0369A1' : '#38BDF8';
  const hadamardFill = isLight ? '#EEF2FF' : '#1E1B4B';
  const hadamardStroke = isLight ? '#6366F1' : '#4F46E5';
  const hadamardText = isLight ? '#4338CA' : '#C7D2FE';
  const pauliFill = isLight ? '#ECFDF5' : '#064E3B';
  const pauliStroke = isLight ? '#10B981' : '#10B981';
  const pauliText = isLight ? '#047857' : '#6EE7B7';
  const meterFill = isLight ? '#F1F5F9' : '#1E293B';
  const meterStroke = isLight ? '#64748B' : '#475569';

  return (
    <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
      {/* Circuit Header & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider">
            Quantum Teleportation Circuit
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-[11px]">
            <span className="text-[var(--text-muted)]">QUBITS:</span>
            <span className="text-sky-500 font-semibold">3</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-[11px]">
            <span className="text-[var(--text-muted)]">DEPTH:</span>
            <span className="text-[var(--text-primary)] font-semibold">{depth}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-[var(--text-secondary)] text-[11px]">
            <span className="text-[var(--text-muted)]">GATES:</span>
            <span className="text-[var(--text-primary)] font-semibold">{totalGates}</span>
          </div>

          <div className="flex items-center rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode('svg')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                viewMode === 'svg'
                  ? 'bg-[var(--bg-panel-elevated)] text-[var(--text-primary)] font-medium shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Schematic
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                viewMode === 'ascii'
                  ? 'bg-[var(--bg-panel-elevated)] text-[var(--text-primary)] font-medium shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              QASM / Text
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'svg' ? (
        /* High Precision SVG Quantum Circuit */
        <div className="overflow-x-auto py-3 px-2 bg-[var(--code-bg)] rounded border border-[var(--border-panel)]">
          <svg viewBox="0 0 920 230" className="w-full min-w-[800px] h-auto font-mono text-xs select-none">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridStroke} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Qubit Wire 0 (Alice Input) */}
            <text x="20" y="45" fill={labelFill} fontWeight="600">q[0] (Alice)</text>
            <line x1="120" y1="40" x2="880" y2="40" stroke={wireStroke} strokeWidth="1.5" />

            {/* Qubit Wire 1 (Alice EPR) */}
            <text x="20" y="105" fill={labelFill} fontWeight="600">q[1] (EPR-A)</text>
            <line x1="120" y1="100" x2="880" y2="100" stroke={wireStroke} strokeWidth="1.5" />

            {/* Qubit Wire 2 (Bob EPR / Receiver) */}
            <text x="20" y="165" fill={labelFill} fontWeight="600">q[2] (Bob-Recv)</text>
            <line x1="120" y1="160" x2="880" y2="160" stroke={wireStroke} strokeWidth="1.5" />

            {/* Classical Register Wire */}
            <text x="20" y="210" fill={labelFill} fontWeight="600">c (Classical)</text>
            <line x1="120" y1="205" x2="880" y2="205" stroke={classicalWireStroke} strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="120" y1="208" x2="880" y2="208" stroke={classicalWireStroke} strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Stage 1: State Preparation on q[0] */}
            <rect x="140" y="22" width="40" height="36" rx="3" fill={stateBoxFill} stroke={stateBoxStroke} strokeWidth="1.2" />
            <text x="160" y="45" fill={stateTextFill} textAnchor="middle" fontWeight="bold">|{inputState}⟩</text>

            {/* Stage 2: Bell Pair Entanglement on q[1] and q[2] */}
            <rect x="195" y="82" width="34" height="36" rx="3" fill={hadamardFill} stroke={hadamardStroke} strokeWidth="1.2" />
            <text x="212" y="105" fill={hadamardText} textAnchor="middle" fontWeight="bold">H</text>

            {/* CNOT Control (q1) to Target (q2) */}
            <circle cx="260" cy="100" r="4.5" fill="#6366F1" />
            <line x1="260" y1="100" x2="260" y2="160" stroke="#6366F1" strokeWidth="1.5" />
            <circle cx="260" cy="160" r="9" fill={isLight ? '#FFFFFF' : '#0B0F14'} stroke="#6366F1" strokeWidth="1.5" />
            <line x1="260" y1="154" x2="260" y2="166" stroke="#6366F1" strokeWidth="1.5" />
            <line x1="254" y1="160" x2="266" y2="160" stroke="#6366F1" strokeWidth="1.5" />

            {/* Stage 3: Alice Bell Measurement on q[0] and q[1] */}
            {/* CNOT (q0 -> q1) */}
            <circle cx="320" cy="40" r="4.5" fill="#0284C7" />
            <line x1="320" y1="40" x2="320" y2="100" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="320" cy="100" r="9" fill={isLight ? '#FFFFFF' : '#0B0F14'} stroke="#0284C7" strokeWidth="1.5" />
            <line x1="320" y1="94" x2="320" y2="106" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="314" y1="100" x2="326" y2="100" stroke="#0284C7" strokeWidth="1.5" />

            {/* Hadamard on q[0] */}
            <rect x="360" y="22" width="34" height="36" rx="3" fill={stateBoxFill} stroke={stateBoxStroke} strokeWidth="1.2" />
            <text x="377" y="45" fill={stateTextFill} textAnchor="middle" fontWeight="bold">H</text>

            {/* Stage 4: Bob Pauli Corrections on q[2] */}
            {/* CX correction (q1 -> q2) */}
            <circle cx="430" cy="100" r="3.5" fill="#10B981" />
            <line x1="430" y1="100" x2="430" y2="160" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
            <rect x="415" y="142" width="30" height="36" rx="3" fill={pauliFill} stroke={pauliStroke} strokeWidth="1.2" />
            <text x="430" y="165" fill={pauliText} textAnchor="middle" fontWeight="bold">X</text>

            {/* CZ correction (q0 -> q2) */}
            <circle cx="490" cy="40" r="3.5" fill="#10B981" />
            <line x1="490" y1="40" x2="490" y2="160" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
            <rect x="475" y="142" width="30" height="36" rx="3" fill={pauliFill} stroke={pauliStroke} strokeWidth="1.2" />
            <text x="490" y="165" fill={pauliText} textAnchor="middle" fontWeight="bold">Z</text>

            {/* Attack Perturbation Badge (if active) */}
            {attackType !== 'NONE' && (
              <g transform="translate(540, 138)">
                <rect x="0" y="0" width="70" height="44" rx="3" fill={isLight ? '#FFE4E6' : '#4C0519'} stroke="#E11D48" strokeWidth="1.5" />
                <text x="35" y="18" fill={isLight ? '#BE123C' : '#FDA4AF'} textAnchor="middle" fontSize="9" fontWeight="bold">ATTACK</text>
                <text x="35" y="32" fill={isLight ? '#9F1239' : '#FECDD3'} textAnchor="middle" fontSize="9">
                  {attackType === 'CHANNEL_TAMPERING' ? 'Rx(θ)+Rz' : attackType === 'SIGNATURE_FORGERY' ? 'Ry(Forged)' : 'Key-Swap'}
                </text>
              </g>
            )}

            {/* Alice Measurement Meters on q[0] and q[1] */}
            <rect x="640" y="22" width="34" height="36" rx="3" fill={meterFill} stroke={meterStroke} strokeWidth="1.2" />
            <path d="M 648 48 A 10 10 0 0 1 666 48 L 664 36" fill="none" stroke={labelFill} strokeWidth="1.2" />
            <line x1="657" y1="58" x2="657" y2="205" stroke={meterStroke} strokeWidth="1" strokeDasharray="2 2" />

            <rect x="640" y="82" width="34" height="36" rx="3" fill={meterFill} stroke={meterStroke} strokeWidth="1.2" />
            <path d="M 648 108 A 10 10 0 0 1 666 108 L 664 96" fill="none" stroke={labelFill} strokeWidth="1.2" />
            <line x1="657" y1="118" x2="657" y2="205" stroke={meterStroke} strokeWidth="1" strokeDasharray="2 2" />

            {/* Stage 5: Bob Projective Basis Rotation */}
            {measurementBasis === 'X' && (
              <g transform="translate(710, 142)">
                <rect x="0" y="0" width="34" height="36" rx="3" fill={stateBoxFill} stroke={stateBoxStroke} strokeWidth="1.2" />
                <text x="17" y="23" fill={stateTextFill} textAnchor="middle" fontWeight="bold">H</text>
              </g>
            )}
            {measurementBasis === 'Y' && (
              <g transform="translate(710, 142)">
                <rect x="0" y="0" width="44" height="36" rx="3" fill={stateBoxFill} stroke={stateBoxStroke} strokeWidth="1.2" />
                <text x="22" y="23" fill={stateTextFill} textAnchor="middle" fontSize="10" fontWeight="bold">S†·H</text>
              </g>
            )}

            {/* Bob Verification Measurement Meter into c[2] */}
            <rect x="780" y="142" width="38" height="36" rx="3" fill={isLight ? '#CCFBF1' : '#0D2E2B'} stroke="#0D9488" strokeWidth="1.2" />
            <path d="M 789 168 A 10 10 0 0 1 809 168 L 807 156" fill="none" stroke="#0D9488" strokeWidth="1.2" />
            <line x1="799" y1="178" x2="799" y2="205" stroke="#0D9488" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
      ) : (
        /* QASM & ASCII Diagram */
        <div className="p-3.5 rounded bg-[var(--code-bg)] font-mono text-xs text-sky-500 overflow-x-auto border border-[var(--border-panel)]">
          <pre>{qasmDiagram || '// Qiskit Quantum Teleportation Circuit QASM\nOPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[3];\nh q[1];\ncx q[1],q[2];\ncx q[0],q[1];\nh q[0];\ncx q[1],q[2];\ncz q[0],q[2];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\nmeasure q[2] -> c[2];'}</pre>
        </div>
      )}

      {/* Protocol Explanation Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs font-mono text-[var(--text-secondary)]">
        <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
          <span className="text-sky-500 font-medium">1. Entanglement:</span> Alice & Bob share <code className="text-[var(--text-primary)]">|{bellState}⟩</code>.
        </div>
        <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
          <span className="text-emerald-500 font-medium">2. Pauli Feedforward:</span> Bob applies <code className="text-[var(--text-primary)]">Z^c0 · X^c1</code>.
        </div>
        <div className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
          <span className="text-indigo-500 font-medium">3. Basis Verification:</span> Pauli <code className="text-[var(--text-primary)]">{measurementBasis}</code> projection.
        </div>
      </div>
    </div>
  );
};
