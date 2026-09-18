import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, Save, RefreshCw, Sliders, Cpu, CheckCircle2, Sun, Moon } from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const [forgeryThreshold, setForgeryThreshold] = useState<number>(0.15);
  const [replayThreshold, setReplayThreshold] = useState<number>(0.92);
  const [channelThreshold, setChannelThreshold] = useState<number>(0.10);
  const [chiSquareAlpha, setChiSquareAlpha] = useState<number>(0.05);
  const [minFidelity, setMinFidelity] = useState<number>(0.85);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const { data: thresholds } = useQuery({
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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)]">
              Engine Configuration & Thresholds
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded">
              DETERMINISTIC POLICIES
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
            Tune statistical boundaries, Total Variation Distance cutoffs, quantum channel noise limits, and hypothesis test significance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Appearance & Theme Card */}
        <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
          <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Interface Theme</span>
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-sans font-medium transition-colors border ${
                theme === 'dark'
                  ? 'bg-sky-500/10 text-sky-500 border-sky-500/30'
                  : 'bg-[var(--bg-panel-subtle)] text-[var(--text-secondary)] border-[var(--border-panel)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Security Console</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-sans font-medium transition-colors border ${
                theme === 'light'
                  ? 'bg-sky-500/10 text-sky-500 border-sky-500/30'
                  : 'bg-[var(--bg-panel-subtle)] text-[var(--text-secondary)] border-[var(--border-panel)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Research Workstation</span>
            </button>
          </div>
        </div>

        {/* Statistical Thresholds Card */}
        <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-500" />
              <span>Statistical Detection Thresholds</span>
            </h3>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-emerald-500 text-xs font-sans font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thresholds Updated Live</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Forgery Threshold */}
            <div className="space-y-2 p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <div className="flex justify-between items-center">
                <label className="font-medium text-[var(--text-primary)] font-sans">FORGERY_THRESHOLD (TVD)</label>
                <span className="text-sky-500 font-mono font-bold">{forgeryThreshold.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.01"
                value={forgeryThreshold}
                onChange={(e) => setForgeryThreshold(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Total Variation Distance δ(P, Q) upper limit above which a signature is classified as a forgery.
              </p>
            </div>

            {/* Channel Tampering Threshold */}
            <div className="space-y-2 p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <div className="flex justify-between items-center">
                <label className="font-medium text-[var(--text-primary)] font-sans">CHANNEL_TAMPER_THRESHOLD (QBER)</label>
                <span className="text-rose-500 font-mono font-bold">{(channelThreshold * 100).toFixed(1)}%</span>
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
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Maximum acceptable Quantum Bit Error Rate before classifying channel eavesdropping or active noise jamming.
              </p>
            </div>

            {/* Replay Similarity */}
            <div className="space-y-2 p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <div className="flex justify-between items-center">
                <label className="font-medium text-[var(--text-primary)] font-sans">REPLAY_SIMILARITY_THRESHOLD</label>
                <span className="text-amber-500 font-mono font-bold">{replayThreshold.toFixed(2)}</span>
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
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Token hash cross-correlation threshold detecting repeated measurement states across nonces.
              </p>
            </div>

            {/* Minimum Fidelity */}
            <div className="space-y-2 p-3.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)]">
              <div className="flex justify-between items-center">
                <label className="font-medium text-[var(--text-primary)] font-sans">MIN_ACCEPTABLE_FIDELITY</label>
                <span className="text-emerald-500 font-mono font-bold">{minFidelity.toFixed(2)}</span>
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
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                Lower bound on state overlap fidelity F(P, Q) for authentic teleportation verification.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded bg-[var(--bg-panel-elevated)] hover:bg-[var(--border-panel)] border border-[var(--border-panel)] text-[var(--text-secondary)] font-sans font-medium transition-colors"
            >
              Reset Defaults
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-sans font-medium shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {updateMutation.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save & Apply Thresholds</span>
            </button>
          </div>
        </div>

        {/* Engine Information & Backend Setup Card */}
        <div className="rounded-md bg-[var(--bg-panel)] border border-[var(--border-panel)] p-5 space-y-4">
          <h3 className="text-xs font-semibold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
            <Cpu className="w-4 h-4 text-sky-500" />
            <span>Quantum Simulator Backend & Architecture</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
              <span className="text-[var(--text-muted)] block text-[11px]">Current Simulator Backend</span>
              <span className="text-sky-500 font-semibold font-mono">Local Qiskit AerSimulator</span>
            </div>
            <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
              <span className="text-[var(--text-muted)] block text-[11px]">Hardware Extensibility</span>
              <span className="text-[var(--text-primary)]">IBM Quantum Runtime Compatible</span>
            </div>
            <div className="p-3 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-panel)] space-y-1">
              <span className="text-[var(--text-muted)] block text-[11px]">Threat Classification Policy</span>
              <span className="text-emerald-500 font-semibold">100% Deterministic & Statistical</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
