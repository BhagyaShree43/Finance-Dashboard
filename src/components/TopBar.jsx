// TopBar.jsx — Sticky header with page title + date
// React 19: no import React needed

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import './TopBar.css';

const PAGE_TITLES = {
  dashboard:    { main: 'Overview',   accent: 'Dashboard' },
  transactions: { main: 'All',        accent: 'Transactions' },
  insights:     { main: 'Financial',  accent: 'Insights' },
};

export default function TopBar({ onMenuToggle }) {
  const { activePage } = useAppContext();

  const currentDate = useMemo(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    }), []);

  const { main, accent } = PAGE_TITLES[activePage] ?? PAGE_TITLES.dashboard;

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuToggle} aria-label="Open navigation">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>

      <h1 className="topbar__title">
        {main} <span className="topbar__accent">{accent}</span>
      </h1>

      <span className="date-pill font-mono">{currentDate}</span>
    </header>
  );
}
