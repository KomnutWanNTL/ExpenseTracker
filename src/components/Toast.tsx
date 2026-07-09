import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onUndo?: () => void;
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onUndo,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-message">{message}</span>
      {onUndo && (
        <button type="button" className="toast-undo-btn" onClick={onUndo}>
          เลิกทำ
        </button>
      )}
      <button type="button" className="toast-close-btn" onClick={onClose} aria-label="ปิด">
        ✕
      </button>
    </div>
  );
}
