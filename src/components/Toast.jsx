import { useAppContext } from '../context/AppContext';
import './Toast.css';

const ICONS = { success: '✓', error: '✕', info: '●' };

export default function Toast() {
  const { toast } = useAppContext();
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div
        key={toast.id}          /* forces CSS animation replay */
        className={`toast toast--${toast.type}`}
        role="status"
        aria-live="polite"
      >
        <span className={`toast__icon toast__icon--${toast.type}`}>
          {ICONS[toast.type] ?? '●'}
        </span>
        <span className="toast__message">{toast.message}</span>
      </div>
    </div>
  );
}
