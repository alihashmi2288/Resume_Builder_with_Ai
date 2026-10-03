import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const showToast = React.useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirm = React.useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        options,
        resolve: (result: boolean) => {
          setConfirmDialog(null);
          resolve(result);
        },
      });
    });
  }, []);

  React.useEffect(() => {
    const handleRateLimit = () => {
      showToast(
        "Default Gemini API rate limit reached. You can add your own free API key from the 'API Key' button in the header!",
        "warning",
        "Rate Limit Warning",
        7000
      );
    };
    window.addEventListener('gemini-rate-limited', handleRateLimit);
    return () => window.removeEventListener('gemini-rate-limited', handleRateLimit);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Floating Toasts Stack (Fixed bottom-right, modern accessible banner) */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/40',
            error: 'bg-rose-950/90 border-rose-500/30 text-rose-200 shadow-rose-950/40',
            warning: 'bg-amber-950/90 border-amber-500/30 text-amber-200 shadow-amber-950/40',
            info: 'bg-slate-900/90 border-primary/30 text-slate-200 shadow-black/40',
          }[toast.type];

          const IconComponent = {
            success: CheckCircle2,
            error: AlertCircle,
            warning: AlertTriangle,
            info: Info,
          }[toast.type];

          const iconColor = {
            success: 'text-emerald-400',
            error: 'text-rose-400',
            warning: 'text-amber-400',
            info: 'text-primary',
          }[toast.type];

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-down ${typeStyles}`}
            >
              <IconComponent className={`size-5 mt-0.5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                {toast.title && <h4 className="text-xs font-bold text-foreground mb-0.5">{toast.title}</h4>}
                <p className="text-xs text-foreground/90 leading-relaxed break-words">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-foreground/50 hover:text-foreground p-1 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modern Confirmation Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl flex-shrink-0 ${
                  confirmDialog.options.destructive
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-primary/15 text-primary'
                }`}
              >
                {confirmDialog.options.destructive ? (
                  <AlertTriangle className="size-5" aria-hidden="true" />
                ) : (
                  <Info className="size-5" aria-hidden="true" />
                )}
              </div>
              <div className="space-y-1">
                <h3 id="confirm-modal-title" className="text-base font-bold text-foreground">
                  {confirmDialog.options.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {confirmDialog.options.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => confirmDialog.resolve(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
              >
                {confirmDialog.options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.resolve(true)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${
                  confirmDialog.options.destructive
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'btn-primary-glow'
                }`}
              >
                {confirmDialog.options.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
