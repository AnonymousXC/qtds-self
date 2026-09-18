import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-1.5 rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-elevated)] border border-[var(--border-panel)] focus:outline-none focus:ring-1 focus:ring-sky-500 ${className}`}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5 text-amber-400/90" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-slate-600" />
      )}
    </button>
  );
};
