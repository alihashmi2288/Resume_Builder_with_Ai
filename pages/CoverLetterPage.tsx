import * as React from 'react';
import { useResumeStore } from '../hooks/useResumeStore';
import { generateAICoverLetter } from '../services/gemini';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, Loader2, Clipboard, ClipboardCheck, AlertCircle, FileSignature, 
  Printer, Download, Edit3, Eye, Building2, Briefcase, RefreshCw, FileText
} from 'lucide-react';

const TONES = [
  { id: 'professional', label: 'Professional & Formal' },
  { id: 'confident', label: 'Confident & Driven' },
  { id: 'enthusiastic', label: 'Passionate & Energetic' },
  { id: 'concise', label: 'Concise & Direct' },
  { id: 'technical', label: 'Technical & Data-Driven' },
] as const;

type ToneType = typeof TONES[number]['id'];

const SAMPLE_JD = `We are looking for a high-performing professional to lead critical development initiatives across our cross-functional engineering team. 
Key requirements:
• 3+ years experience with modern web architecture, scalable services, and cloud platforms.
• Proven track record delivering user-centric features and optimizing platform performance.
• Strong communication skills, proactive problem-solving, and experience mentoring teammates in an agile environment.`;

const CoverLetterPage: React.FC = () => {
  const { resumeData, dispatch } = useResumeStore();
  const { showToast } = useToast();

  const [jobDescription, setJobDescription] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [jobRole, setJobRole] = React.useState('');
  const [selectedTone, setSelectedTone] = React.useState<ToneType>('professional');
  
  const [generatedLetter, setGeneratedLetter] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isCopied, setIsCopied] = React.useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) { 
      showToast('Please paste a job description first.', 'warning'); 
      return; 
    }

    setIsLoading(true);
    setError('');
    try {
      const letter = await generateAICoverLetter(resumeData, jobDescription, {
        tone: selectedTone,
        companyName: companyName.trim() || undefined,
        jobRole: jobRole.trim() || undefined,
      });
      setGeneratedLetter(letter);
      setIsEditing(false);
      showToast('Cover letter generated with tailored tone!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(msg);
      showToast('Failed to generate cover letter.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    showToast('Cover letter copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleDownloadTxt = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(resumeData.name || 'cover_letter').replace(/\s+/g, '_')}_letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Cover letter downloaded as text file.', 'success');
  };

  const handlePrint = () => {
    if (!generatedLetter) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Pop-up blocked. Please allow pop-ups to print.', 'error');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.name || 'Cover Letter'} - Application</title>
          <style>
            @page { size: A4; margin: 25mm; }
            body {
              font-family: 'Merriweather', Georgia, serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #111827;
              white-space: pre-wrap;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div>${generatedLetter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleLoadSampleJD = () => {
    setJobDescription(SAMPLE_JD);
    setCompanyName('TechForward Labs');
    setJobRole('Senior Full-Stack Engineer');
    showToast('Sample job posting loaded.', 'info');
  };

  const handleLoadDemoDataIfEmpty = () => {
    dispatch({ type: 'LOAD_DEMO_DATA' });
    showToast('Sample candidate profile loaded into builder!', 'success');
  };

  const inputClass = 'w-full h-10 px-3 py-2 bg-background border border-border/80 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all';
  const textareaBase = 'w-full bg-background border border-border/70 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all resize-none p-4';

  const isProfileEmpty = !resumeData.name?.trim() && !resumeData.skills?.trim();

  return (
    <div className="flex flex-col items-center">
      {/* Page header */}
      <div className="w-full text-center py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 380, height: 380, background: 'hsl(var(--ai-accent) / 0.09)', filter: 'blur(80px)', top: -100, left: -60 }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">AI Career Suite</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3 text-balance">
            Tailored Cover Letter Studio
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed text-pretty">
            Align your resume accomplishments directly with any job posting. The AI drafts a personalized, role-specific letter ready to export.
          </p>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl w-full">
        {/* Empty Profile Notice */}
        {isProfileEmpty && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-700 dark:text-amber-300">
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>Your resume is currently blank. Load a demo profile or populate your experience in the Builder for the most tailored letter.</span>
            </div>
            <button
              type="button"
              onClick={handleLoadDemoDataIfEmpty}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex-shrink-0"
            >
              Load Demo Profile
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Left Column: Config & Job Info (5 cols) ───────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Target Role & Company */}
            <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Building2 className="size-3.5 text-primary" />
                Target Company & Role (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company (e.g. Stripe)"
                    className={inputClass}
                  />
                </div>
                <div>
                  <input
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Role (e.g. Lead Engineer)"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2.5 shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Writing Tone
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTone === t.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Input */}
            <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
                <label htmlFor="job-description" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="size-3.5 text-primary" />
                  Job Requirements
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleJD}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Load Sample JD
                </button>
              </div>
              <div className="p-4">
                <textarea
                  id="job-description"
                  rows={10}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description or requirements here…"
                  className={textareaBase}
                />
              </div>
            </div>

            {/* Generate CTA Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn-ai w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isLoading
                ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Crafting tailored letter…</>
                : <><Sparkles className="size-4" aria-hidden="true" /> Generate Cover Letter</>
              }
            </button>
          </div>

          {/* ── Right Column: Letter Editor & Output (7 cols) ──────────── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl border border-border/70 bg-card overflow-hidden flex flex-col shadow-sm min-h-[560px]">
              
              {/* Output Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-3.5 text-primary" />
                  </div>
                  <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {isEditing ? 'Editing Cover Letter' : 'Cover Letter Preview'}
                  </h2>
                </div>

                {generatedLetter && !isLoading && (
                  <div className="flex items-center gap-1.5">
                    {/* Toggle Edit / Preview */}
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
                      title={isEditing ? 'Switch to formatted preview' : 'Edit text inline'}
                    >
                      {isEditing ? (
                        <><Eye className="size-3" /> Preview</>
                      ) : (
                        <><Edit3 className="size-3" /> Edit</>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`flex items-center gap-1 h-7 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                        isCopied
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500'
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      title="Copy to clipboard"
                    >
                      {isCopied ? (
                        <><ClipboardCheck className="size-3" /> Copied</>
                      ) : (
                        <><Clipboard className="size-3" /> Copy</>
                      )}
                    </button>

                    {/* Download TXT */}
                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
                      title="Download as text file"
                    >
                      <Download className="size-3" /> TXT
                    </button>

                    {/* Print / Save PDF */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold transition-colors shadow-sm"
                      title="Print or Save as PDF"
                    >
                      <Printer className="size-3" /> Print / PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Output Content Area */}
              <div className="p-6 flex-1 flex flex-col justify-start">
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                    <Loader2 className="size-9 animate-spin text-primary" aria-hidden="true" />
                    <p className="text-sm font-medium">Synthesizing candidate profile with role requirements…</p>
                    <p className="text-xs text-muted-foreground/70">Optimizing for recruiter impact and keyword density</p>
                  </div>
                )}

                {error && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                    <AlertCircle className="size-9 text-destructive" aria-hidden="true" />
                    <p className="text-sm text-destructive text-center" role="alert">{error}</p>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-foreground hover:bg-muted"
                    >
                      <RefreshCw className="size-3" /> Retry Generation
                    </button>
                  </div>
                )}

                {generatedLetter && !isLoading && isEditing && (
                  <textarea
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    rows={18}
                    className="w-full h-full min-h-[480px] p-4 bg-background border border-border/80 rounded-xl text-sm font-serif leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                    placeholder="Edit your cover letter here..."
                  />
                )}

                {generatedLetter && !isLoading && !isEditing && (
                  <div className="p-6 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm font-serif text-[11pt] leading-relaxed whitespace-pre-wrap select-text">
                    {generatedLetter}
                  </div>
                )}

                {!generatedLetter && !isLoading && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <FileSignature className="size-14 text-muted-foreground/20" strokeWidth={1} aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground">Your generated cover letter will appear here</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Paste a job description on the left and select your preferred tone to generate an ATS-aligned letter in seconds.
                    </p>
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