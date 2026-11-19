import * as React from 'react';
import {
  FileUp,
  FileText,
  Sparkles,
  Loader2,
  X,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { parseResumeInput } from '../../services/gemini';
import type { ResumeData } from '../../types';
import { useToast } from '../../context/ToastContext';
import { inferResumeMimeType, normalizeImportedResumeData } from '../../lib/resumeUtils';

interface ImportResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (data: ResumeData) => void;
  onImport?: (data: ResumeData) => void;
}

const SAMPLE_RAW_RESUME = `Jordan Patel
jordan.patel@example.com | (415) 555-0148 | linkedin.com/in/jordanpatel

SUMMARY
Senior Product Engineer with 6+ years of experience building high-throughput web applications, design systems, and AI-assisted developer tools.

SKILLS
TypeScript, React, Next.js, Node.js, PostgreSQL, Tailwind CSS, GraphQL, Docker, AWS

EXPERIENCE
Senior Frontend Engineer | CloudScale Labs | 2022 - Present
- Led migration to a modular React + TypeScript architecture, reducing page load latency by 38%.
- Built an interactive analytics workspace serving 120,000+ monthly active users.
- Mentored 4 junior engineers and automated CI visual regression checks.

Software Engineer | BrightPath Digital | 2019 - 2022
- Engineered customer onboarding flows that lifted conversion by 22%.
- Integrated Stripe billing webhooks and role-based access controls in Node.js.

EDUCATION
B.S. in Computer Science | University of California, Davis | 2015 - 2019

PROJECTS
OpenMetrics UI (github.com/jordanpatel/openmetrics) - Lightweight telemetry chart library for React apps.`;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsDataURL(file);
  });
}

export const ImportResumeModal: React.FC<ImportResumeModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onImport,
}) => {
  const applyImportedResume = onImportSuccess ?? onImport;
  const { showToast } = useToast();
  const [mode, setMode] = React.useState<'upload' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [pastedText, setPastedText] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);
  const [isParsing, setIsParsing] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setError('');
      setIsParsing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    setError('');
    setSelectedFile(file);
  };

  const handleImport = async () => {
    setError('');

    if (mode === 'upload') {
      if (!selectedFile) {
        setError('Please select a PDF, DOCX, TXT, image, or JSON resume file first.');
        return;
      }

      if (!applyImportedResume) {
        setError('Unable to apply imported resume data.');
        return;
      }

      if (selectedFile.name.toLowerCase().endsWith('.json')) {
        try {
          const text = await selectedFile.text();
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === 'object' && ('name' in parsed || 'experience' in parsed || 'skills' in parsed)) {
            const normalized = normalizeImportedResumeData(parsed as Record<string, unknown>, () => crypto.randomUUID());
            applyImportedResume(normalized);
            showToast('Resume JSON backup imported.', 'success');
            onClose();
            return;
          }
          setError('Invalid JSON backup format.');
          return;
        } catch {
          setError('Could not parse the selected JSON file.');
          return;
        }
      }

      setIsParsing(true);
      try {
        const fileBase64 = await fileToBase64(selectedFile);
        const resolvedMime = inferResumeMimeType(selectedFile.name, selectedFile.type);
        const parsed = await parseResumeInput({
          fileBase64,
          mimeType: resolvedMime,
          fileName: selectedFile.name,
        });
        const normalized = normalizeImportedResumeData(
          parsed as unknown as Record<string, unknown>,
          () => crypto.randomUUID()
        );
        applyImportedResume(normalized);
        showToast('Resume extracted and auto-filled with AI Assistance!', 'success');
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to extract resume details.');
      } finally {
        setIsParsing(false);
      }
      return;
    }

    if (!pastedText.trim()) {
      setError('Please paste your existing resume or LinkedIn text.');
      return;
    }
    if (!applyImportedResume) {
      setError('Unable to apply imported resume data.');
      return;
    }

    setIsParsing(true);
    try {
      const parsed = await parseResumeInput({ rawText: pastedText });
      const normalized = normalizeImportedResumeData(
        parsed as unknown as Record<string, unknown>,
        () => crypto.randomUUID()
      );
      applyImportedResume(normalized);
      showToast('Resume text parsed and auto-filled with AI Assistance!', 'success');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse pasted resume text.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-resume-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-xl bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#ffd02f] text-[#1c1c1e]">
              <FileUp className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="import-resume-title" className="text-sm font-bold text-foreground">
                Import Your Current Resume
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Auto-fill every builder field with AI Assistance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isParsing}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close import modal"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted border border-border">
            <button
              type="button"
              onClick={() => { setMode('upload'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'upload'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UploadCloud className="size-3.5" aria-hidden="true" />
              Upload File (PDF / DOCX)
            </button>
            <button
              type="button"
              onClick={() => { setMode('paste'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'paste'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Paste Resume Text
            </button>
          </div>

          {mode === 'upload' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelect(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#4262ff] bg-[#4262ff]/5'
                  : 'border-border hover:border-[#4262ff]/60 bg-muted/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md,.json,.png,.jpg,.jpeg,.webp"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                className="hidden"
              />
              <div className="mx-auto size-11 rounded-full bg-[#fff8e0] dark:bg-[#2c2c34] flex items-center justify-center text-[#746019] dark:text-[#ffd02f] mb-3">
                <UploadCloud className="size-5" aria-hidden="true" />
              </div>
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Click to choose a different file
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Drop your resume here, or click to browse
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Supports PDF, DOCX, TXT, Markdown, PNG/JPG screenshots, or JSON backups
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="paste-resume-textarea" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resume or LinkedIn Text
                </label>
                <button
                  type="button"
                  onClick={() => { setPastedText(SAMPLE_RAW_RESUME); setError(''); }}
                  className="text-xs font-semibold text-[#4262ff] hover:underline cursor-pointer"
                >
                  Load Sample Text
                </button>
              </div>
              <textarea
                id="paste-resume-textarea"
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your current resume text, CV, or LinkedIn profile summary & experience here..."
                className="w-full p-3.5 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4262ff] resize-none"
              />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive">
              <AlertCircle className="size-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isParsing}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={isParsing}
              className="bg-[#ffd02f] hover:bg-[#fcb900] text-[#1c1c1e] inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isParsing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  Extracting &amp; Auto-Filling...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Parse &amp; Auto-Fill Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
