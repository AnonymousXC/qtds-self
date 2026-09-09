import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, Save, RefreshCw, Sliders, ShieldCheck, Cpu, Bot, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { ThresholdConfig } from '../types';

export const Settings: React.FC = () => {
  const queryClient = useQueryClient();

  const [forgeryThreshold, setForgeryThreshold] = useState<number>(0.15);
  const [replayThreshold, setReplayThreshold] = useState<number>(0.92);
  const [channelThreshold, setChannelThreshold] = useState<number>(0.10);
  const [chiSquareAlpha, setChiSquareAlpha] = useState<number>(0.05);
  const [minFidelity, setMinFidelity] = useState<number>(0.85);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const { data: thresholds, isLoading } = useQuery({
    queryKey: ['detectionThresholds'],
    queryFn: api.getThresholds
  });

  useEffect(() => {
    if (thresholds) {
      setForgeryThreshold(thresholds.forgery_threshold);
      setReplayThreshold(thresholds.replay_similarity_threshold);
      setChannelThreshold(thresholds.channel_tamper_threshold);
      setChiSquareAlpha(thresholds.chi_square_alpha);
      setMinFidelity(thresholds.min_acceptable_fidelity);
    }
  }, [thresholds]);

  const updateMutation = useMutation({
    mutationFn: api.updateThresholds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detectionThresholds'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      forgery_threshold: forgeryThreshold,
      replay_similarity_threshold: replayThreshold,
      channel_tamper_threshold: channelThreshold,
      chi_square_alpha: chiSquareAlpha,
      min_acceptable_fidelity: minFidelity
    });
  };

  const handleResetDefaults = () => {
    setForgeryThreshold(0.15);
    setReplayThreshold(0.92);
    setChannelThreshold(0.10);
    setChiSquareAlpha(0.05);
    setMinFidelity(0.85);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              ENGINE CONFIGURATION & THRESHOLDS
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
              DETERMINISTIC POLICIES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tune statistical boundaries, Total Variation Distance cutoffs, quantum channel noise limits, and AI copilot settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Statistical Thresholds Card */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>STATISTICAL DETECTION THRESHOLDS</span>
            </h3>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thresholds Updated Live!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forgery Threshold */}
            <div className="space-y-2 p-3.5 rounded bg-slate-950/70 border border-slate-800">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">FORGERY_THRESHOLD (TVD)</label>
                <span className="text-cyan-400 font-bold">{forgeryThreshold.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.01"
                value={forgeryThreshold}
                onChange={(e) => setForgeryThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 font-sans">
                Total Variation Distance $\delta(P, Q)$ upper limit above which a signature is classified as a forgery.
              </p>
            </div>

            {/* Channel Tampering Threshold */}
            <div className="space-y-2 p-3.5 rounded bg-slate-950/70 border border-slate-800">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">CHANNEL_TAMPER_THRESHOLD (QBER)</label>
                <span className="text-rose-400 font-bold">{(channelThreshold * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.30"
                step="0.01"
                value={channelThreshold}
                onChange={(e) => setChannelThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 font-sans">
                Maximum acceptable Quantum Bit Error Rate before classifying channel eavesdropping or active jamming.
              </p>
            </div>

            {/* Replay Similarity */}
            <div className="space-y-2 p-3.5 rounded bg-slate-950/70 border border-slate-800">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">REPLAY_SIMILARITY_THRESHOLD</label>
                <span className="text-amber-400 font-bold">{replayThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="0.99"
                step="0.01"
                value={replayThreshold}
                onChange={(e) => setReplayThreshold(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 font-sans">
                Token hash cross-correlation threshold detecting repeated measurement states across nonces.
              </p>
            </div>

            {/* Minimum Fidelity */}
            <div className="space-y-2 p-3.5 rounded bg-slate-950/70 border border-slate-800">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">MIN_ACCEPTABLE_FIDELITY</label>
                <span className="text-emerald-400 font-bold">{minFidelity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.70"
                max="0.98"
                step="0.01"
                value={minFidelity}
                onChange={(e) => setMinFidelity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 font-sans">
                Lower bound on state overlap fidelity $F(P, Q)$ for authentic teleportation.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-750 text-slate-300"
            >
              Reset to Recommended Defaults
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md transition-all flex items-center gap-2"
            >
              {updateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Apply Thresholds</span>
            </button>
          </div>
        </div>

        {/* Engine Information & Backend Setup Card */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>QUANTUM SIMULATOR BACKEND & ARCHITECTURE</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Current Simulator Backend</span>
              <span className="text-cyan-400 font-semibold">Local Qiskit AerSimulator</span>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Hardware Extensibility</span>
              <span className="text-slate-200">IBM Quantum Runtime Compatible</span>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Threat Classification Policy</span>
              <span className="text-emerald-400 font-semibold">100% Deterministic & Statistical</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
