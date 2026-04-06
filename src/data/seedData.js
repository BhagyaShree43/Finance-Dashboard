/**
 * CATEGORY_META
 * Visual config per spending/income category.
 * Used by: table rows, donut chart, insights list, modal dropdown.
 */
export const CATEGORY_META = {
  'Food & Dining':  { emoji: '🍽', color: '#e05c6f' },
  'Shopping':       { emoji: '🛍', color: '#f5a623' },
  'Transport':      { emoji: '🚗', color: '#4a90e2' },
  'Entertainment':  { emoji: '🎬', color: '#9b6dff' },
  'Health':         { emoji: '💊', color: '#2ecc8f' },
  'Utilities':      { emoji: '💡', color: '#1abc9c' },
  'Housing':        { emoji: '🏠', color: '#d4a84b' },
  'Salary':         { emoji: '💼', color: '#2ecc8f' },
  'Freelance':      { emoji: '💻', color: '#4a90e2' },
  'Investment':     { emoji: '📈', color: '#9b6dff' },
  'Other':          { emoji: '📦', color: '#8899b0' },
};

/** Flat list of category names — used to populate <select> dropdowns */
export const CATEGORIES = Object.keys(CATEGORY_META);

/** Generates a short random alphanumeric ID */
export const generateId = () => Math.random().toString(36).slice(2, 10);

/**
 * seedTransactions()
 * Returns 46 realistic mock transactions spread across 6 months.
 * Uses the current year so charts always display "this year" data.
 *
 * Transaction shape:
 * {
 *   id:       string            unique client-side identifier
 *   name:     string            human-readable description
 *   type:     'income'|'expense'
 *   category: string            must be a key in CATEGORY_META
 *   amount:   number            always positive; sign implied by type
 *   date:     string            ISO 'YYYY-MM-DD'
 * }
 */
export function seedTransactions() {
  const y = new Date().getFullYear(); // current year

  const raw = [
    // ── INCOME ──────────────────────────────────────────────────
    { name: 'Monthly Salary',       type: 'income',  category: 'Salary',        amount: 5800, date: `${y}-01-05` },
    { name: 'Monthly Salary',       type: 'income',  category: 'Salary',        amount: 5800, date: `${y}-02-05` },
    { name: 'Monthly Salary',       type: 'income',  category: 'Salary',        amount: 5800, date: `${y}-03-05` },
    { name: 'Monthly Salary',       type: 'income',  category: 'Salary',        amount: 6200, date: `${y}-04-05` },
    { name: 'Monthly Salary',       type: 'income',  category: 'Salary',        amount: 6200, date: `${y}-05-05` },
    { name: 'Monthly Salary',       type: 'income',  category: 'Salary',        amount: 6200, date: `${y}-06-05` },
    { name: 'Freelance Project',    type: 'income',  category: 'Freelance',     amount: 1200, date: `${y}-01-18` },
    { name: 'UI Design Contract',   type: 'income',  category: 'Freelance',     amount: 2400, date: `${y}-03-22` },
    { name: 'Stock Dividends',      type: 'income',  category: 'Investment',    amount:  340, date: `${y}-02-28` },
    { name: 'Stock Dividends',      type: 'income',  category: 'Investment',    amount:  420, date: `${y}-05-31` },

    // ── HOUSING ──────────────────────────────────────────────────
    { name: 'Rent',                 type: 'expense', category: 'Housing',       amount: 1500, date: `${y}-01-01` },
    { name: 'Rent',                 type: 'expense', category: 'Housing',       amount: 1500, date: `${y}-02-01` },
    { name: 'Rent',                 type: 'expense', category: 'Housing',       amount: 1500, date: `${y}-03-01` },
    { name: 'Rent',                 type: 'expense', category: 'Housing',       amount: 1500, date: `${y}-04-01` },
    { name: 'Rent',                 type: 'expense', category: 'Housing',       amount: 1500, date: `${y}-05-01` },
    { name: 'Rent',                 type: 'expense', category: 'Housing',       amount: 1500, date: `${y}-06-01` },

    // ── FOOD & DINING ─────────────────────────────────────────────
    { name: 'Grocery Run',          type: 'expense', category: 'Food & Dining', amount:  320, date: `${y}-01-08` },
    { name: 'Restaurant Dinner',    type: 'expense', category: 'Food & Dining', amount:   85, date: `${y}-01-20` },
    { name: 'Grocery Run',          type: 'expense', category: 'Food & Dining', amount:  295, date: `${y}-02-10` },
    { name: 'Coffee Subscription',  type: 'expense', category: 'Food & Dining', amount:   45, date: `${y}-03-01` },
    { name: 'Grocery Run',          type: 'expense', category: 'Food & Dining', amount:  310, date: `${y}-04-07` },
    { name: 'Takeaway Week',        type: 'expense', category: 'Food & Dining', amount:  120, date: `${y}-05-15` },
    { name: 'Grocery Run',          type: 'expense', category: 'Food & Dining', amount:  285, date: `${y}-06-09` },

    // ── TRANSPORT ────────────────────────────────────────────────
    { name: 'Fuel',                 type: 'expense', category: 'Transport',     amount:   80, date: `${y}-01-12` },
    { name: 'Uber Rides',           type: 'expense', category: 'Transport',     amount:   65, date: `${y}-02-18` },
    { name: 'Car Service',          type: 'expense', category: 'Transport',     amount:  280, date: `${y}-03-15` },
    { name: 'Fuel',                 type: 'expense', category: 'Transport',     amount:   90, date: `${y}-04-20` },

    // ── ENTERTAINMENT ─────────────────────────────────────────────
    { name: 'Netflix',              type: 'expense', category: 'Entertainment', amount:   18, date: `${y}-01-15` },
    { name: 'Spotify Premium',      type: 'expense', category: 'Entertainment', amount:   11, date: `${y}-01-15` },
    { name: 'Cinema Night',         type: 'expense', category: 'Entertainment', amount:   55, date: `${y}-02-22` },
    { name: 'Netflix',              type: 'expense', category: 'Entertainment', amount:   18, date: `${y}-03-15` },
    { name: 'Concert Tickets',      type: 'expense', category: 'Entertainment', amount:  160, date: `${y}-04-10` },
    { name: 'Netflix',              type: 'expense', category: 'Entertainment', amount:   18, date: `${y}-05-15` },

    // ── UTILITIES ─────────────────────────────────────────────────
    { name: 'Electricity Bill',     type: 'expense', category: 'Utilities',     amount:  110, date: `${y}-01-25` },
    { name: 'Internet Bill',        type: 'expense', category: 'Utilities',     amount:   60, date: `${y}-02-25` },
    { name: 'Electricity Bill',     type: 'expense', category: 'Utilities',     amount:   95, date: `${y}-03-25` },
    { name: 'Electricity Bill',     type: 'expense', category: 'Utilities',     amount:  120, date: `${y}-05-25` },

    // ── HEALTH ────────────────────────────────────────────────────
    { name: 'Gym Membership',       type: 'expense', category: 'Health',        amount:   50, date: `${y}-01-01` },
    { name: 'Doctor Visit',         type: 'expense', category: 'Health',        amount:  120, date: `${y}-02-14` },
    { name: 'Gym Membership',       type: 'expense', category: 'Health',        amount:   50, date: `${y}-03-01` },
    { name: 'Pharmacy',             type: 'expense', category: 'Health',        amount:   35, date: `${y}-04-05` },

    // ── SHOPPING ──────────────────────────────────────────────────
    { name: 'New Shoes',            type: 'expense', category: 'Shopping',      amount:  135, date: `${y}-02-08` },
    { name: 'Amazon Order',         type: 'expense', category: 'Shopping',      amount:   88, date: `${y}-03-19` },
    { name: 'Clothing Haul',        type: 'expense', category: 'Shopping',      amount:  220, date: `${y}-04-17` },
    { name: 'Tech Accessories',     type: 'expense', category: 'Shopping',      amount:   95, date: `${y}-05-22` },
  ];

  return raw.map(t => ({ ...t, id: generateId() }));
}
