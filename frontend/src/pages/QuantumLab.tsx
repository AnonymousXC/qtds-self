import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Atom, Play, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { QuantumCircuitVisualizer } from '../components/QuantumCircuitVisualizer';
import { MeasurementHistogram } from '../components/MeasurementHistogram';
import { MetricCard } from '../components/MetricCard';

export const QuantumLab: React.FC = () => {
  const [inputState, setInputState] = useState<string>('+');
  const [measurementBasis, setMeasurementBasis] = useState<string>('X');
  const [bellState, setBellState] = useState<string>('PHI_PLUS');
  const [shots, setShots] = useState<number>(2048);
  const [attackType, setAttackType] = useState<string>('NONE');
  const [attackSeverity, setAttackSeverity] = useState<number>(0.0);

  const { data: simResult, isLoading, refetch } = useQuery({
    queryKey: ['quantumLabSim', inputState, measurementBasis, bellState, shots, attackType, attackSeverity],
    queryFn: () =>
      api.simulateQuantumLabCircuit({
        input_state: inputState,
        measurement_basis: measurementBasis,
        bell_state: bellState,
        shots,
        attack_type: attackType,
        attack_severity: attackSeverity
      }),
    staleTime: 1000
  });

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Atom className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Quantum Lab & Simulator
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded">
              QISKIT AER SIMULATOR
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Interactive quantum teleportation circuit designer, state tomography explorer, and Pauli correction simulator.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-medium transition-colors shadow-xs disabled:opacity-50 focus:outline-none"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          <span>Execute Circuit</span>
        </button>
      </div>

      {/* Circuit Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] text-xs">
        {/* Input State */}
        <div className="space-y-1.5">
          <label className="text-[var(--text-secondary)] font-medium font-sans block">Input State |ψ⟩</label>
          <select
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:border-sky-500 outline-none font-mono text-xs"
          >
            <option value="0">|0⟩ (Computational Zero)</option>
            <option value="1">|1⟩ (Computational One)</option>
            <option value="+">|+⟩ (|0⟩ + |1⟩)/√2 (Hadamard)</option>
            <option value="-">|-⟩ (|0⟩ - |1⟩)/√2 (Phase-Flip)</option>
            <option value="R">|R⟩ (|0⟩ + i|1⟩)/√2 (Circular Right)</option>
            <option value="L">|L⟩ (|0⟩ - i|1⟩)/√2 (Circular Left)</option>
          </select>
        </div>

        {/* Measurement Basis */}
        <div className="space-y-1.5">
          <label className="text-[var(--text-secondary)] font-medium font-sans block">Measurement Basis</label>
          <select
            value={measurementBasis}
            onChange={(e) => setMeasurementBasis(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:border-sky-500 outline-none font-mono text-xs"
          >
            <option value="Z">Pauli Z-Basis [|0⟩, |1⟩]</option>
            <option value="X">Pauli X-Basis [|+⟩, |-⟩]</option>
            <option value="Y">Pauli Y-Basis [|R⟩, |L⟩]</option>
          </select>
        </div>

        {/* Bell State */}
        <div className="space-y-1.5">
          <label className="text-[var(--text-secondary)] font-medium font-sans block">Shared Entangled EPR Pair</label>
          <select
            value={bellState}
            onChange={(e) => setBellState(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded px-2.5 py-1.5 text-[var(--text-primary)] focus:border-sky-500 outline-none font-mono text-xs"
          >
            <option value="PHI_PLUS">|Φ+⟩ = (|00⟩ + |11⟩)/√2</option>
            <option value="PHI_MINUS">|Φ-⟩ = (|00⟩ - |11⟩)/√2</option>
            <option value="PSI_PLUS">|Ψ+⟩ = (|01⟩ + |10⟩)/√2</option>
            <option value="PSI_MINUS">|Ψ-⟩ = (|01⟩ - |10⟩)/√2</option>
          </select>
        </div>

        {/* Shots */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[var(--text-secondary)] font-sans">
            <label className="font-medium">Simulator Shots</label>
            <span className="font-mono text-sky-500 font-semibold">{shots}</span>
          </div>
          <input
            type="range"
            min="256"
            max="8192"
            step="256"
            value={shots}
            onChange={(e) => setShots(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TVD Statistical Distance"
          value={simResult?.statistical_metrics?.total_variation_distance?.toFixed(4) ?? '0.0000'}
          subtitle="δ(P, Q) vs Theoretical"
          statusColor={simResult && simResult.statistical_metrics?.total_variation_distance > 0.15 ? 'rose' : 'emerald'}
          formula="δ = ½ ∑ |P - Q|"
        />

        <MetricCard
          title="Quantum State Fidelity"
          value={simResult?.statistical_metrics?.fidelity?.toFixed(4) ?? '1.0000'}
          subtitle="State Overlap Fraction"
          statusColor={simResult && simResult.statistical_metrics?.fidelity < 0.85 ? 'rose' : 'cyan'}
          formula="F = (∑ √P·Q)²"
        />

        <MetricCard
          title="Circuit Depth & Gates"
          value={`Depth ${simResult?.circuit_metadata?.depth ?? 6} (${simResult?.circuit_metadata?.total_gates ?? 11} Gates)`}
          subtitle="Qiskit Aer Circuit Graph"
          statusColor="slate"
        />

        <MetricCard
          title="Execution Time"
          value={`${simResult?.execution_time_ms ?? 0} ms`}
          subtitle={simResult?.circuit_metadata?.backend ?? 'Local Qiskit Aer'}
          statusColor="cyan"
        />
      </div>

      {/* Visual Circuit and Measurement Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuantumCircuitVisualizer
          inputState={inputState}
          measurementBasis={measurementBasis}
          bellState={bellState}
          depth={simResult?.circuit_metadata?.depth}
          totalGates={simResult?.circuit_metadata?.total_gates}
          backendName={simResult?.circuit_metadata?.backend}
          qasmDiagram={simResult?.circuit_metadata?.diagram}
          attackType={attackType}
          attackSeverity={attackSeverity}
        />

        <MeasurementHistogram
          observedDistribution={simResult?.observed_distribution}
          expectedDistribution={simResult?.expected_distribution}
          shots={shots}
          tvd={simResult?.statistical_metrics?.total_variation_distance}
          fidelity={simResult?.statistical_metrics?.fidelity}
        />
      </div>
    </div>
  );
};
