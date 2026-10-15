import * as React from 'react';
import { useResumeStore } from '../hooks/useResumeStore';
import { generateAICoverLetter } from '../services/gemini';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, Loader2, Clipboard, ClipboardCheck, AlertCircle, FileSignature, 
  Printer, Download, Edit3, Eye, Building2, Briefcase, RefreshCw, FileText, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const TONES = [
  { id: 'professional', label: 'Professional & Formal' },
  { id: 'confident', label: 'Confident & Driven' },
  { id: 'enthusiastic', label: 'Passionate & Energetic' },
  { id: 'concise', label: 'Concise & Direct' },
  { id: 'technical', label: 'Technical & Data-Driven' },
] as const;

type ToneType = typeof TONES[number]['id'];

const SAMPLE_JD = `We are looking for a high-performing Software Engineer to lead critical development initiatives across our cross-functional engineering team. 
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

  const inputClass = 'w-full h-11 px-4 py-2 bg-white dark:bg-[#1a1a1e] border border-[#c7cad5] dark:border-[#3b3b45] rounded-xl text-xs text-[#1c1c1e] dark:text-white placeholder:text-[#a5a8b5] focus-visible:outline-none focus-visible:border-[#4262ff] focus-visible:ring-2 focus-visible:ring-[#4262ff]/20 transition-all';
  const textareaBase = 'w-full bg-white dark:bg-[#1a1a1e] border border-[#c7cad5] dark:border-[#3b3b45] rounded-xl text-sm text-[#1c1c1e] dark:text-white placeholder:text-[#a5a8b5] focus-visible:outline-none focus-visible:border-[#4262ff] focus-visible:ring-2 focus-visible:ring-[#4262ff]/20 transition-all resize-none p-4';

  const isProfileEmpty = !resumeData.name?.trim() && !resumeData.skills?.trim();

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#141416] text-[#1c1c1e] dark:text-white transition-colors">
      
      {/* Header */}
      <div className="w-full text-center py-16 md:py-20 px-6 max-w-[1280px] mx-auto">
        <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-4 py-1.5 mb-4 inline-block">
          AI TAILORED LETTERS
        </span>
        <h1 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
          Tailored Cover Letter Studio.
        </h1>
        <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5] max-w-lg mx-auto">
          Align your resume achievements directly with any job posting. The AI crafts a cohesive, role-specific letter ready to export.
        </p>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 pb-24">
        
        {/* Notice for empty profile */}
        {isProfileEmpty && (
          <div className="mb-6 p-4 rounded-2xl bg-[#fff8e0] border border-[#ffd02f]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#746019]">
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <AlertCircle className="size-4 flex-shrink-0 text-[#746019]" />
              <span>Your resume is currently blank. Load sample profile details to preview the letter generator with full context.</span>
            </div>
            <button
              type="button"
              onClick={handleLoadDemoDataIfEmpty}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#1c1c1e] text-white hover:bg-[#2c2c34] transition-colors flex-shrink-0"
            >
              Load Demo Profile
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: 5 Cols */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Target Role & Company */}
            <div className="rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-[#f7f8fa] dark:bg-[#16161a] p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider flex items-center gap-2">
                <Building2 className="size-3.5 text-[#4262ff]" />
                Target Company & Role
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company (e.g. Stripe)"
                  className={inputClass}
                />
                <input
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="Role (e.g. Lead Engineer)"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Tone Selector */}
            <div className="rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-[#f7f8fa] dark:bg-[#16161a] p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider">
                Writing Tone
              </h3>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedTone === t.id
                        ? 'bg-[#1c1c1e] text-white shadow-sm'
                        : 'bg-white dark:bg-[#1f1f24] border border-[#e0e2e8] dark:border-[#2c2c34] text-[#555a6a] dark:text-[#a5a8b5] hover:bg-[#eef0f3]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Input */}
            <div className="rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-[#f7f8fa] dark:bg-[#16161a] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e0e2e8] dark:border-[#2c2c34]">
                <label htmlFor="job-description" className="text-xs font-bold text-[#1c1c1e] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="size-3.5 text-[#4262ff]" />
                  Job Requirements
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleJD}
                  className="text-xs font-bold text-[#4262ff] hover:underline"
                >
                  Load Sample JD
                </button>
              </div>
              <div className="p-4">
                <textarea
                  id="job-description"
                  rows={9}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description or requirements here…"
                  className={textareaBase}
                />
              </div>
            </div>

            {/* Generate CTA Button */}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn-miro-primary h-[48px] text-[15px] w-full"
            >
              {isLoading
                ? <><Loader2 className="size-4 animate-spin mr-2" /> Crafting tailored letter…</>
                : <><Sparkles className="size-4 mr-2 text-[#ffd02f]" /> Generate Cover Letter</>
              }
            </Button>
          </div>

          {/* Right Column: 7 Cols */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col shadow-sm min-h-[580px]">
              
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#eef0f3] dark:border-[#2c2c34] bg-[#fafbfc] dark:bg-[#16161a]">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#4262ff]" />
                  <h2 className="text-xs font-bold text-[#1c1c1e] dark:text-white uppercase tracking-wider">
                    {isEditing ? 'Editing Cover Letter' : 'Cover Letter Preview'}
                  </h2>
                </div>

                {generatedLetter && !isLoading && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-3 py-1.5 rounded-full border border-[#c7cad5] dark:border-[#3b3b45] text-xs font-medium hover:bg-[#f7f8fa] transition-colors"
                    >
                      {isEditing ? 'Preview' : 'Edit'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-full border border-[#c7cad5] dark:border-[#3b3b45] text-xs font-medium hover:bg-[#f7f8fa] transition-colors"
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      className="px-3 py-1.5 rounded-full border border-[#c7cad5] dark:border-[#3b3b45] text-xs font-medium hover:bg-[#f7f8fa] transition-colors"
                    >
                      TXT
                    </button>

                    <Button
                      type="button"
                      onClick={handlePrint}
                      className="btn-miro-primary h-8 px-4 text-xs font-semibold"
                    >
                      <Printer className="size-3.5 mr-1" /> Print / PDF
                    </Button>
                  </div>
                )}
              </div>

              {/* Output Content Area */}
              <div className="p-6 flex-1 flex flex-col justify-start">
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-24 text-[#6b6f7e]">
                    <Loader2 className="size-10 animate-spin text-[#1c1c1e] dark:text-white" />
                    <p className="text-sm font-medium text-[#1c1c1e] dark:text-white">Synthesizing candidate profile with role requirements…</p>
                    <p className="text-xs text-[#8e91a0]">Optimizing for recruiter impact and keyword density</p>
                  </div>
                )}

                {error && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                    <AlertCircle className="size-9 text-[#ff9999]" />
                    <p className="text-sm text-[#ff9999] text-center">{error}</p>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#c7cad5] text-xs font-medium"
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
                    className="w-full h-full min-h-[480px] p-5 bg-white dark:bg-[#141416] border border-[#e0e2e8] dark:border-[#2c2c34] rounded-xl text-sm font-serif leading-relaxed text-[#1c1c1e] dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4262ff] resize-none"
                    placeholder="Edit your cover letter here..."
                  />
                )}

                {generatedLetter && !isLoading && !isEditing && (
                  <div className="p-8 rounded-xl bg-[#fafbfc] dark:bg-[#141416] text-[#1c1c1e] dark:text-white border border-[#eef0f3] dark:border-[#2c2c34] font-serif text-[11pt] leading-relaxed whitespace-pre-wrap select-text shadow-inner">
                    {generatedLetter}
                  </div>
                )}

                {!generatedLetter && !isLoading && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-24 text-center">
                    <div className="size-16 rounded-full bg-[#f7f8fa] dark:bg-[#242428] flex items-center justify-center text-[#8e91a0] mb-2">
                      <FileSignature className="size-8" />
                    </div>
                    <p className="text-base font-semibold text-[#1c1c1e] dark:text-white">Your generated cover letter will appear here</p>
                    <p className="text-xs text-[#555a6a] dark:text-[#a5a8b5] max-w-sm">
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