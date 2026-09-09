import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Bot,
  FileText,
  Flame,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { VerdictBadge } from '../components/VerdictBadge';
import { MeasurementHistogram } from '../components/MeasurementHistogram';

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
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const runAutoDemo = async () => {
    await runStep1();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              1-CLICK HACKATHON JUDGE DEMO MODE
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              2-MINUTE WORKFLOW
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrate the full end-to-end Quantum Digital Signature protocol, deterministic threat detection, and AI Copilot briefing in minutes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {[
          { num: 1, title: '1. Sign (Alice)', status: currentStep > 1 ? 'done' : currentStep === 1 ? 'active' : 'todo' },
          { num: 2, title: '2. Verify (Bob)', status: currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : 'todo' },
          { num: 3, title: '3. Inject Attack', status: currentStep > 3 ? 'done' : currentStep === 3 ? 'active' : 'todo' },
          { num: 4, title: '4. AI Copilot', status: currentStep > 4 ? 'done' : currentStep === 4 ? 'active' : 'todo' },
          { num: 5, title: '5. Audit Report', status: currentStep >= 6 ? 'done' : currentStep === 5 ? 'active' : 'todo' }
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-lg border text-center transition-all ${
              s.status === 'done'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                : s.status === 'active'
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <div className="text-[10px] text-slate-400">Step {s.num}</div>
            <div className="truncate">{s.title}</div>
          </div>
        ))}
      </div>

      {/* Interactive Step Card */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 space-y-6 font-mono">
        {/* Step 1: Sign */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs">1</span>
                <span>STEP 1: Generate Teleportation QDS Signature</span>
              </h3>
              <span className="text-xs text-slate-400">Protocol: Bennett-93 EPR Teleportation</span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Alice initializes an entangled EPR Bell pair channel with Bob and teleports private Pauli eigenstate tokens to sign the transaction message.
            </p>

            <button
              onClick={runStep1}
              disabled={isRunning}
              className="px-6 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Generate Quantum Signature</span>
            </button>
          </div>
        )}

        {/* Step 2: Verify Legitimate Signature */}
        {currentStep === 2 && demoSignature && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs">2</span>
                <span>STEP 2: Verify Legitimate Quantum Signature (Bob)</span>
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">Signature ID: {demoSignature.id}</span>
            </div>

            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">Message: <strong className="text-slate-100 font-sans">{demoSignature.message}</strong></div>
              <div className="text-slate-400">Digest: <span className="text-cyan-400 text-[11px]">{demoSignature.message_digest}</span></div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Bob applies classical feedforward Pauli corrections (Z^c0 · X^c1) on his entangled qubit and performs projective measurements.
            </p>

            <button
              onClick={runStep2}
              disabled={isRunning}
              className="px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify Signature Legality</span>
            </button>
          </div>
        )}

        {/* Step 3: Legitimate Verified -> Launch Attack */}
        {currentStep === 3 && legitVerification && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs">3</span>
                <span>STEP 3: Launch Cyber-Physical Attack Simulation</span>
              </h3>
              <VerdictBadge status={legitVerification.status} size="sm" />
            </div>

            <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 space-y-1">
              <div>✓ Legitimate Signature Verified with TVD = {legitVerification.statistical_metrics.total_variation_distance.toFixed(4)} (≤ 0.1500)</div>
              <div>✓ Quantum State Fidelity = {legitVerification.statistical_metrics.fidelity.toFixed(4)} (≥ 0.8500)</div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Now simulate an active adversary launching a <strong>Quantum Channel Tampering / Eavesdropping Attack</strong> (introducing depolarizing decoherence noise onto the transmission line).
            </p>

            <button
              onClick={runStep3}
              disabled={isRunning}
              className="px-6 py-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
              <span>Simulate Quantum Attack & Run Detection</span>
            </button>
          </div>
        )}

        {/* Step 4: Threat Detected -> Ask Copilot */}
        {currentStep === 4 && attackResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs">4</span>
                <span>STEP 4: Deterministic Engine Detected Threat! Consult AI Copilot</span>
              </h3>
              <VerdictBadge status="MALICIOUS" size="sm" />
            </div>

            <div className="p-3.5 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300 space-y-1.5">
              <div className="font-bold">⚠️ MALICIOUS ATTACK INTERCEPTED: {attackResult.attack_type}</div>
              <div>• TVD Metric Jump: +{attackResult.metrics_delta.tvd_delta.toFixed(4)} (Exceeds threshold 0.1000)</div>
              <div>• QBER Quantum Error: +{(attackResult.metrics_delta.qber_delta * 100).toFixed(1)}%</div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Ask the auxiliary <strong>Quantum Security Copilot</strong> to explain the physical mechanism behind this detection based on structured measurement statistics.
            </p>

            <button
              onClick={runStep4}
              disabled={isRunning}
              className="px-6 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              <span>Generate AI Incident Briefing</span>
            </button>
          </div>
        )}

        {/* Step 5: Copilot Explanation -> Generate Report */}
        {currentStep === 5 && aiExplanation && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs">5</span>
                <span>STEP 5: Generate Formal Security Audit Report</span>
              </h3>
              <span className="text-xs text-cyan-400 font-mono">Copilot Briefing Ready</span>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {aiExplanation.explanation}
            </div>

            <button
              onClick={runStep5}
              disabled={isRunning}
              className="px-6 py-3 rounded bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>Generate Formal Audit Report</span>
            </button>
          </div>
        )}

        {/* Step 6: Complete! */}
        {currentStep === 6 && generatedReport && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">
              DEMONSTRATION COMPLETED SUCCESSFULLY!
            </h3>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              All 6 protocol stages executed: Real Qiskit teleportation circuit, deterministic threat classification, AI reasoning briefing, and formal PDF report generation.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <a
                href="/reports"
                className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Inspect Audit Report Artifact
              </a>
              <button
                onClick={resetDemo}
                className="px-5 py-2.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs"
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
