import { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import InsightsPage from './components/InsightsPage';
import Toast from './components/Toast';
import './globals.css';
import './App.css';

// ── Inner shell (needs context, so lives inside AppProvider) ──
function AppShell() {
  const { activePage } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile backdrop — closes sidebar when tapped */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="main-content">
        <TopBar onMenuToggle={() => setSidebarOpen(p => !p)} />

        <div className="page-container">
          {/*
            Pages are conditionally rendered (not just hidden).
            This unmounts Chart.js instances when switching pages,
            preventing stale canvas references and memory leaks.
          */}
          {activePage === 'dashboard'    && <DashboardPage />}
          {activePage === 'transactions' && <TransactionsPage />}
          {activePage === 'insights'     && <InsightsPage />}
        </div>
      </main>

      <Toast />
    </div>
  );
}

// ── Root export — AppProvider must wrap AppShell ───────────────
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
