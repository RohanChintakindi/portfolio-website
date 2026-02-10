import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastData {
  id: number;
  title: string;
  message: string;
  type?: 'achievement' | 'info' | 'success';
}

let toastId = 0;

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastData['type'] = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type || 'info'}`}
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => onDismiss(toast.id)}
          >
            <div className="toast-header">
              {toast.type === 'achievement' && <span className="toast-badge">★</span>}
              <span className="toast-title">{toast.title}</span>
            </div>
            <div className="toast-message">{toast.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
