import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { computeSummary, formatCurrency } from '../utils/helpers';
import './SummaryCards.css';

// Card config factory — maps computed summary to display config
function buildCards(summary) {
  return [
    {
      id: 'balance', label: 'Total Balance',
      value: formatCurrency(summary.balance),
      change: { text: 'Net position', dir: 'neutral' },
      colorClass: 'gold', accent: 'var(--gold)',
      icon: <svg width="20" height="20" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9.5 9.5A2.5 2.5 0 0112 8h1a2 2 0 010 4h-2a2 2 0 000 4h1a2.5 2.5 0 002.5-2.5"/></svg>,
    },
    {
      id: 'income', label: 'Total Income',
      value: formatCurrency(summary.income),
      change: { text: '↑ 12.4% vs prior', dir: 'up' },
      colorClass: 'green', accent: 'var(--green)',
      icon: <svg width="20" height="20" fill="none" stroke="var(--green)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20V4M4 12l8-8 8 8"/></svg>,
    },
    {
      id: 'expenses', label: 'Total Expenses',
      value: formatCurrency(summary.expenses),
      change: { text: '↓ 3.1% vs prior', dir: 'down' },
      colorClass: 'red', accent: 'var(--red)',
      icon: <svg width="20" height="20" fill="none" stroke="var(--red)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8l-8 8-8-8"/></svg>,
    },
    {
      id: 'savings', label: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      change: { text: '↑ 5.2% vs prior', dir: 'up' },
      colorClass: 'blue', accent: 'var(--blue)',
      icon: <svg width="20" height="20" fill="none" stroke="var(--blue)" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm10 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    },
  ];
}

// Single card — pure presentational component
function SummaryCard({ card, index }) {
  return (
    <div
      className="summary-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="summary-card__glow" style={{ background: card.accent }} />
      <p className="summary-card__label">{card.label}</p>
      <p className={`summary-card__value summary-card__value--${card.colorClass}`}>{card.value}</p>
      <span className={`summary-card__change summary-card__change--${card.change.dir}`}>
        {card.change.text}
      </span>
      <div className="summary-card__icon" style={{ background: `${card.accent}1a` }}>
        {card.icon}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useAppContext();
  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const cards   = useMemo(() => buildCards(summary), [summary]);

  return (
    <div className="summary-grid">
      {cards.map((card, i) => <SummaryCard key={card.id} card={card} index={i} />)}
    </div>
  );
}
