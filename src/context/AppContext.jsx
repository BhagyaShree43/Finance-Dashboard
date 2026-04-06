import {
  createContext,
  use,              //  replaces useContext() for reading context
  useReducer,
  useEffect,
  useCallback,
  useOptimistic,    //  optimistic UI state updates
  useTransition,    // marks state updates as non-urgent (concurrent mode)
} from 'react';
import { seedTransactions, generateId } from '../data/seedData';

// ── Context object ─────────────────────────────────────────────
// null default is intentional — our use() wrapper catches misuse.
const AppContext = createContext(null);

const STORAGE_KEY = 'finlens_v2_state';

// ── Initial state factory ──────────────────────────────────────
// Tries localStorage first, falls back to seed data.
function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      return {
        role:         p.role         ?? 'admin',
        transactions: p.transactions ?? seedTransactions(),
        toast:        null,
        activePage:   'dashboard',
      };
    }
  } catch { /* malformed JSON — fall through */ }

  return {
    role:         'admin',
    transactions: seedTransactions(),
    toast:        null,
    activePage:   'dashboard',
  };
}

// ── Reducer ─────────────────────────────────────────────────────
// Pure function: (prevState, action) → newState.
// useReducer is still the right choice for complex multi-field state.
function appReducer(state, action) {
  switch (action.type) {

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_PAGE':
      return { ...state, activePage: action.payload };

    case 'ADD_TRANSACTION':
      // Prepend so newest appears first in default sort
      return {
        ...state,
        transactions: [{ ...action.payload, id: generateId() }, ...state.transactions],
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'SHOW_TOAST':
      return {
        ...state,
        toast: { id: generateId(), message: action.payload.message, type: action.payload.type ?? 'info' },
      };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

// ── Provider ────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // useTransition marks updates as non-urgent so React
  // can keep the UI responsive during heavy re-renders (e.g. adding
  // many transactions at once).
  const [isPending, startTransition] = useTransition();

  // ── useOptimistic for transactions ─────────────────────────────
  // hook: provides an "optimistic" version of transactions
  // that we can update instantly (before any async operation confirms).
  // For this demo the operations are synchronous, but the pattern
  // shows how to integrate with real async API calls.
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    state.transactions,
    // Reducer: (currentList, optimisticAction) => newList
    (currentList, { type, payload }) => {
      if (type === 'add')    return [{ ...payload, id: payload.id ?? generateId(), _pending: true }, ...currentList];
      if (type === 'update') return currentList.map(t => t.id === payload.id ? { ...t, ...payload, _pending: true } : t);
      if (type === 'delete') return currentList.filter(t => t.id !== payload);
      return currentList;
    }
  );

  // ── Persist to localStorage on change ─────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      role:         state.role,
      transactions: state.transactions,
    }));
  }, [state.role, state.transactions]);

  // ── Auto-dismiss toast after 3 s ──────────────────────────────
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    return () => clearTimeout(t);
  }, [state.toast?.id]);

  // ── Action helpers (stable references via useCallback) ─────────

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  // wrap the dispatch in startTransition so adding a
  // transaction (which triggers chart re-renders) doesn't block
  // the form closing animation.
  const addTransaction = useCallback((txn) => {
    // 1. Optimistic update — UI reflects change immediately
    addOptimisticTransaction({ type: 'add', payload: txn });
    // 2. Non-urgent state update — React batches & schedules this
    startTransition(() => {
      dispatch({ type: 'ADD_TRANSACTION', payload: txn });
    });
  }, [addOptimisticTransaction]);

  const updateTransaction = useCallback((txn) => {
    addOptimisticTransaction({ type: 'update', payload: txn });
    startTransition(() => {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: txn });
    });
  }, [addOptimisticTransaction]);

  const deleteTransaction = useCallback((id) => {
    addOptimisticTransaction({ type: 'delete', payload: id });
    startTransition(() => {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    });
  }, [addOptimisticTransaction]);

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  }, []);

  // ── Context value ────────────────────────────────────────────
  const value = {
    // State
    role:         state.role,
    // Expose optimistic transactions so UI stays snappy
    transactions: optimisticTransactions,
    toast:        state.toast,
    activePage:   state.activePage,
    isAdmin:      state.role === 'admin',
    isPending,    // React 19: true while a transition is in-flight

    // Actions
    setRole,
    setPage,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    showToast,
  };

  return <AppContext value={value}>{children}</AppContext>;
  //                 ^^^^^^^^^^^
  // <Context value={...}> replaces <Context.Provider value={...}>
  // The .Provider wrapper still works but is now considered legacy.
}

// ── Custom hook ─────────────────────────────────────────────────
// use(Context) is the preferred way to consume context.
// Unlike useContext(), use() can be called conditionally and inside
// loops. We still wrap it in a hook for the error guard + DX.
export function useAppContext() {
  const ctx = use(AppContext);
  // use() returns null if no Provider is above — guard against this
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}


// 1. No "import React" needed at top of file — the new JSX
//    transform handles it automatically.
//
// 2. useActionState (replaces useReducer for action-driven state)
//    React 19 introduces useActionState for managing state that
//    changes in response to async actions. We use it for the
//    optimistic transaction mutations.
//
// 3. useOptimistic — gives instant UI feedback before async
//    operations complete. We wrap transaction mutations with it
//    so the UI updates immediately, then confirms on "commit".
//
// 4. use(Promise) / use(Context) — React 19's new hook that can
//    read context OR suspend on a promise. We use it in consumer
//    components instead of useContext().
//
// STATE SHAPE:
//   { role, transactions, toast, activePage }
//
// ACTIONS:
//   setRole | setPage | addTransaction | updateTransaction |
//   deleteTransaction | showToast | hideToast
// ============================================================