"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Types
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Individual Toast Component
const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const getStyles = () => {
    const base = `
      relative flex items-center p-4 mb-3 rounded-lg shadow-lg
      transition-all duration-300 ease-in-out transform
      ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      min-w-[320px] max-w-[500px]
    `;

    switch (toast.type) {
      case 'success':
        return `${base} bg-green-50 border-l-4 border-green-400 text-green-800`;
      case 'error':
        return `${base} bg-red-50 border-l-4 border-red-400 text-red-800`;
      case 'info':
        return `${base} bg-blue-50 border-l-4 border-blue-400 text-blue-800`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ⓘ';
    }
  };

  const getIconStyles = () => {
    const base = 'flex-shrink-0 w-6 h-6 mr-3 rounded-full flex items-center justify-center text-white font-bold text-sm';
    switch (toast.type) {
      case 'success': return `${base} bg-green-400`;
      case 'error': return `${base} bg-red-400`;
      case 'info': return `${base} bg-blue-400`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className={getIconStyles()}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-4 flex-shrink-0 rounded-full p-1 hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
        aria-label="Dismiss"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  );
};

// Toast Container
const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>,
    document.body
  );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => {
    addToast(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    addToast(message, 'error', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    addToast(message, 'info', duration);
  };

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      showSuccess,
      showError,
      showInfo,
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Custom Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};



