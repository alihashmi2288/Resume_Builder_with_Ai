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

interface PromptOptions {
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  promptInput: (options: PromptOptions) => Promise<string | null>;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);
  const [promptDialog, setPromptDialog] = React.useState<{
    isOpen: boolean;
    options: PromptOptions;
    value: string;
    resolve: (val: string | null) => void;
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

  const promptInput = React.useCallback((options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setPromptDialog({
        isOpen: true,
        options,
        value: options.defaultValue || '',
        resolve: (result: string | null) => {
          setPromptDialog(null);
          resolve(result);
        },
      });
    });
  }, []);

  React.useEffect(() => {
    const handleRateLimit = () => {
      showToast(
        "Gemini API rate limit reached. Please try again shortly or check your key quota in Settings > Secrets.",
        "warning",
        "Rate Limit Warning",
        7000
      );
    };
    window.addEventListener('gemini-rate-limited', handleRateLimit);
    return () => window.removeEventListener('gemini-rate-limited', handleRateLimit);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, confirm, promptInput }}>
      {children}

      {/* Floating Toasts Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-white dark:bg-[#1c1c1e] border-emerald-500/40 text-[#1c1c1e] dark:text-white',
            error: 'bg-white dark:bg-[#1c1c1e] border-rose-500/40 text-[#1c1c1e] dark:text-white',
            warning: 'bg-white dark:bg-[#1c1c1e] border-amber-500/40 text-[#1c1c1e] dark:text-white',
            info: 'bg-white dark:bg-[#1c1c1e] border-[#e0e2e8] dark:border-[#3b3b45] text-[#1c1c1e] dark:text-white',
          }[toast.type];

          const IconComponent = {
            success: CheckCircle2,
            error: AlertCircle,
            warning: AlertTriangle,
            info: Info,
          }[toast.type];

          const iconColor = {
            success: 'text-emerald-600 dark:text-emerald-400',
            error: 'text-rose-600 dark:text-rose-400',
            warning: 'text-amber-600 dark:text-amber-400',
            info: 'text-[#4262ff]',
          }[toast.type];

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl transition-all duration-300 animate-slide-down ${typeStyles}`}
            >
              <IconComponent className={`size-5 mt-0.5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                {toast.title && <h4 className="text-xs font-bold mb-0.5">{toast.title}</h4>}
                <p className="text-xs opacity-90 leading-relaxed break-words">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 p-1 rounded transition-opacity cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl flex-shrink-0 ${
                  confirmDialog.options.destructive
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-[#fff4c4] text-[#746019]'
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
                className="px-4 py-2 text-xs font-semibold rounded-full border border-border hover:bg-muted transition-colors text-foreground cursor-pointer"
              >
                {confirmDialog.options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.resolve(true)}
                className={`px-4 py-2 text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer ${
                  confirmDialog.options.destructive
                    ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                    : 'btn-miro-primary py-2 px-4 text-xs'
                }`}
              >
                {confirmDialog.options.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Input Modal */}
      {promptDialog && promptDialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prompt-modal-title"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              promptDialog.resolve(promptDialog.value.trim() || null);
            }}
            className="w-full max-w-md p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-2xl space-y-4 animate-scale-in"
          >
            <div className="space-y-1">
              <h3 id="prompt-modal-title" className="text-base font-bold text-foreground">
                {promptDialog.options.title}
              </h3>
              {promptDialog.options.message && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {promptDialog.options.message}
                </p>
              )}
            </div>

            <input
              type="text"
              autoFocus
              value={promptDialog.value}
              onChange={(e) =>
                setPromptDialog((prev) => (prev ? { ...prev, value: e.target.value } : prev))
              }
              placeholder={promptDialog.options.placeholder}
              className="w-full h-11 px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => promptDialog.resolve(null)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-border hover:bg-muted transition-colors text-foreground cursor-pointer"
              >
                {promptDialog.options.cancelText || 'Cancel'}
              </button>
              <button
                type="submit"
                className="btn-miro-primary py-2 px-5 text-xs font-semibold"
              >
                {promptDialog.options.confirmText || 'Save'}
              </button>
            </div>
          </form>
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
