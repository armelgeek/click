import React, { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts: Toast[] = [];
const listeners: Set<() => void> = new Set();

const generateId = () => Math.random().toString(36).substring(2, 15);

const emit = () => {
  listeners.forEach(listener => listener());
};

export const toastService = {
  getToasts: () => toasts,
  
  addToast: (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: generateId(),
      duration: toast.duration ?? 4000,
    };
    
    toasts.push(newToast);
    emit();
    
    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toastService.removeToast(newToast.id);
      }, newToast.duration);
    }
    
    return newToast.id;
  },
  
  removeToast: (id: string) => {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      emit();
    }
  },
  
  clearAll: () => {
    toasts.length = 0;
    emit();
  },
  
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

export function useToast() {
  const [, forceUpdate] = useState({});
  
  const refresh = useCallback(() => forceUpdate({}), []);
  
  // Subscribe to changes
  React.useEffect(() => {
    const unsubscribe = toastService.subscribe(refresh);
    return () => {
      unsubscribe();
    };
  }, [refresh]);
  
  const toast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    return toastService.addToast({ message, type, duration });
  }, []);
  
  const success = useCallback((message: string, duration?: number) => {
    return toast(message, 'success', duration);
  }, [toast]);
  
  const error = useCallback((message: string, duration?: number) => {
    return toast(message, 'error', duration);
  }, [toast]);
  
  const warning = useCallback((message: string, duration?: number) => {
    return toast(message, 'warning', duration);
  }, [toast]);
  
  const info = useCallback((message: string, duration?: number) => {
    return toast(message, 'info', duration);
  }, [toast]);
  
  const dismiss = useCallback((id: string) => {
    toastService.removeToast(id);
  }, []);
  
  const dismissAll = useCallback(() => {
    toastService.clearAll();
  }, []);
  
  return {
    toasts: toastService.getToasts(),
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}