# Finance Dashboard

> A production-quality finance dashboard built with **React 19**, **Chart.js 4**, and plain **CSS Custom Properties**. 

---

## Quick Start

```bash
# 1. Install dependencies (React 19 + Vite 6)
npm install

# 2. Start dev server
npm run dev
# Opens automatically at http://localhost:5173

# 3. Production build
npm run build
npm run preview   # preview the production build locally
```

## Project Structure

```
Finance Dashboard/
├── index.html                  HTML entry point (Vite 6 root)
├── vite.config.js              Vite 6 + @vitejs/plugin-react config
├── package.json                React 19 dependencies
│
└── src/
    ├── main.jsx                createRoot() entry — no import React
    ├── App.jsx                 Layout shell: sidebar + main + page switch
    ├── App.css                 Shell layout styles
    ├── globals.css             Design tokens, reset, animations
    │
    ├── context/
    │   └── AppContext.jsx      useReducer + use() + useOptimistic + useActionState
    │
    ├── data/
    │   └── seedData.js         Mock transactions (46 entries, 6 months)
    │
    ├── hooks/
    │   └── useTransactions.js  Filter / sort / paginate custom hook
    │
    ├── utils/
    │   └── helpers.js          Pure utility functions
    │
    └── components/
        ├── Sidebar.jsx/.css            Left nav + role switcher
        ├── TopBar.jsx/.css             Sticky header
        ├── DashboardPage.jsx/.css      Overview page shell
        ├── SummaryCards.jsx/.css       4 KPI cards (balance, income…)
        ├── Charts.jsx/.css             Chart.js line + donut
        ├── TransactionsPage.jsx/.css   Table with filter/sort/pagination
        ├── TransactionModal.jsx/.css   useActionState form (admin)
        ├── InsightsPage.jsx/.css       Analytics + bars + categories
        └── Toast.jsx/.css              Floating notification
```

--------------------------

## Feature 

# Dashboard Overview

4 KPI Summary Cards — Total Balance, Total Income, Total Expenses, and Savings Rate with staggered entrance animations
Balance Trend Chart — 6-month line chart with gradient fill showing net balance over time (Chart.js)
Spending Breakdown Chart — Doughnut chart with custom legend showing categorical spending percentages
Admin Role Banner — Contextual notice shown only when in admin mode

# Transactions

Paginated Transaction Table — 8 rows per page with smooth pagination controls
Real-Time Search — Filter by transaction name or category as you type
Type Filter — Filter by Income, Expense, or show All
Category Filter — Dynamically populated from actual transaction data
Multi-Column Sort — Click any column header to sort ascending or descending
CSV Export — Exports the currently filtered view (not all data) to a downloadable CSV file
Empty State Handling — Shows a helpful message with a "Clear Filters" button when no results match

# Role-Based UI (RBAC)

Admin Mode — Full access: add, edit, and delete transactions; see action columns and admin banner
Viewer Mode — Read-only: all write controls are hidden via conditional rendering (not CSS display:none)
Persistent Role — Role preference saved to localStorage and restored on page reload
Instant Role Switch — Dropdown in sidebar; UI re-renders immediately with a toast confirmation

# Insights

Top Spending Category — Identifies which category takes the largest share of expenses
Net Savings Analysis — Shows whether you're saving or overspending with actionable context
Transaction Frequency — Average transactions per month across the tracked period
Largest Single Expense — Surfaces the biggest one-off expense with date
Monthly Comparison Bars — Pure CSS animated horizontal bars comparing 6 months of spending
Category Breakdown List — Ranked list with emoji icons, percentages, and total amounts

# UX & Polish

Toast Notifications — Auto-dismissing (3s) feedback for add, edit, delete, export, and role switch
Loading Skeletons — Glassmorphic shimmer placeholders during async operations
Responsive Design — Fully functional from 320px mobile to 4K desktop
localStorage Persistence — All transactions and role preference survive page reloads
46 Seed Transactions — Realistic mock data spanning 6 months for meaningful chart rendering

-------------------------

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19.0 |
| React DOM | 19.0 |
| Chart.js | 4.4 |
| Vite | 6.0 |
| @vitejs/plugin-react | 4.3 |
