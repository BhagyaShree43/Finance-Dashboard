import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate, exportToCSV } from '../utils/helpers';
import { CATEGORY_META } from '../data/seedData';
import TransactionModal from './TransactionModal';
import './TransactionsPage.css';

// ── Sort-able column header ───────────────────────────────────
function SortHeader({ label, colKey, activeSortKey, sortDir, onSort }) {
  const active = activeSortKey === colKey;
  return (
    <th
      className={`txn-th${active ? ' txn-th--active' : ''}`}
      onClick={() => onSort(colKey)}
      aria-sort={active ? sortDir : 'none'}
    >
      {label}{active && <span className="sort-arrow">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>}
    </th>
  );
}

// ── Single transaction row ────────────────────────────────────
function TxnRow({ txn, isAdmin, onEdit, onDelete }) {
  const meta = CATEGORY_META[txn.category] ?? { emoji: '📦', color: '#8899b0' };
  return (
    <tr className={`txn-row${txn._pending ? ' txn-row--pending' : ''}`}>
      <td>
        <div className="txn-name-cell">
          <span className="txn-cat-icon" style={{ background: `${meta.color}22` }}>{meta.emoji}</span>
          <span className="txn-name">{txn.name}</span>
        </div>
      </td>
      <td className="txn-category">{txn.category}</td>
      <td className="font-mono" style={{ fontSize: 12 }}>{formatDate(txn.date)}</td>
      <td className={`txn-amount font-mono txn-amount--${txn.type}`}>
        {txn.type === 'income' ? '+' : '−'} {formatCurrency(txn.amount)}
      </td>
      <td><span className={`type-badge type-badge--${txn.type}`}>{txn.type}</span></td>
      {isAdmin && (
        <td>
          <div className="action-btns">
            <button className="icon-btn" onClick={() => onEdit(txn)} title="Edit">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button className="icon-btn icon-btn--danger" onClick={() => onDelete(txn.id)} title="Delete">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────
export default function TransactionsPage() {
  const { isAdmin, deleteTransaction, showToast } = useAppContext();

  const {
    filters, setFilter,
    sortKey, sortDir, setSort,
    currentPage, totalPages, setPage,
    visibleTransactions,
    filteredTransactions,
    filteredCount,
    categories,
  } = useTransactions();

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  function handleEdit(txn) { setEditTarget(txn); setModalOpen(true); }
  function handleAdd()      { setEditTarget(null); setModalOpen(true); }

  function handleDelete(id) {
    if (!window.confirm('Delete this transaction?')) return;
    deleteTransaction(id);
    showToast('Transaction deleted.', 'info');
  }

  function handleExport() {
    exportToCSV(filteredTransactions, 'finlens-transactions');
    showToast(`Exported ${filteredTransactions.length} transactions.`, 'success');
  }

  const perPage = 8;
  const startRow = (currentPage - 1) * perPage + 1;
  const endRow   = Math.min(currentPage * perPage, filteredCount);

  return (
    <div className="txn-page">
      <div className="section-heading">
        <h2 className="section-title">Transactions</h2>
        <span className="section-sub">All financial activity</span>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="txn-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          aria-label="Search"
        />

        <select
          className="filter-select"
          value={filters.type}
          onChange={e => setFilter('type', e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={e => setFilter('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={{ flex: 1 }} />

        <button className="btn-secondary" onClick={handleExport}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export CSV
        </button>

        {isAdmin && (
          <button className="btn-primary" onClick={handleAdd}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Add Transaction
          </button>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="table-wrap">
        <table className="txn-table">
          <thead>
            <tr>
              <SortHeader label="Description" colKey="name"     activeSortKey={sortKey} sortDir={sortDir} onSort={setSort} />
              <SortHeader label="Category"    colKey="category" activeSortKey={sortKey} sortDir={sortDir} onSort={setSort} />
              <SortHeader label="Date"        colKey="date"     activeSortKey={sortKey} sortDir={sortDir} onSort={setSort} />
              <SortHeader label="Amount"      colKey="amount"   activeSortKey={sortKey} sortDir={sortDir} onSort={setSort} />
              <th className="txn-th">Type</th>
              {isAdmin && <th className="txn-th">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.length > 0
              ? visibleTransactions.map(txn => (
                  <TxnRow
                    key={txn.id}
                    txn={txn}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5}>
                    <div className="empty-state">
                      <div className="empty-state__icon">🔍</div>
                      <p>No transactions match your filters.</p>
                      {(filters.search || filters.type !== 'all' || filters.category !== 'all') && (
                        <button
                          className="btn-secondary"
                          style={{ marginTop: 12 }}
                          onClick={() => { setFilter('search',''); setFilter('type','all'); setFilter('category','all'); }}
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>

        {/* ── Pagination ──────────────────────────────────────── */}
        <div className="pagination">
          <span className="pagination__info">
            {filteredCount === 0 ? 'No results' : `Showing ${startRow}–${endRow} of ${filteredCount}`}
          </span>
          <div className="pagination__btns">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`page-btn${p === currentPage ? ' page-btn--active' : ''}`}
                onClick={() => setPage(p)}
              >{p}</button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      </div>

      {/* Modal — admin only */}
      {isAdmin && (
        <TransactionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editTarget={editTarget}
        />
      )}
    </div>
  );
}
