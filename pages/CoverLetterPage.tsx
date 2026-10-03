import * as React from 'react';
import { useResumeStore } from '../hooks/useResumeStore';
import { generateAICoverLetter } from '../services/gemini';
import { Sparkles, Loader2, Clipboard, ClipboardCheck, AlertCircle, FileSignature } from 'lucide-react';

const CoverLetterPage: React.FC = () => {
  const { resumeData } = useResumeStore();
  const [jobDescription, setJobDescription] = React.useState('');
  const [generatedLetter, setGeneratedLetter] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isCopied, setIsCopied] = React.useState(false);

  const handleGenerate = async () => {
    if (!jobDescription) { setError('Please paste a job description first.'); return; }
    setIsLoading(true);
    setError('');
    setGeneratedLetter('');
    try {
      const letter = await generateAICoverLetter(resumeData, jobDescription);
      setGeneratedLetter(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const textareaBase = 'w-full bg-background border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all disabled:opacity-50 resize-none p-4';

  return (
    <div className="flex flex-col items-center">
      {/* Page header */}
      <div className="w-full text-center py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 380, height: 380, background: 'hsl(var(--ai-accent) / 0.09)', filter: 'blur(80px)', top: -100, left: -60 }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">AI-Powered</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-4 text-balance">
            Cover Letter Generator
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed text-pretty">
            Paste a job description. The AI uses your saved resume data to write a tailored, compelling cover letter in seconds.
          </p>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Input column ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-xs font-bold text-primary tabular-nums">1</span>
                </div>
                <label htmlFor="job-description" className="text-sm font-semibold text-foreground text-balance">Paste Job Description</label>
              </div>
              <div className="p-4">
                <textarea
                  id="job-description"
                  rows={14}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here — the AI will tailor your cover letter to match the role requirements and language…"
                  className={textareaBase}
                />
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn-ai w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isLoading
                ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Generating…</>
                : <><Sparkles className="size-4" aria-hidden="true" /> Generate Cover Letter</>
              }
            </button>
          </div>

          {/* ── Output column ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden flex-1">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xs font-bold text-primary tabular-nums">2</span>
                  </div>
                  <h2 className="text-sm font-semibold text-foreground text-balance">Generated Cover Letter</h2>
                </div>
                {generatedLetter && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-medium h-7 px-3 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isCopied
                        ? 'border-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/60'
                    }`}
                  >
                    {isCopied
                      ? <><ClipboardCheck className="size-3.5" aria-hidden="true" /> Copied!</>
                      : <><Clipboard className="size-3.5" aria-hidden="true" /> Copy</>
                    }
                  </button>
                )}
              </div>

              <div className="p-4 min-h-[400px] flex flex-col">
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
                    <p className="text-sm text-pretty">Crafting your cover letter…</p>
                  </div>
                )}
                {error && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
                    <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
                    <p className="text-sm text-destructive text-center text-pretty" role="alert">{error}</p>
                  </div>
                )}
                {generatedLetter && !isLoading && (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-serif">
                    {generatedLetter}
                  </div>
                )}
                {!generatedLetter && !isLoading && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <FileSignature className="size-12 text-muted-foreground/25" strokeWidth={1.2} aria-hidden="true" />
                    <p className="text-sm text-muted-foreground text-pretty">Your generated cover letter will appear here.</p>
                    <p className="text-xs text-muted-foreground/60 max-w-xs text-pretty">Make sure you've filled in your resume details in the Builder before generating.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;