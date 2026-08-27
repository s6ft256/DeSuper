import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning" | "achievement";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  icon?: string;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => void;
  removeToast: (id: string) => void;
  success: (message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => void;
  error: (message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => void;
  info: (message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => void;
  warning: (message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => void;
  achievement: (message: string, icon?: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", options?: Partial<Omit<Toast, "id" | "message" | "type">>) => {
      const id = crypto.randomUUID();
      const duration = options?.duration ?? 3500;

      setToasts((prev) => [
        ...prev,
        { id, message, type, ...options, duration },
      ]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => addToast(message, "success", options), [addToast]);
  const error = useCallback((message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => addToast(message, "error", { duration: 5000, ...options }), [addToast]);
  const info = useCallback((message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => addToast(message, "info", options), [addToast]);
  const warning = useCallback((message: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => addToast(message, "warning", options), [addToast]);
  const achievement = useCallback((message: string, icon?: string, options?: Partial<Omit<Toast, "id" | "message" | "type">>) => addToast(message, "achievement", { icon, duration: 5000, ...options }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning, achievement }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

const toastStyles: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-300", icon: "✓" },
  error: { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-300", icon: "✕" },
  info: { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-300", icon: "ℹ" },
  warning: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-300", icon: "⚠" },
  achievement: { bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-300", icon: "🏆" },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.border} ${style.text} border rounded-xl px-4 py-3 font-mono text-sm flex items-start gap-3 pointer-events-auto backdrop-blur-sm shadow-lg shadow-black/20 animate-[slideIn_0.3s_ease-out]`}
            role="alert"
          >
            <span className="text-lg leading-none mt-0.5 flex-shrink-0">
              {toast.icon || style.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="break-words">{toast.message}</p>
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="mt-2 text-xs underline opacity-80 hover:opacity-100"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 flex-shrink-0"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
