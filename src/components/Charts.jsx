// Uses Chart.js for two charts:
//   TrendChart  → line chart of monthly net balance (time-based)
//   DonutChart  → spending breakdown by category (categorical)
// canvas DOM node, which lives outside the virtual DOM.

import { useRef, useEffect, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { useAppContext } from '../context/AppContext';
import { getMonthlyData, getCategoryTotals } from '../utils/helpers';
import { CATEGORY_META } from '../data/seedData';
import './Charts.css';

Chart.register(...registerables);
Chart.defaults.color       = '#8899b0';
Chart.defaults.borderColor = '#1f2d45';
Chart.defaults.font.family = "'DM Sans', sans-serif";

// ── Trend Line Chart ───────────────────────────────────────────
function TrendChart({ transactions }) {
  const canvasRef     = useRef(null);
  const chartInstance = useRef(null);
  const monthlyData   = useMemo(() => getMonthlyData(transactions), [transactions]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx  = canvasRef.current.getContext('2d');
    // Always destroy before recreating — prevents "canvas already in use" error
    chartInstance.current?.destroy();

    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, 'rgba(212,168,75,0.35)');
    grad.addColorStop(1, 'rgba(212,168,75,0)');

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [{
          label: 'Net Balance',
          data: monthlyData.net,
          borderColor: '#d4a84b',
          backgroundColor: grad,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#d4a84b',
          pointBorderColor: '#0b0f1a',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a2234', borderColor: '#1f2d45', borderWidth: 1, padding: 12,
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.y;
                return ` ${v >= 0 ? '+' : ''}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(31,45,69,0.8)' }, ticks: { callback: v => '$' + v.toLocaleString() } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [monthlyData]);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">Balance Trend</span>
        <span className="chart-pill">Last 6 months</span>
      </div>
      <div className="chart-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ── Donut Chart ────────────────────────────────────────────────
function DonutChart({ transactions }) {
  const canvasRef     = useRef(null);
  const chartInstance = useRef(null);
  const catTotals     = useMemo(() => getCategoryTotals(transactions), [transactions]);

  const labels = catTotals.map(([c]) => c);
  const values = catTotals.map(([, v]) => v);
  const colors = labels.map(l => CATEGORY_META[l]?.color ?? '#8899b0');
  const total  = values.reduce((s, v) => s + v, 0);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartInstance.current?.destroy();

    chartInstance.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#111827',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a2234', borderColor: '#1f2d45', borderWidth: 1,
            callbacks: {
              label: (ctx) => {
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: $${ctx.parsed.toLocaleString()} (${pct}%)`;
              },
            },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [catTotals]);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">Spending Breakdown</span>
        <span className="chart-pill">By category</span>
      </div>
      <div className="chart-canvas-wrap chart-canvas-wrap--sm">
        <canvas ref={canvasRef} />
      </div>
      {/* Custom legend */}
      <div className="donut-legend">
        {labels.slice(0, 5).map((label, i) => (
          <div key={label} className="donut-legend__row">
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span className="donut-legend__dot" style={{ background: colors[i] }} />
              <span className="donut-legend__label">{label}</span>
            </div>
            <span className="donut-legend__pct">
              {total > 0 ? ((values[i] / total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Charts() {
  const { transactions } = useAppContext();
  return (
    <div className="charts-grid">
      <TrendChart  transactions={transactions} />
      <DonutChart  transactions={transactions} />
    </div>
  );
}
