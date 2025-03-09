'use client';
import React, { forwardRef } from 'react';
import { create } from 'zustand';

// TYPES
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
}

export interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// ZUSTAND STORE
interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 5000; // Default duration 5 seconds

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// HELPER HOOK
export const useToast = () => {
  const { toasts, addToast, removeToast } = useToastStore();

  return {
    toasts,
    toast: (props: Omit<ToastMessage, 'id'>) => addToast(props),
    removeToast,
  };
};

// HELPER FUNCTION FOR STYLING
const getVariantClasses = (variant: ToastVariant = 'default'): string => {
  const variantClasses = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return variantClasses[variant];
};

// TOAST COMPONENT
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className = '',
      variant = 'default',
      title,
      description,
      onClose,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all';
    const variantClasses = getVariantClasses(variant);
    const toastClasses = `${baseClasses} ${variantClasses} ${className}`;

    return (
      <div ref={ref} className={toastClasses} {...props}>
        <div className="grid gap-1">
          {title && <div className="text-sm font-medium">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-hidden"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = 'Toast';

// TOAST CONTAINER COMPONENT
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end p-4 space-y-4">
      {toasts.map((toast: ToastMessage) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          onClose={() => removeToast(toast.id)}
          className="w-full md:w-96 transition-all duration-300 ease-in-out"
        />
      ))}
    </div>
  );
};
