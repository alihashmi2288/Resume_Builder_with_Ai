import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResumeForm } from '../components/builder/ResumeForm';
import { ResumePreview } from '../components/builder/ResumePreview';
import { useResumeStore } from '../hooks/useResumeStore';
import { type TemplateId, type ThemeColor } from '../types';
import { downloadAsPdf } from '../lib/pdf';
import { printResume } from '../lib/print';
import { Button } from '../components/ui/Button';
import {
  Download, Eye, Code, Trash2, Upload, FileJson, Sparkles,
  Edit3, Copy, PlusCircle, ChevronDown, LayoutTemplate, Settings2
} from 'lucide-react';

const colors: { id: ThemeColor; name: string; hex: string }[] = [
  { id: 'slate',   name: 'Slate',   hex: '#475569' },
  { id: 'indigo',  name: 'Indigo',  hex: '#4f46e5' },
  { id: 'blue',    name: 'Blue',    hex: '#2563eb' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'rose',    name: 'Rose',    hex: '#e11d48' },
  { id: 'amber',   name: 'Amber',   hex: '#d97706' },
];

const BuilderPage: React.FC = () => {
  const { resumeData, drafts, activeDraftId, dispatch } = useResumeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTemplate, setActiveTemplate] = React.useState<TemplateId>(
    (searchParams.get('template') as TemplateId) || 'classic'
  );
  const [viewMode, setViewMode] = React.useState<'form' | 'preview'>('form');
  const [showDownloadMenu, setShowDownloadMenu] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const templateFromUrl = searchParams.get('template') as TemplateId;
    if (templateFromUrl) setActiveTemplate(templateFromUrl);
  }, [searchParams]);

  const handleTemplateChange = (template: TemplateId) => {
    setActiveTemplate(template);
    setSearchParams({ template });
  };

  const handleReset = () => {
    if (window.confirm('Reset all data for this profile? This cannot be undone.')) {
      dispatch({ type: 'RESET_DATA' });
    }
  };

  const handleLoadDemo = () => {
    if (window.confirm('Load sample data into this profile?')) {
      dispatch({ type: 'LOAD_DEMO_DATA' });
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `${(resumeData.name || 'resume').replace(/\s+/g, '_')}_data.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert('Failed to export resume data.');
    }
  };

  const handleImportJsonClick = () => fileInputRef.current?.click();

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsText(e.target.files[0], 'UTF-8');
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === 'object' && 'name' in parsed && 'skills' in parsed) {
            dispatch({ type: 'LOAD_DRAFT', data: parsed });
            alert('Resume data imported successfully!');
          } else {
            alert('Invalid resume data structure.');
          }
        } catch {
          alert('Error parsing JSON file.');
        }
      };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ─── Sticky Toolbar ──────────────────────────────────────────────── */}
      <div className="sticky top-14 z-40 border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-sm no-print">

        {/* Top row: Profile manager + view toggle + download */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 h-12 border-b border-border/30">

            {/* Left: title + profile manager */}
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="hidden sm:block text-sm font-semibold text-foreground whitespace-nowrap">
                Resume Architect
              </h1>
              <div className="flex items-center gap-0.5 border border-border/60 rounded-xl overflow-hidden bg-muted/20 backdrop-blur-md shadow-sm transition-all hover:border-border">
                <select
                  value={activeDraftId}
                  onChange={(e) => dispatch({ type: 'SWITCH_DRAFT', id: e.target.value })}
                  className="h-7 px-2.5 bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px] text-foreground"
                  aria-label="Switch resume profile"
                >
                  {drafts.map((d) => (
                    <option key={d.id} value={d.id} className="bg-card text-foreground">{d.name}</option>
                  ))}
                </select>
                <div className="flex items-center border-l border-border/50">
                  {/* Rename */}
                  <button
                    onClick={() => {
                      const name = drafts.find((d) => d.id === activeDraftId)?.name || '';
                      const n = prompt('Rename profile:', name);
                      if (n?.trim()) dispatch({ type: 'RENAME_DRAFT', id: activeDraftId, newName: n.trim() });
                    }}
                    className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200 active:scale-90"
                    title="Rename Profile"
                    aria-label="Rename Profile"
                  >
                    <Edit3 className="h-3 w-3" aria-hidden="true" />
                  </button>
                  {/* Duplicate */}
                  <button
                    onClick={() => {
                      const name = drafts.find((d) => d.id === activeDraftId)?.name || '';
                      const n = prompt('Duplicate as:', `${name} (Copy)`);
                      if (n?.trim()) dispatch({ type: 'DUPLICATE_DRAFT', id: activeDraftId, newName: n.trim() });
                    }}
                    className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200 active:scale-90"
                    title="Duplicate Profile"
                    aria-label="Duplicate Profile"
                  >
                    <Copy className="h-3 w-3" aria-hidden="true" />
                  </button>
                  {/* New profile */}
                  <button
                    onClick={() => {
                      const name = prompt('New profile name:', 'New Resume');
                      if (name?.trim()) {
                        const demo = confirm('Populate with sample data?');
                        dispatch({ type: 'CREATE_DRAFT', name: name.trim(), isDemo: demo });
                      }
                    }}
                    className="h-7 w-7 flex items-center justify-center text-primary hover:bg-primary/10 transition-all duration-200 active:scale-90"
                    title="New Profile"
                    aria-label="New Profile"
                  >
                    <PlusCircle className="h-3 w-3" aria-hidden="true" />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (drafts.length <= 1) { alert('Keep at least one profile.'); return; }
                      const name = drafts.find((d) => d.id === activeDraftId)?.name || '';
                      if (confirm(`Delete profile "${name}"?`)) dispatch({ type: 'DELETE_DRAFT', id: activeDraftId });
                    }}
                    disabled={drafts.length <= 1}
                    className="h-7 w-7 flex items-center justify-center text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-90"
                    title="Delete Profile"
                    aria-label="Delete Profile"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: mobile toggle + download */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'form' ? 'preview' : 'form')}
                className="xl:hidden text-xs gap-1.5"
              >
                {viewMode === 'form'
                  ? <><Eye className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Preview</>
                  : <><Code className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Edit</>
                }
              </Button>

              {/* Download split menu */}
              <div className="relative">
                <Button
                  size="sm"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="gap-1.5 text-xs btn-primary-glow"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                  <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
                </Button>

                {showDownloadMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-60 bg-card border border-border/60 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-slide-down">
                      <button
                        onClick={() => { setShowDownloadMenu(false); printResume('resume-preview-content'); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-accent transition-colors flex flex-col gap-0.5 group focus-visible:outline-none focus-visible:bg-accent"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 group-hover:shadow-[0_0_6px_2px_rgba(16,185,129,0.4)] transition-shadow" />
                          Print / Save ATS PDF
                        </span>
                        <span className="text-muted-foreground font-normal pl-4">Fully selectable text and links.</span>
                      </button>
                      <button
                        onClick={() => { setShowDownloadMenu(false); downloadAsPdf('resume-preview-content', `${(resumeData.name || 'resume').replace(/\s+/g, '_')}_resume.pdf`); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-accent transition-colors flex flex-col gap-0.5 group focus-visible:outline-none focus-visible:bg-accent"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <span className="h-2 w-2 rounded-full bg-sky-500 group-hover:shadow-[0_0_6px_2px_rgba(14,165,233,0.4)] transition-shadow" />
                          Download Visual PDF
                        </span>
                        <span className="text-muted-foreground font-normal pl-4">High-fidelity image canvas.</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row: Controls */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 text-xs">

            {/* Template selector */}
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <select
                value={activeTemplate}
                onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
                className="h-7 pl-2 pr-6 bg-muted/40 border border-border/60 rounded-lg text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-muted/60 hover:border-border transition-all cursor-pointer appearance-none text-foreground"
                aria-label="Select Template"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
              >
                <option value="classic" className="bg-card">Classic</option>
                <option value="modern" className="bg-card">Modern</option>
                <option value="creative" className="bg-card">Creative</option>
                <option value="technical" className="bg-card">Technical</option>
                <option value="minimalist" className="bg-card">Minimalist</option>
                <option value="academic" className="bg-card">Academic</option>
                <option value="executive" className="bg-card">Executive</option>
                <option value="infographic" className="bg-card">Infographic</option>
                <option value="startup" className="bg-card">Startup</option>
              </select>
            </div>

            {/* Accent color swatches */}
            <div className="flex items-center gap-2 border-l border-border/40 pl-4">
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold hidden sm:block">Accent</span>
              <div className="flex items-center gap-1">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'themeColor', value: c.id })}
                    className={`rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      (resumeData.themeColor || 'slate') === c.id
                        ? 'ring-2 ring-offset-2 ring-offset-background scale-125 shadow-md'
                        : 'opacity-60 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex, height: '18px', width: '18px' }}
                    title={c.name}
                    aria-label={`${c.name} accent`}
                  />
                ))}
              </div>
            </div>

            {/* Layout settings */}
            <div className="flex items-center gap-2 border-l border-border/40 pl-4">
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              {[
                { field: 'fontSize',   options: [['small','S Font'],['medium','M Font'],['large','L Font']], default: 'medium', label: 'Font Size' },
                { field: 'lineHeight', options: [['compact','Compact'],['normal','Normal'],['relaxed','Relaxed']], default: 'normal', label: 'Line Height' },
                { field: 'margins',    options: [['narrow','Narrow'],['normal','Normal'],['wide','Wide']], default: 'normal', label: 'Margins' },
              ].map(({ field, options, default: def, label }) => (
                <select
                  key={field}
                  value={(resumeData as any)[field] || def}
                  aria-label={label}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: field as any, value: e.target.value })}
                  className="h-7 px-2 bg-muted/40 border border-border/60 rounded-lg text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-muted/60 hover:border-border transition-all cursor-pointer text-foreground"
                >
                  {options.map(([val, label]) => <option key={val} value={val} className="bg-card">{label}</option>)}
                </select>
              ))}
            </div>

            {/* Action buttons — pushed right */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handleLoadDemo}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Load demo data"
                aria-label="Load demo data"
              >
                <Sparkles className="h-3 w-3 text-[hsl(var(--ai-accent))]" aria-hidden="true" />
                <span className="hidden sm:inline">Demo</span>
              </button>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Export as JSON"
                aria-label="Export profile as JSON"
              >
                <FileJson className="h-3 w-3 text-indigo-400" aria-hidden="true" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" className="hidden" />
              <button
                onClick={handleImportJsonClick}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Import JSON"
                aria-label="Import profile from JSON file"
              >
                <Upload className="h-3 w-3 text-sky-400" aria-hidden="true" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border/70 text-destructive hover:bg-destructive/10 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Reset data"
                aria-label="Reset profile data"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main split panel ─────────────────────────────────────────────── */}
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
          {/* Form column */}
          <div className={`xl:col-span-2 ${viewMode === 'preview' ? 'hidden' : ''} xl:block`}>
            <ResumeForm resumeData={resumeData} dispatch={dispatch} />
          </div>

          {/* Preview column */}
          <div className={`xl:col-span-3 ${viewMode === 'form' ? 'hidden' : ''} xl:block`}>
            <div className="sticky top-[calc(56px+72px+2px)] max-h-[calc(100vh-160px)] overflow-y-auto">
              <ResumePreview data={resumeData} template={activeTemplate} isBuilder={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;