import { useEffect, useActionState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import './TransactionModal.css';

const EMPTY = {
  name: '', amount: '', type: 'expense',
  category: 'Food & Dining',
  date: new Date().toISOString().split('T')[0],
};

export default function TransactionModal({ isOpen, onClose, editTarget }) {
  const { addTransaction, updateTransaction, showToast } = useAppContext();

  // ── useActionState ──────────────────────────────
  // Signature: useActionState(actionFn, initialState)
  // Returns:   [state, formAction, isPending]
  //
  // actionFn receives (prevState, formData) — formData is the
  // native FormData from the <form> submission. This makes the
  // component progressively enhanced: it works with or without JS.
  const [formError, saveAction, isSaving] = useActionState(
    async (prevError, formData) => {
      // Extract field values from FormData
      const name     = formData.get('name')?.trim() ?? '';
      const amount   = parseFloat(formData.get('amount'));
      const type     = formData.get('type');
      const category = formData.get('category');
      const date     = formData.get('date');

      // Validation — return error string if invalid
      if (!name)          return 'Please enter a description.';
      if (!amount || amount <= 0) return 'Please enter a valid positive amount.';
      if (!date)          return 'Please select a date.';

      const payload = { name, amount, type, category, date };

      if (editTarget) {
        updateTransaction({ ...payload, id: editTarget.id });
        showToast('Transaction updated.', 'success');
      } else {
        addTransaction(payload);
        showToast('Transaction added.', 'success');
      }

      onClose();
      return null; // null = no error
    },
    null // initial error state
  );

  // ── Populate form for edit mode ────────────────────────────
  // we use a key on the <form> to force a full remount
  // when switching between add/edit, which resets all controlled fields.
  // This is cleaner than manually resetting each field in useEffect.
  const formKey = editTarget ? `edit-${editTarget.id}` : 'add-new';

  // ── Close on Escape ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={editTarget ? 'Edit transaction' : 'Add transaction'}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title">
            {editTarget ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Error message from useActionState */}
        {formError && (
          <div className="modal__error" role="alert">{formError}</div>
        )}

        {/*
          React 19: <form action={saveAction}> — passing an async function
          as the action prop is a React 19 feature. The form calls this
          function with FormData on submit. No onSubmit handler needed.
          key={formKey} resets all uncontrolled inputs when editTarget changes.
        */}
        <form key={formKey} action={saveAction}>

          <div className="form-group">
            <label className="form-label" htmlFor="f-name">Description</label>
            <input
              id="f-name"
              name="name"
              className="form-input"
              type="text"
              placeholder="e.g. Netflix subscription"
              defaultValue={editTarget?.name ?? ''}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="f-amount">Amount ($)</label>
              <input
                id="f-amount"
                name="amount"
                className="form-input"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                defaultValue={editTarget?.amount ?? ''}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="f-type">Type</label>
              <select
                id="f-type"
                name="type"
                className="form-select"
                defaultValue={editTarget?.type ?? 'expense'}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="f-category">Category</label>
              <select
                id="f-category"
                name="category"
                className="form-select"
                defaultValue={editTarget?.category ?? 'Food & Dining'}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="f-date">Date</label>
              <input
                id="f-date"
                name="date"
                className="form-input"
                type="date"
                defaultValue={editTarget?.date ?? new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {/*
              React 19: isSaving is true while the action runs.
              Disable the button to prevent double-submission.
            */}
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
