import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ShieldCheck,
  Bot,
  FileText,
  Flame,
  RefreshCw,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { VerdictBadge } from '../components/VerdictBadge';

export const DemoMode: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Demo State Objects
  const [demoSession, setDemoSession] = useState<any>(null);
  const [demoSignature, setDemoSignature] = useState<any>(null);
  const [legitVerification, setLegitVerification] = useState<any>(null);
  const [attackResult, setAttackResult] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Auto-play / Step Execution
  const runStep1 = async () => {
    setIsRunning(true);
    try {
      // 1. Create Session
      const sess = await api.createSession({
        sender: 'Alice (Signer)',
        receiver: 'Bob (Verifier)',
        bell_state: 'PHI_PLUS',
        key_length: 5
      });
      setDemoSession(sess);

      // 2. Generate Signature
      const sig = await api.generateSignature({
        session_id: sess.id,
        message: 'SIH-2026 Defense Grid Authorization: Grant Node Access',
        signer_id: 'Alice'
      });
      setDemoSignature(sig);
      setCurrentStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const runStep2 = async () => {
    if (!demoSession || !demoSignature) return;
    setIsRunning(true);
    try {
      // Verify legitimate signature
      const verif = await api.verifySignature({
        session_id: demoSession.id,
        signature_id: demoSignature.id,
        shots: 2048,
        attack_type: 'NONE'
      });
      setLegitVerification(verif);
      setCurrentStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const runStep3 = async () => {
    if (!demoSession) return;
    setIsRunning(true);
    try {
      // Launch adversarial channel tampering attack
      const comparison = await api.simulateAttack({
        session_id: demoSession.id,
        attack_type: 'CHANNEL_TAMPERING',
        severity: 0.65,
        shots: 2048
      });
      setAttackResult(comparison);
      setCurrentStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const runStep4 = async () => {
    if (!attackResult) return;
    setIsRunning(true);
    try {
      // Consult Copilot
      const explanation = await api.explainWithCopilot({
        context_data: {
          status: 'MALICIOUS',
          attack_type: 'CHANNEL_TAMPERING',
          evidence: attackResult.evidence,
          statistical_metrics: attackResult.attack_run.statistical_metrics,
          threshold_applied: 0.10
        },
        user_query: 'Why was this session classified as a Channel Tampering attack?'
      });
      setAiExplanation(explanation);
      setCurrentStep(5);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const runStep5 = async () => {
    setIsRunning(true);
    try {
      // Generate Formal Audit Report
      const rep = await api.generateReport({
        title: 'SIH Final Demo: Quantum Threat Incident Report'
      });
      setGeneratedReport(rep);
      setCurrentStep(6);
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setCurrentStep(1);
    setDemoSession(null);
    setDemoSignature(null);
    setLegitVerification(null);
    setAttackResult(null);
    setAiExplanation(null);
    setGeneratedReport(null);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Judge Evaluation Demo Workflow
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded">
              2-MINUTE WORKFLOW
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Demonstrate the full end-to-end Quantum Digital Signature protocol, deterministic threat detection, and AI Copilot briefing in minutes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] text-xs font-sans text-[var(--text-secondary)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        {[
          { num: 1, title: '1. Sign (Alice)', status: currentStep > 1 ? 'done' : currentStep === 1 ? 'active' : 'todo' },
          { num: 2, title: '2. Verify (Bob)', status: currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : 'todo' },
          { num: 3, title: '3. Inject Attack', status: currentStep > 3 ? 'done' : currentStep === 3 ? 'active' : 'todo' },
          { num: 4, title: '4. AI Copilot', status: currentStep > 4 ? 'done' : currentStep === 4 ? 'active' : 'todo' },
          { num: 5, title: '5. Audit Report', status: currentStep >= 6 ? 'done' : currentStep === 5 ? 'active' : 'todo' }
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-md border text-center transition-all ${
              s.status === 'done'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : s.status === 'active'
                ? 'bg-[var(--bg-panel-elevated)] border-sky-500 text-sky-500 font-semibold shadow-xs'
                : 'bg-[var(--bg-panel)] border-[var(--border-panel)] text-[var(--text-muted)]'
            }`}
          >
            <div className="text-[10px] font-mono text-[var(--text-muted)]">Step {s.num}</div>
            <div className="truncate font-sans font-medium text-xs mt-0.5">{s.title}</div>
          </div>
        ))}
      </div>

      {/* Interactive Step Card */}
      <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-6 space-y-6">
        {/* Step 1: Sign */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-sans">
                <span className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-mono">1</span>
                <span>STEP 1: Generate Teleportation QDS Signature</span>
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Protocol: Bennett-93 EPR</span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Alice initializes an entangled EPR Bell pair channel with Bob and teleports private Pauli eigenstate tokens to sign the transaction message.
            </p>

            <button
              onClick={runStep1}
              disabled={isRunning}
              className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans font-medium text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Generate Quantum Signature</span>
            </button>
          </div>
        )}

        {/* Step 2: Verify Legitimate Signature */}
        {currentStep === 2 && demoSignature && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-sans">
                <span className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-mono">2</span>
                <span>STEP 2: Verify Legitimate Quantum Signature (Bob)</span>
              </h3>
              <span className="text-xs font-mono text-emerald-500">Signature ID: {demoSignature.id}</span>
            </div>

            <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] text-xs space-y-1 font-mono">
              <div className="text-[var(--text-muted)] font-sans">Message: <strong className="text-[var(--text-primary)]">{demoSignature.message}</strong></div>
              <div className="text-[var(--text-muted)]">Digest: <span className="text-sky-500 text-[11px]">{demoSignature.message_digest}</span></div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Bob applies classical feedforward Pauli corrections (Z^c0 · X^c1) on his entangled qubit and performs projective measurements.
            </p>

            <button
              onClick={runStep2}
              disabled={isRunning}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Verify Signature Legality</span>
            </button>
          </div>
        )}

        {/* Step 3: Legitimate Verified -> Launch Attack */}
        {currentStep === 3 && legitVerification && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-sans">
                <span className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-mono">3</span>
                <span>STEP 3: Launch Cyber-Physical Attack Simulation</span>
              </h3>
              <VerdictBadge status={legitVerification.status} size="sm" />
            </div>

            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 space-y-1 font-mono">
              <div>✓ Legitimate Signature Verified with TVD = {legitVerification.statistical_metrics.total_variation_distance.toFixed(4)} (≤ 0.1500)</div>
              <div>✓ Quantum State Fidelity = {legitVerification.statistical_metrics.fidelity.toFixed(4)} (≥ 0.8500)</div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Now simulate an active adversary launching a <strong>Quantum Channel Tampering / Eavesdropping Attack</strong> (introducing depolarizing decoherence noise onto the transmission line).
            </p>

            <button
              onClick={runStep3}
              disabled={isRunning}
              className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-sans font-medium text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
              <span>Simulate Quantum Attack & Run Detection</span>
            </button>
          </div>
        )}

        {/* Step 4: Threat Detected -> Ask Copilot */}
        {currentStep === 4 && attackResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-sans">
                <span className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-mono">4</span>
                <span>STEP 4: Deterministic Engine Detected Threat! Consult AI Copilot</span>
              </h3>
              <VerdictBadge status="MALICIOUS" size="sm" />
            </div>

            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 space-y-1.5 font-mono">
              <div className="font-bold">⚠️ MALICIOUS ATTACK INTERCEPTED: {attackResult.attack_type}</div>
              <div>• TVD Metric Shift: +{attackResult.metrics_delta.tvd_delta.toFixed(4)} (Exceeds threshold 0.1000)</div>
              <div>• QBER Quantum Error: +{(attackResult.metrics_delta.qber_delta * 100).toFixed(1)}%</div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Ask the auxiliary <strong>Quantum Security Copilot</strong> to explain the physical mechanism behind this detection based on structured measurement statistics.
            </p>

            <button
              onClick={runStep4}
              disabled={isRunning}
              className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans font-medium text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
              <span>Generate AI Incident Briefing</span>
            </button>
          </div>
        )}

        {/* Step 5: Copilot Explanation -> Generate Report */}
        {currentStep === 5 && aiExplanation && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-sans">
                <span className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-mono">5</span>
                <span>STEP 5: Generate Formal Security Audit Report</span>
              </h3>
              <span className="text-xs text-sky-500 font-mono">Copilot Briefing Ready</span>
            </div>

            <div className="p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] font-sans text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
              {aiExplanation.explanation}
            </div>

            <button
              onClick={runStep5}
              disabled={isRunning}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-medium text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              <span>Generate Formal Audit Report</span>
            </button>
          </div>
        )}

        {/* Step 6: Complete! */}
        {currentStep === 6 && generatedReport && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-[var(--text-primary)] font-sans">
              Demonstration Completed Successfully
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans max-w-md mx-auto leading-relaxed">
              All 6 protocol stages executed: Real Qiskit teleportation circuit, deterministic threat classification, AI reasoning briefing, and formal PDF report generation.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <a
                href="/reports"
                className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans font-medium text-xs shadow-xs"
              >
                Inspect Audit Report Artifact
              </a>
              <button
                onClick={resetDemo}
                className="px-4 py-2 rounded bg-[var(--bg-panel-elevated)] hover:bg-[var(--border-panel)] border border-[var(--border-panel)] text-[var(--text-secondary)] font-sans font-medium text-xs"
              >
                Run Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
