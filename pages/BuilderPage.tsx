import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResumeForm } from '../components/builder/ResumeForm';
import { ResumePreview } from '../components/builder/ResumePreview';
import { ImportResumeModal } from '../components/builder/ImportResumeModal';
import { useResumeStore } from '../hooks/useResumeStore';
import { type HeadingCase, type TemplateId, type ThemeColor } from '../types';
import { downloadAsPdf } from '../lib/pdf';
import { printResume } from '../lib/print';
import { Button } from '../components/ui/Button';
import {
  Download, Eye, Code, Trash2, FileUp, FileJson, Sparkles,
  Edit3, Copy, PlusCircle, ChevronDown, ChevronLeft, ChevronRight,
  LayoutTemplate, Settings2, MoreHorizontal, Undo2, Redo2
} from 'lucide-react';

import { useToast } from '../context/ToastContext';

const colors: { id: ThemeColor; name: string; hex: string }[] = [
  { id: 'slate',   name: 'Slate',   hex: '#475569' },
  { id: 'indigo',  name: 'Indigo',  hex: '#4f46e5' },
  { id: 'blue',    name: 'Blue',    hex: '#2563eb' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'rose',    name: 'Rose',    hex: '#e11d48' },
  { id: 'amber',   name: 'Amber',   hex: '#d97706' },
];

const TEMPLATE_OPTIONS: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'creative', label: 'Creative' },
  { id: 'technical', label: 'Technical' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'academic', label: 'Academic' },
  { id: 'executive', label: 'Executive' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'startup', label: 'Startup' },
];

const HEADING_CASE_OPTIONS: { value: HeadingCase; short: string; label: string }[] = [
  { value: 'uppercase', short: 'AA', label: 'Uppercase headings' },
  { value: 'titlecase', short: 'Aa', label: 'Title case headings' },
  { value: 'lowercase', short: 'aa', label: 'Lowercase headings' },
];

const BuilderPage: React.FC = () => {
  const {
    resumeData,
    drafts,
    activeDraftId,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undo,
    redo,
    dispatch,
  } = useResumeStore();
  const { showToast, confirm, promptInput } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTemplate, setActiveTemplate] = React.useState<TemplateId>(
    (searchParams.get('template') as TemplateId) || 'classic'
  );
  const [viewMode, setViewMode] = React.useState<'form' | 'preview'>('form');
  const [showDownloadMenu, setShowDownloadMenu] = React.useState(false);
  const [showDraftMenu, setShowDraftMenu] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);

  React.useEffect(() => {
    const templateFromUrl = searchParams.get('template') as TemplateId;
    if (templateFromUrl) setActiveTemplate(templateFromUrl);
  }, [searchParams]);

  const handleUndo = React.useCallback(() => {
    if (!canUndo) return;
    undo();
    showToast('Reverted last change.', 'info');
  }, [canUndo, undo, showToast]);

  const handleRedo = React.useCallback(() => {
    if (!canRedo) return;
    redo();
    showToast('Restored undone change.', 'info');
  }, [canRedo, redo, showToast]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const isTextControl =
        target &&
        (target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          (target.tagName === 'INPUT' &&
            !['checkbox', 'radio', 'button', 'submit', 'file'].includes(
              (target as HTMLInputElement).type
            )));
      if (isTextControl) return;

      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        if (canUndo) {
          e.preventDefault();
          handleUndo();
        }
      } else if ((key === 'z' && e.shiftKey) || (key === 'y' && !e.shiftKey)) {
        if (canRedo) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canUndo, canRedo, handleUndo, handleRedo]);

  const handleTemplateChange = (template: TemplateId) => {
    setActiveTemplate(template);
    setSearchParams({ template });
    showToast(`Switched template to ${template}`, 'info');
  };

  const cycleTemplate = (direction: -1 | 1) => {
    const currentIndex = TEMPLATE_OPTIONS.findIndex((t) => t.id === activeTemplate);
    const baseIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (baseIndex + direction + TEMPLATE_OPTIONS.length) % TEMPLATE_OPTIONS.length;
    handleTemplateChange(TEMPLATE_OPTIONS[nextIndex].id);
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset Profile Data?',
      message: 'This will reset all sections in this profile to starter content. You can revert immediately using Undo.',
      confirmText: 'Reset Data',
      destructive: true,
    });
    if (ok) {
      dispatch({ type: 'RESET_DATA' });
      showToast('Profile data reset. Click Undo to restore.', 'info');
    }
  };

  const handleLoadDemo = async () => {
    const ok = await confirm({
      title: 'Load Sample Data?',
      message: 'This will load sample software engineer profile details to help you preview all resume features.',
      confirmText: 'Load Demo',
    });
    if (ok) {
      dispatch({ type: 'LOAD_DEMO_DATA' });
      showToast('Demo profile loaded successfully!', 'success');
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
      showToast('Resume JSON exported successfully.', 'success');
    } catch {
      showToast('Failed to export resume data.', 'error');
    }
  };

  const currentHeadingCase: HeadingCase = resumeData.headingCase || 'uppercase';

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ─── Workspace Toolbar ────────────────────────────────────────────── */}
      <div className="relative z-30 border-b border-border bg-card shadow-sm no-print">

        {/* Top row: Draft switcher + mobile toggle + download */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-14 border-b border-border/70">

            {/* Left: title + streamlined draft selector */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground whitespace-nowrap">
                <span className="size-2 rounded-full bg-[#ffd02f]" />
                Resume Workspace
              </span>

              <div className="relative flex items-center border border-border rounded-full bg-secondary/70 shadow-sm">
                <select
                  value={activeDraftId}
                  onChange={(e) => dispatch({ type: 'SWITCH_DRAFT', id: e.target.value })}
                  className="h-8 pl-3 pr-2 bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer max-w-[160px] text-foreground"
                  aria-label="Switch resume draft"
                >
                  {drafts.map((d) => (
                    <option key={d.id} value={d.id} className="bg-card text-foreground">{d.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowDraftMenu((prev) => !prev)}
                  className="h-8 px-2.5 flex items-center gap-1 border-l border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-full transition-colors whitespace-nowrap shrink-0"
                  title="Manage resume versions"
                  aria-label="Manage resume versions"
                  aria-expanded={showDraftMenu}
                >
                  <MoreHorizontal className="size-3.5" aria-hidden="true" />
                </button>

                {showDraftMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDraftMenu(false)} aria-hidden="true" />
                    <div className="absolute left-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-slide-down">
                      <button
                        type="button"
                        onClick={async () => {
                          setShowDraftMenu(false);
                          const name = drafts.find((d) => d.id === activeDraftId)?.name || '';
                          const n = await promptInput({
                            title: 'Rename Version',
                            message: 'Enter a name for this resume version.',
                            defaultValue: name,
                            placeholder: 'e.g. Staff Frontend Engineer',
                            confirmText: 'Save Name',
                          });
                          if (n?.trim()) {
                            dispatch({ type: 'RENAME_DRAFT', id: activeDraftId, newName: n.trim() });
                            showToast(`Renamed to "${n.trim()}".`, 'success');
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary transition-colors flex items-center gap-2.5 text-foreground font-medium"
                      >
                        <Edit3 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        Rename Version
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setShowDraftMenu(false);
                          const name = drafts.find((d) => d.id === activeDraftId)?.name || '';
                          const n = await promptInput({
                            title: 'Duplicate Version',
                            message: 'Create a copy to tailor this resume for another role.',
                            defaultValue: `${name} (Copy)`,
                            placeholder: 'Copy name',
                            confirmText: 'Duplicate',
                          });
                          if (n?.trim()) {
                            dispatch({ type: 'DUPLICATE_DRAFT', id: activeDraftId, newName: n.trim() });
                            showToast(`Duplicated as "${n.trim()}".`, 'success');
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary transition-colors flex items-center gap-2.5 text-foreground font-medium"
                      >
                        <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        Duplicate Version
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setShowDraftMenu(false);
                          const name = await promptInput({
                            title: 'New Resume Version',
                            message: 'Name your new resume version before choosing sample or blank.',
                            defaultValue: 'New Resume',
                            placeholder: 'e.g. Product Manager 2026',
                            confirmText: 'Continue',
                          });
                          if (name?.trim()) {
                            const demo = await confirm({
                              title: 'Populate with Sample Data?',
                              message: 'Would you like to populate this new version with sample resume details?',
                              confirmText: 'Yes, load sample',
                              cancelText: 'No, start blank',
                            });
                            dispatch({ type: 'CREATE_DRAFT', name: name.trim(), isDemo: demo });
                            showToast(`Created "${name.trim()}".`, 'success');
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary transition-colors flex items-center gap-2.5 text-foreground font-medium"
                      >
                        <PlusCircle className="size-3.5 text-[#fcb900]" aria-hidden="true" />
                        New Resume Version
                      </button>
                      {drafts.length > 1 && (
                        <button
                          type="button"
                          onClick={async () => {
                            setShowDraftMenu(false);
                            const name = drafts.find((d) => d.id === activeDraftId)?.name || '';
                            const ok = await confirm({
                              title: 'Delete Version?',
                              message: `Are you sure you want to permanently delete "${name}"?`,
                              confirmText: 'Delete Version',
                              destructive: true,
                            });
                            if (ok) {
                              dispatch({ type: 'DELETE_DRAFT', id: activeDraftId });
                              showToast(`Deleted "${name}".`, 'info');
                            }
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs hover:bg-destructive/10 transition-colors flex items-center gap-2.5 text-destructive font-medium border-t border-border mt-1 pt-2"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                          Delete Current Version
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Undo/Redo + mobile toggle + download */}
            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center rounded-full border border-border bg-secondary/70 p-0.5 shadow-sm shrink-0"
                role="group"
                aria-label="Undo and redo history"
              >
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title={canUndo ? `Undo last change (${undoCount} available) · Ctrl/Cmd+Z` : 'Nothing to undo'}
                  aria-label="Undo last change"
                  className="h-7 px-2.5 inline-flex items-center gap-1 rounded-full text-xs font-semibold text-foreground hover:bg-card disabled:opacity-35 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Undo2 className="size-3.5" aria-hidden="true" />
                  <span className="hidden md:inline">Undo</span>
                </button>
                <div className="w-px h-3.5 bg-border" aria-hidden="true" />
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title={canRedo ? `Redo change (${redoCount} available) · Ctrl/Cmd+Shift+Z` : 'Nothing to redo'}
                  aria-label="Redo last undone change"
                  className="h-7 px-2.5 inline-flex items-center gap-1 rounded-full text-xs font-semibold text-foreground hover:bg-card disabled:opacity-35 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Redo2 className="size-3.5" aria-hidden="true" />
                  <span className="hidden md:inline">Redo</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'form' ? 'preview' : 'form')}
                className="xl:hidden text-xs gap-1.5 h-8 px-3 rounded-full border border-border font-medium flex items-center whitespace-nowrap shrink-0"
              >
                {viewMode === 'form'
                  ? <><Eye className="size-3.5 text-[#4262ff]" aria-hidden="true" /> Preview</>
                  : <><Code className="size-3.5 text-[#4262ff]" aria-hidden="true" /> Edit</>
                }
              </button>

              {/* Download split menu */}
              <div className="relative">
                <Button
                  size="sm"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="btn-miro-primary h-8 px-4 text-xs font-semibold gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                  <ChevronDown className="size-3 opacity-70" aria-hidden="true" />
                </Button>

                {showDownloadMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-slide-down">
                      <button
                        onClick={() => { setShowDownloadMenu(false); printResume('resume-preview-content'); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-secondary transition-colors flex flex-col gap-0.5"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <span className="size-2 rounded-full bg-[#00b473]" />
                          Print / Save ATS PDF
                        </span>
                        <span className="text-muted-foreground font-normal pl-4">Fully selectable text &amp; links (Standard).</span>
                      </button>
                      <button
                        onClick={() => { setShowDownloadMenu(false); downloadAsPdf('resume-preview-content', `${(resumeData.name || 'resume').replace(/\s+/g, '_')}_resume.pdf`); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-secondary transition-colors flex flex-col gap-0.5"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <span className="size-2 rounded-full bg-[#4262ff]" />
                          Download Visual PDF
                        </span>
                        <span className="text-muted-foreground font-normal pl-4">High-fidelity 300 DPI canvas.</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row: Appearance & Preferences Controls */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2 text-xs">

            {/* Template selector with prev/next buttons */}
            <div className="flex items-center gap-1">
              <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mr-1" aria-hidden="true" />
              <button
                type="button"
                onClick={() => cycleTemplate(-1)}
                className="h-7 w-6 flex items-center justify-center rounded-lg border border-border bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Previous Template"
                aria-label="Previous Template"
              >
                <ChevronLeft className="size-3.5" aria-hidden="true" />
              </button>
              <select
                value={activeTemplate}
                onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
                className="h-7 pl-2.5 pr-7 bg-secondary border border-border rounded-lg text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted transition-all cursor-pointer appearance-none text-foreground"
                aria-label="Select Template"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238e91a0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
              >
                {TEMPLATE_OPTIONS.map((tpl) => (
                  <option key={tpl.id} value={tpl.id} className="bg-card text-foreground">{tpl.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => cycleTemplate(1)}
                className="h-7 w-6 flex items-center justify-center rounded-lg border border-border bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Next Template"
                aria-label="Next Template"
              >
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Accent color swatches */}
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold hidden sm:block">Accent</span>
              <div className="flex items-center gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'themeColor', value: c.id })}
                    className={`rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      (resumeData.themeColor || 'slate') === c.id
                        ? 'ring-2 ring-offset-2 ring-offset-background scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex, height: '18px', width: '18px' }}
                    title={c.name}
                    aria-label={`${c.name} accent`}
                  />
                ))}
              </div>
            </div>

            {/* Typography & Margin settings */}
            <div className="flex items-center gap-1.5 border-l border-border pl-3">
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
                  className="h-7 px-2 bg-secondary border border-border rounded-lg text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted transition-all cursor-pointer text-foreground"
                >
                  {options.map(([val, optLabel]) => <option key={val} value={val} className="bg-card text-foreground">{optLabel}</option>)}
                </select>
              ))}
            </div>

            {/* Heading Case Preference (UPPER / Title / lower) */}
            <div className="flex items-center gap-1.5 border-l border-border pl-3">
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold hidden md:block">Headings</span>
              <div className="inline-flex items-center p-0.5 rounded-lg bg-secondary border border-border" role="group" aria-label="Section heading case">
                {HEADING_CASE_OPTIONS.map((opt) => {
                  const active = currentHeadingCase === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_FIELD', field: 'headingCase', value: opt.value })}
                      aria-pressed={active}
                      aria-label={opt.label}
                      title={opt.label}
                      className={`h-6 px-2 rounded-md text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-card text-foreground shadow-sm border border-border/80'
                          : 'text-muted-foreground hover:text-foreground border border-transparent'
                      }`}
                    >
                      {opt.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons — pushed right */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-[#0fbcb0]/60 bg-[#c3faf5]/30 dark:bg-[#0fbcb0]/15 text-[#187574] dark:text-[#c3faf5] hover:bg-[#0fbcb0]/25 transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
                title="Import Existing Resume (PDF, DOCX, Text, Image, JSON)"
                aria-label="Import Existing Resume"
              >
                <FileUp className="size-3 text-[#0fbcb0]" aria-hidden="true" />
                <span>Import Resume</span>
              </button>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-[#ffd02f] bg-[#fff8e0] dark:bg-[#242428] text-[#746019] dark:text-[#ffd02f] hover:bg-[#ffd02f]/30 transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
                title="Load demo data"
                aria-label="Load demo data"
              >
                <Sparkles className="size-3 text-[#fcb900]" aria-hidden="true" />
                <span className="hidden sm:inline">Demo</span>
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs font-medium whitespace-nowrap shrink-0"
                title="Export JSON backup"
                aria-label="Export profile as JSON"
              >
                <FileJson className="size-3 text-[#4262ff]" aria-hidden="true" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors text-xs font-medium whitespace-nowrap shrink-0"
                title="Reset data"
                aria-label="Reset profile data"
              >
                <Trash2 className="size-3" aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main split panel ─────────────────────────────────────────────── */}
      <div className="flex-grow max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Form column */}
          <div className={`xl:col-span-5 ${viewMode === 'preview' ? 'hidden' : ''} xl:block`}>
            <ResumeForm
              resumeData={resumeData}
              dispatch={dispatch}
              onOpenImport={() => setShowImportModal(true)}
              initialOpenAts={searchParams.get('tab') === 'audit'}
            />
          </div>

          {/* Preview column */}
          <div className={`xl:col-span-7 ${viewMode === 'form' ? 'hidden' : ''} xl:block xl:sticky xl:top-[116px]`}>
            <div className="xl:max-h-[calc(100vh-132px)] xl:overflow-y-auto pr-0.5">
              <ResumePreview data={resumeData} template={activeTemplate} isBuilder={true} />
            </div>
          </div>
        </div>
      </div>

      <ImportResumeModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={(parsed) => dispatch({ type: 'LOAD_DRAFT', data: parsed })}
      />
    </div>
  );
};

export default BuilderPage;