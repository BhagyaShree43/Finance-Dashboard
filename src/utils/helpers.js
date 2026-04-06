// All functions here are pure: same input → same output,
// no side effects. This makes them trivially testable and
// safe to call from anywhere (render, effect, reducer, etc.)
// ============================================================

/** Format a number as USD currency string. Always shows absolute value. */
export function formatCurrency(amount) {
  return '$' + Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format ISO date string to a human-readable form.
 * We append 'T00:00:00' to force LOCAL timezone parsing —
 * without it, '2025-01-05' parses as UTC midnight and can
 * display as Jan 4 in UTC-behind timezones.
 */
export function formatDate(dateString) {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

/**
 * computeSummary(transactions)
 * Derives the four top-line KPIs from the full transaction list.
 * Called whenever transactions array changes.
 */
export function computeSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance     = income - expenses;
  const savingsRate = income > 0
    ? Number(((income - expenses) / income * 100).toFixed(1))
    : 0;

  return { income, expenses, balance, savingsRate };
}

/**
 * getCategoryTotals(transactions)
 * Aggregates expense totals by category, sorted highest → lowest.
 * Returns array of [categoryName, totalAmount] tuples.
 */
export function getCategoryTotals(transactions) {
  const totals = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

/**
 * getMonthlyData(transactions, numMonths = 6)
 * Builds month-by-month income/expense/net arrays for trend charts.
 * Steps backward numMonths from today.
 */
export function getMonthlyData(transactions, numMonths = 6) {
  const now = new Date();
  const labels = [], income = [], expenses = [], net = [];

  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear(), m = d.getMonth();

    const slice = transactions.filter(t => {
      const td = new Date(t.date + 'T00:00:00');
      return td.getFullYear() === y && td.getMonth() === m;
    });

    const inc = slice.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = slice.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    labels.push(d.toLocaleString('en-US', { month: 'short' }));
    income.push(inc);
    expenses.push(exp);
    net.push(+(inc - exp).toFixed(2));
  }

  return { labels, income, expenses, net };
}

/**
 * applyFiltersAndSort(transactions, filters, sortKey, sortDir)
 * Pure filter + sort. Returns a new array — never mutates input.
 */
export function applyFiltersAndSort(transactions, filters, sortKey, sortDir) {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  if (filters.type !== 'all')     result = result.filter(t => t.type === filters.type);
  if (filters.category !== 'all') result = result.filter(t => t.category === filters.category);

  result.sort((a, b) => {
    let av, bv;
    if (sortKey === 'date')        { av = new Date(a.date); bv = new Date(b.date); }
    else if (sortKey === 'amount') { av = a.amount; bv = b.amount; }
    else                           { av = (a[sortKey] || '').toLowerCase(); bv = (b[sortKey] || '').toLowerCase(); }
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  return result;
}

/**
 * exportToCSV(transactions, filename)
 * Serialises transactions to CSV and triggers browser download.
 * Uses Blob + Object URL — no server required.
 */
export function exportToCSV(transactions, filename = 'finlens-export') {
  const rows = [
    ['Date', 'Description', 'Category', 'Type', 'Amount'],
    ...transactions.map(t => [t.date, `"${t.name}"`, t.category, t.type, t.amount.toFixed(2)]),
  ];
  const csv  = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: `${filename}.csv` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
