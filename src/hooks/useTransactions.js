// Extracts all filter, sort, and pagination logic out of the
// TransactionsPage component, keeping it lean and readable.

import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { applyFiltersAndSort } from '../utils/helpers';

const PER_PAGE = 8;

export function useTransactions() {
  const { transactions } = useAppContext();

  // ── Filter state ───────────────────────────────────────────
  const [filters, setFilters] = useState({
    search:   '',
    type:     'all',
    category: 'all',
  });

  // ── Sort state ─────────────────────────────────────────────
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // ── Pagination state ───────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ── Unique category list for dropdown ─────────────────────
  const categories = useMemo(
    () => [...new Set(transactions.map(t => t.category))].sort(),
    [transactions]
  );

  // ── Filtered + sorted result ───────────────────────────────
  const filteredTransactions = useMemo(
    () => applyFiltersAndSort(transactions, filters, sortKey, sortDir),
    [transactions, filters, sortKey, sortDir]
  );

  // ── Pagination ─────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PER_PAGE));

  const visibleTransactions = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start    = (safePage - 1) * PER_PAGE;
    return filteredTransactions.slice(start, start + PER_PAGE);
  }, [filteredTransactions, currentPage, totalPages]);

  // ── Actions ────────────────────────────────────────────────
  function setFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // reset on filter change
  }

  function setSort(key) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setCurrentPage(1);
  }

  return {
    filters, setFilter,
    sortKey, sortDir, setSort,
    currentPage, totalPages,
    setPage: setCurrentPage,
    visibleTransactions,
    filteredTransactions,
    filteredCount: filteredTransactions.length,
    categories,
  };
}
