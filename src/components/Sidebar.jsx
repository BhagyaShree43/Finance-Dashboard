import { useAppContext } from '../context/AppContext';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3"  y="3"  width="7" height="7" rx="1"/>
        <rect x="14" y="3"  width="7" height="7" rx="1"/>
        <rect x="3"  y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activePage, setPage, role, setRole, isAdmin, showToast } = useAppContext();

  function handleNav(pageId) {
    setPage(pageId);
    onClose();
  }

  function handleRoleChange(e) {
    const r = e.target.value;
    setRole(r);
    showToast(`Switched to ${r === 'admin' ? 'Admin' : 'Viewer'} mode`, 'info');
  }

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>

      {/* Logo */}
      <div className="sidebar__logo">
        <div className="logo-mark">
          <div className="logo-icon">FD</div>
          <span className="logo-text">Finance<span className="logo-accent">Dashboard</span></span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        <span className="nav-section-label">Menu</span>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activePage === item.id ? ' nav-item--active' : ''}`}
            onClick={() => handleNav(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <span className="nav-item__icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Role switcher */}
      <div className="sidebar__footer">
        <p className="role-label">Active Role</p>
        <select
          className="role-select"
          value={role}
          onChange={handleRoleChange}
          aria-label="Switch user role"
        >
          <option value="admin">Administrator</option>
          <option value="viewer">Viewer (Read-only)</option>
        </select>
        <div className={`role-badge role-badge--${role}`}>
          <span className="role-badge__dot" />
          {isAdmin ? 'Admin' : 'Viewer'}
        </div>
      </div>
    </aside>
  );
}
