import * as React from 'react';
import { Key, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { getLocalApiKey, setLocalApiKey } from '../services/gemini';
import { useToast } from '../context/ToastContext';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [keyInput, setKeyInput] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setKeyInput(getLocalApiKey());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setLocalApiKey(keyInput.trim());
    if (keyInput.trim()) {
      showToast('Custom Gemini API key saved to browser storage.', 'success');
    } else {
      showToast('Custom key cleared. Using system/fallback mode.', 'info');
    }
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    setLocalApiKey('');
    showToast('Gemini API key cleared from browser storage.', 'info');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl space-y-5 animate-scale-in">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Key className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h3 id="api-key-modal-title" className="text-sm font-bold text-foreground">
                Gemini API Key Settings
              </h3>
              <p className="text-[11px] text-muted-foreground">Configure your Google Gemini API key</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your key is kept <strong>locally in your browser</strong> and never stored on any remote server.
            If left blank, the app uses system credentials or smart AI mock heuristics.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="gemini-key-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full h-10 px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground">
            <Sparkles className="size-3.5 text-primary flex-shrink-0" />
            <span>Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">Google AI Studio</a>.</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {getLocalApiKey() && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-destructive hover:underline font-medium"
            >
              Clear saved key
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary-glow px-4 py-1.5 text-xs font-semibold rounded-lg"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};