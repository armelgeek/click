import { useEffect } from 'react';

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, open, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-red-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
