import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { computeSummary, getCategoryTotals, getMonthlyData, formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORY_META } from '../data/seedData';
import './InsightsPage.css';

// ── Small sub-components ──────────────────────────────────────

function InsightCard({ tag, tagVariant, title, value, body }) {
  return (
    <div className="insight-card">
      <span className={`insight-tag insight-tag--${tagVariant}`}>{tag}</span>
      <p className="insight-card__title">{title}</p>
      <p className="insight-card__value font-mono">{value}</p>
      <p className="insight-card__body">{body}</p>
    </div>
  );
}

function MonthlyBars({ monthlyData }) {
  const max = Math.max(...monthlyData.expenses, 1);
  return (
    <div className="insight-card insight-card--wide">
      <p className="insight-card__title" style={{ marginBottom: 20 }}>Monthly Spending Comparison</p>
      <div className="month-bars">
        {monthlyData.labels.map((label, i) => {
          const pct = ((monthlyData.expenses[i] / max) * 100).toFixed(1);
          return (
            <div key={label} className="month-row">
              <span className="month-row__label">{label}</span>
              <div className="month-row__track">
                <div className="month-row__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="month-row__value">{formatCurrency(monthlyData.expenses[i])}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryBreakdown({ catTotals }) {
  const totalExp = catTotals.reduce((s, [, v]) => s + v, 0);
  return (
    <div className="insight-card">
      <p className="insight-card__title" style={{ marginBottom: 12 }}>Category Breakdown</p>
      <div className="cat-list">
        {catTotals.slice(0, 7).map(([cat, amt]) => {
          const meta = CATEGORY_META[cat] ?? { emoji: '📦', color: '#8899b0' };
          const pct  = totalExp > 0 ? ((amt / totalExp) * 100).toFixed(1) : '0.0';
          return (
            <div key={cat} className="cat-row">
              <div className="cat-row__left">
                <span className="cat-row__emoji" style={{ background: `${meta.color}22` }}>{meta.emoji}</span>
                <div>
                  <p className="cat-row__name">{cat}</p>
                  <p className="cat-row__pct">{pct}% of expenses</p>
                </div>
              </div>
              <span className="cat-row__amount">{formatCurrency(amt)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function InsightsPage() {
  const { transactions } = useAppContext();

  const summary     = useMemo(() => computeSummary(transactions), [transactions]);
  const catTotals   = useMemo(() => getCategoryTotals(transactions), [transactions]);
  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);

  const [topCat, topCatAmt] = catTotals[0] ?? ['—', 0];
  const topCatPct  = summary.expenses > 0 ? ((topCatAmt / summary.expenses) * 100).toFixed(1) : '0.0';
  const monthsSpan = new Set(transactions.map(t => t.date.slice(0, 7))).size || 1;
  const avgPerMonth = (transactions.length / monthsSpan).toFixed(1);
  const expenses    = transactions.filter(t => t.type === 'expense');
  const largest     = expenses.length > 0
    ? expenses.reduce((m, t) => t.amount > m.amount ? t : m, expenses[0])
    : null;

  const cards = [
    {
      tag: '⚠ Top Spend', tagVariant: 'warning',
      title: 'Highest Spending Category',
      value: formatCurrency(topCatAmt),
      body:  `${topCat} accounts for ${topCatPct}% of total spending.`,
    },
    {
      tag: '✓ Savings', tagVariant: 'success',
      title: 'Net Savings This Period',
      value: formatCurrency(summary.balance),
      body:  summary.balance >= 0
        ? `Saved ${formatCurrency(summary.balance)} — great work!`
        : `Overspending by ${formatCurrency(Math.abs(summary.balance))}.`,
    },
    {
      tag: '📊 Frequency', tagVariant: 'info',
      title: 'Transaction Frequency',
      value: `${avgPerMonth}/mo`,
      body:  `Averaging ${avgPerMonth} transactions/month across ${transactions.length} total.`,
    },
    {
      tag: '💸 Largest', tagVariant: 'purple',
      title: 'Largest Single Expense',
      value: largest ? formatCurrency(largest.amount) : '—',
      body:  largest ? `${largest.name} on ${formatDate(largest.date)}` : 'No expense transactions found.',
    },
  ];

  return (
    <div className="insights-page">
      <div className="section-heading">
        <h2 className="section-title">Insights</h2>
        <span className="section-sub">Spending patterns & analysis</span>
      </div>

      <div className="insights-grid">
        {cards.map((c, i) => <InsightCard key={i} {...c} />)}
      </div>

      <div className="insights-bottom-grid">
        <MonthlyBars    monthlyData={monthlyData} />
        <CategoryBreakdown catTotals={catTotals} />
      </div>
    </div>
  );
}
