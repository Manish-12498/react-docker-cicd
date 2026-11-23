import React, { useEffect } from 'react';

export default function Alert({ alert, onClose }) {
  useEffect(() => {
    if (!alert) return undefined;
    const timer = window.setTimeout(onClose, 2800);
    return () => window.clearTimeout(timer);
  }, [alert, onClose]);
  if (!alert) return null;
  return (
    <div className={`toast toast-${alert.type || 'success'}`} role="status" aria-live="polite">
      <span className="toast-icon">{alert.type === 'error' ? '!' : '✓'}</span>
      <span>{alert.message}</span>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss notification">×</button>
    </div>
  );
}
