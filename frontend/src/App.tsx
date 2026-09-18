import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { Dashboard } from './pages/Dashboard';
import { QuantumLab } from './pages/QuantumLab';
import { QDSSignature } from './pages/QDSSignature';
import { VerificationCenter } from './pages/VerificationCenter';
import { AttackLab } from './pages/AttackLab';
import { ThreatAnalytics } from './pages/ThreatAnalytics';
import { SecurityEvents } from './pages/SecurityEvents';
import { Copilot } from './pages/Copilot';
import { Reports } from './pages/Reports';
import { DemoMode } from './pages/DemoMode';
import { Settings } from './pages/Settings';

import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex h-screen bg-[var(--bg-app)] text-[var(--text-primary)] overflow-hidden font-sans">
            {/* Left Navigation Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar />

              {/* Scrollable View Area with balanced intentional spacing */}
              <main className="flex-1 overflow-y-auto px-6 py-7 md:px-8 md:py-8 bg-[var(--bg-app)]">
                <div className="max-w-7xl mx-auto pb-12">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/quantum-lab" element={<QuantumLab />} />
                    <Route path="/qds-signature" element={<QDSSignature />} />
                    <Route path="/verification" element={<VerificationCenter />} />
                    <Route path="/attack-lab" element={<AttackLab />} />
                    <Route path="/threat-analytics" element={<ThreatAnalytics />} />
                    <Route path="/security-events" element={<SecurityEvents />} />
                    <Route path="/copilot" element={<Copilot />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/demo" element={<DemoMode />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
