interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose?: () => void;
  onAction?: () => void;
  actionText?: string;
}

export default function Toast({ message, type = 'error', onClose, onAction, actionText }: ToastProps) {
  const colors = {
    error: 'bg-danger text-white',
    success: 'bg-success text-white',
    info: 'bg-primary text-white',
  };

  return (
    <div
      className={`toast show position-fixed top-0 end-0 p-3 ${colors[type]} border-0`}
      style={{ zIndex: 9999, marginTop: '20px', marginRight: '20px' }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-body d-flex align-items-center justify-content-between">
        <span className="me-2">{message}</span>
        <div className="d-flex gap-2">
          {onAction && actionText && (
            <button
              className="btn btn-sm btn-light"
              onClick={onAction}
            >
              {actionText}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          )}
        </div>
      </div>
    </div>
  );
}
