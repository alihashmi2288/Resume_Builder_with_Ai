import * as React from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../../types';
import { type Action } from '../../hooks/useResumeStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { 
  Bot, Plus, Trash2, Sparkles, Loader2, SearchCheck, ChevronUp, ChevronDown, 
  CheckCircle2, AlertCircle, Check, ShieldCheck, FileUp, Wand2, Eye, EyeOff, X,
  GripVertical, RotateCcw
} from 'lucide-react';
import { 
  generateAISummary, 
  enhanceAIBulletPoint, 
  suggestAISkills, 
  generateAIResume, 
  analyzeResumeATS,
  tailorAISummary
} from '../../services/gemini';
import {
  DEFAULT_SECTION_ORDER,
  evaluateResumeReadiness,
  getSkillList,
  isSectionEnabled,
  normalizeSectionOrder,
  reorderSectionList,
  type SectionId,
} from '../../lib/resumeUtils';
import {
  SortableDndList,
  SortableEntryCard,
  SortableSectionChip,
  SortableSectionWrapper,
} from './SortableResumeBlocks';

interface ResumeFormProps {
  resumeData: ResumeData;
  dispatch: React.Dispatch<Action>;
  onOpenImport?: () => void;
  initialOpenAts?: boolean;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
      {...props} 
      className="w-full h-11 px-4 py-2 bg-white dark:bg-[#1a1a1e] border border-[#c7cad5] dark:border-[#3b3b45] rounded-lg text-sm text-[#1c1c1e] dark:text-white transition-all focus-visible:border-[#4262ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4262ff]/20 disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea 
      {...props} 
      className="w-full min-h-[95px] px-4 py-2.5 bg-white dark:bg-[#1a1a1e] border border-[#c7cad5] dark:border-[#3b3b45] rounded-lg text-sm text-[#1c1c1e] dark:text-white transition-all focus-visible:border-[#4262ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4262ff]/20 disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const FieldGroup: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
    <label className="flex flex-col gap-1.5 cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider">{label}</span>
          {hint && <span className="text-[10px] text-[#8e91a0]">{hint}</span>}
        </div>
        {children}
    </label>
);

const AIButton: React.FC<{ onClick: () => void; isLoading: boolean; children: React.ReactNode; className?: string }> = ({ 
  onClick, 
  isLoading, 
  children,
  className = ""
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={`bg-[#ffd02f] hover:bg-[#fcb900] active:scale-[0.98] text-[#1c1c1e] inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-none ${className}`}
    >
        {isLoading
            ? <Loader2 className="size-3.5 animate-spin shrink-0" aria-hidden="true" />
            : <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
        }
        {children}
    </button>
);

const ACTION_VERBS = ["Spearheaded", "Architected", "Engineered", "Accelerated", "Optimized", "Orchestrated", "Formulated", "Scaled", "Streamlined"];

export const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, dispatch, onOpenImport, initialOpenAts = false }) => {
    const { showToast } = useToast();
    const [openSections, setOpenSections] = React.useState<string[]>(() =>
        initialOpenAts
            ? ['ats-optimizer', 'personal', 'summary', 'experience']
            : ['personal', 'summary', 'skills', 'experience']
    );

    React.useEffect(() => {
        if (initialOpenAts) {
            setOpenSections((prev) => (prev.includes('ats-optimizer') ? prev : ['ats-optimizer', ...prev]));
        }
    }, [initialOpenAts]);
    const [loadingStates, setLoadingStates] = React.useState({
        summary: false,
        tailorSummary: false,
        skills: false,
        fullResume: false,
        ats: false,
        experience: {} as Record<string, boolean>,
    });
    const [jobTitle, setJobTitle] = React.useState('Software Engineer');
    const [jobDescription, setJobDescription] = React.useState('');
    const [skillInput, setSkillInput] = React.useState('');
    const [showRawSkills, setShowRawSkills] = React.useState(false);
    
    // ATS Audit State
    const [atsScore, setAtsScore] = React.useState<number | null>(null);
    const [atsSuggestions, setAtsSuggestions] = React.useState<string[]>([]);
    const [atsKeywords, setAtsKeywords] = React.useState<string[]>([]);

    // Calculate Real Resume Readiness Score
    const readiness = React.useMemo(() => evaluateResumeReadiness(resumeData), [resumeData]);
    const orderedSections = React.useMemo(() => normalizeSectionOrder(resumeData.sectionOrder), [resumeData.sectionOrder]);
    const isCustomOrder = orderedSections.join(',') !== DEFAULT_SECTION_ORDER.join(',');
    const skillTags = React.useMemo(() => getSkillList(resumeData.skills), [resumeData.skills]);

    const handleFieldChange = (field: keyof Omit<ResumeData, 'experience' | 'education' | 'projects'>, value: string) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const handleItemChange = (field: 'experience' | 'education' | 'projects', id: string, data: Partial<Experience | Education | Project>) => {
        dispatch({ type: 'UPDATE_ITEM', field, id, data });
    };
    
    const handleAddItem = (field: 'experience' | 'education' | 'projects') => {
        dispatch({ type: 'ADD_ITEM', field });
        showToast(`Added new ${field} entry.`, 'info');
    };

    const handleDeleteItem = (field: 'experience' | 'education' | 'projects', id: string) => {
        dispatch({ type: 'DELETE_ITEM', field, id });
        showToast(`Entry removed.`, 'info');
    };

    const handleGenerateFullResume = async () => {
        if (!jobTitle.trim()) {
            showToast("Please enter a job title to generate a tailored draft.", "warning");
            return;
        }
        setLoadingStates(prev => ({...prev, fullResume: true}));
        try {
            const aiResume = await generateAIResume(jobTitle);
            dispatch({ type: 'LOAD_DRAFT', data: aiResume });
            showToast(`Generated full resume for "${jobTitle}"!`, "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to generate resume draft.", "error");
        } finally {
            setLoadingStates(prev => ({...prev, fullResume: false}));
        }
    };
    
    const handleGenerateSummary = async () => {
        setLoadingStates(prev => ({...prev, summary: true}));
        try {
            const { summary, ...rest } = resumeData;
            const resumeText = Object.entries(rest).map(([key, value]) => `${key}:\n${JSON.stringify(value, null, 2)}`).join('\n\n');
            const newSummary = await generateAISummary(resumeText);
            handleFieldChange('summary', newSummary);
            showToast("Professional summary generated!", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to generate summary.", "error");
        } finally {
            setLoadingStates(prev => ({...prev, summary: false}));
        }
    };

    const handleSuggestSkills = async () => {
        setLoadingStates(prev => ({...prev, skills: true}));
        try {
            const targetRole = resumeData.experience[0]?.title || jobTitle || 'relevant field';
            const newSkills = await suggestAISkills(targetRole);
            handleFieldChange('skills', newSkills);
            showToast(`Skills suggested for ${targetRole}!`, "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to suggest skills.", "error");
        } finally {
            setLoadingStates(prev => ({...prev, skills: false}));
        }
    };

    const handleEnhanceDescription = async (expId: string, description: string) => {
        if (!description.trim()) {
            showToast("Please enter a bullet point or task first to enhance it.", "warning");
            return;
        }
        setLoadingStates(prev => ({ ...prev, experience: { ...prev.experience, [expId]: true } }));
        try {
            const context = `Job Title: ${resumeData.experience.find(e => e.id === expId)?.title || 'Professional'}. Resume Summary: ${resumeData.summary}`;
            const enhancedDesc = await enhanceAIBulletPoint(description, context);
            handleItemChange('experience', expId, { description: enhancedDesc });
            showToast("Bullet points rewritten with STAR action verbs!", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to enhance bullet point.", "error");
        } finally {
            setLoadingStates(prev => ({ ...prev, experience: { ...prev.experience, [expId]: false } }));
        }
    };
    
    const handleAnalyzeKeywords = async () => {
        if (!jobDescription.trim()) {
            showToast("Please paste a job description first.", "warning");
            return;
        }
        setLoadingStates(prev => ({ ...prev, ats: true }));
        try {
            const { name, email, phone, website, themeColor, fontSize, lineHeight, margins, ...contentOnly } = resumeData;
            const resumeText = JSON.stringify(contentOnly);
            const result = await analyzeResumeATS(resumeText, jobDescription);
            setAtsScore(result.score);
            setAtsSuggestions(result.suggestions || []);
            setAtsKeywords(result.missingKeywords || []);
            showToast(`ATS match audit complete: ${result.score}% match!`, "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to complete ATS audit.", "error");
        } finally {
            setLoadingStates(prev => ({ ...prev, ats: false }));
        }
    };

    const handleTailorSummary = async () => {
        if (!jobDescription.trim()) {
            showToast("Please paste a target job description first.", "warning");
            return;
        }
        setLoadingStates(prev => ({ ...prev, tailorSummary: true }));
        try {
            const tailored = await tailorAISummary(resumeData, jobDescription);
            handleFieldChange('summary', tailored);
            showToast("Professional summary tailored to target job!", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to tailor summary.", "error");
        } finally {
            setLoadingStates(prev => ({ ...prev, tailorSummary: false }));
        }
    };

    // 1-Click Keyword Insertion
    const handleAddKeywordToSkills = (keyword: string) => {
        const currentSkills = resumeData.skills ? resumeData.skills.trim() : '';
        const skillsList = currentSkills ? currentSkills.split(',').map(s => s.trim().toLowerCase()) : [];
        if (skillsList.includes(keyword.toLowerCase())) {
            showToast(`"${keyword}" is already in your skills.`, "info");
            return;
        }
        const updated = currentSkills ? `${currentSkills}, ${keyword}` : keyword;
        dispatch({ type: 'SET_FIELD', field: 'skills', value: updated });
        showToast(`Added "${keyword}" to your skills!`, "success");
    };

    // Append action verb to an experience description
    const handleAppendActionVerb = (expId: string, currentDesc: string, verb: string) => {
        const line = currentDesc.trim() ? `${currentDesc}\n• ${verb} ` : `• ${verb} `;
        handleItemChange('experience', expId, { description: line });
    };

    // Reordering & visibility handlers
    const SECTION_LABELS: Record<SectionId, string> = {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
    };

    const handleToggleSection = (sectionId: SectionId, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const currentlyEnabled = isSectionEnabled(resumeData, sectionId);
        dispatch({ type: 'TOGGLE_SECTION_VISIBILITY', sectionId, visible: !currentlyEnabled });
        if (currentlyEnabled) {
            setOpenSections((prev) => prev.filter((id) => id !== sectionId));
            showToast(`${SECTION_LABELS[sectionId]} hidden from resume.`, 'info');
        } else {
            setOpenSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
            showToast(`${SECTION_LABELS[sectionId]} shown on resume.`, 'success');
        }
    };

    const handleAddSkillTag = (rawValue: string) => {
        const candidates = rawValue
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (candidates.length === 0) return;

        const existingLower = new Set(skillTags.map((s) => s.toLowerCase()));
        const additions: string[] = [];
        for (const item of candidates) {
            if (!existingLower.has(item.toLowerCase())) {
                existingLower.add(item.toLowerCase());
                additions.push(item);
            }
        }
        if (additions.length === 0) {
            setSkillInput('');
            showToast('Skill is already listed.', 'info');
            return;
        }
        const nextSkills = [...skillTags, ...additions].join(', ');
        handleFieldChange('skills', nextSkills);
        setSkillInput('');
    };

    const handleRemoveSkillTag = (indexToRemove: number) => {
        const nextSkills = skillTags.filter((_, idx) => idx !== indexToRemove).join(', ');
        handleFieldChange('skills', nextSkills);
    };

    const handleMoveSection = (sectionId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const currentOrder = [...orderedSections];
        const index = currentOrder.indexOf(sectionId);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= currentOrder.length) return;

        const temp = currentOrder[index];
        currentOrder[index] = currentOrder[newIndex];
        currentOrder[newIndex] = temp;

        dispatch({ type: 'SET_FIELD', field: 'sectionOrder', value: currentOrder });
    };

    const handleSectionReorder = (activeId: string, overId: string) => {
        if (!activeId || !overId || activeId === overId) return;
        const nextOrder = reorderSectionList(orderedSections, activeId, overId);
        if (nextOrder.join(',') !== orderedSections.join(',')) {
            dispatch({ type: 'SET_FIELD', field: 'sectionOrder', value: nextOrder });
            const movedLabel = SECTION_LABELS[activeId as SectionId] || activeId;
            const targetLabel = SECTION_LABELS[overId as SectionId] || overId;
            showToast(`Moved ${movedLabel} to ${targetLabel}'s position.`, 'success');
        }
    };

    const handleEntriesReorder = (
        field: 'experience' | 'education' | 'projects',
        activeId: string,
        overId: string
    ) => {
        if (!activeId || !overId || activeId === overId) return;
        dispatch({ type: 'REORDER_ITEMS', field, activeId, overId });
        const label = field === 'experience' ? 'experience' : field === 'education' ? 'education' : 'project';
        showToast(`Reordered ${label} entry.`, 'success');
    };

    const handleResetSectionOrder = () => {
        dispatch({ type: 'SET_FIELD', field: 'sectionOrder', value: [...DEFAULT_SECTION_ORDER] });
        showToast('Section order reset to default.', 'info');
    };

    const renderSectionControls = (sectionId: SectionId) => {
        const index = orderedSections.indexOf(sectionId);
        const enabled = isSectionEnabled(resumeData, sectionId);
        const label = SECTION_LABELS[sectionId];
        
        return (
            <div className="flex items-center gap-1 ml-auto no-print">
                {!enabled && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mr-1">
                        Hidden
                    </span>
                )}
                <button
                    type="button"
                    onClick={(e) => handleToggleSection(sectionId, e)}
                    className={`size-6 flex items-center justify-center rounded transition-colors cursor-pointer ${
                        enabled
                            ? 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                    }`}
                    title={enabled ? `Hide ${label} from resume` : `Show ${label} on resume`}
                    aria-label={enabled ? `Hide ${label} section` : `Show ${label} section`}
                >
                    {enabled ? <Eye className="size-3.5" aria-hidden="true" /> : <EyeOff className="size-3.5" aria-hidden="true" />}
                </button>
                <button
                    type="button"
                    onClick={(e) => handleMoveSection(sectionId, 'up', e)}
                    className={`size-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors ${
                        index <= 0 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                    }`}
                    title="Move Section Up"
                    aria-label={`Move ${label} section up`}
                    disabled={index <= 0}
                >
                    <ChevronUp className="size-4" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={(e) => handleMoveSection(sectionId, 'down', e)}
                    className={`size-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors ${
                        index >= orderedSections.length - 1 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                    }`}
                    title="Move Section Down"
                    aria-label={`Move ${label} section down`}
                    disabled={index >= orderedSections.length - 1}
                >
                    <ChevronDown className="size-4" aria-hidden="true" />
                </button>
            </div>
        );
    };

    const renderSectionHeaderRow = (
        sectionId: SectionId,
        title: string,
        handleProps: {
            setActivatorNodeRef: (element: HTMLElement | null) => void;
            attributes: Record<string, any>;
            listeners: Record<string, any> | undefined;
        }
    ) => (
        <div data-section-header={sectionId} className="flex items-center w-full rounded-lg">
            <button
                type="button"
                ref={handleProps.setActivatorNodeRef}
                data-section-drag-handle={sectionId}
                {...handleProps.attributes}
                {...handleProps.listeners}
                className="inline-flex items-center justify-center px-1.5 py-2 -ml-1.5 mr-1 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-secondary cursor-grab active:cursor-grabbing shrink-0 select-none touch-none"
                title={`Drag to reorder ${SECTION_LABELS[sectionId]}`}
                aria-label={`Drag handle for ${SECTION_LABELS[sectionId]}`}
            >
                <GripVertical className="size-4" aria-hidden="true" />
            </button>
            <AccordionTrigger className="font-bold text-sm flex-grow cursor-pointer">
                {title}
            </AccordionTrigger>
            {renderSectionControls(sectionId)}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Resume Readiness & Health Widget */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="size-4" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-foreground">Resume Readiness Score</h3>
                            <p className="text-[11px] text-muted-foreground">Recruiter impact & ATS structural check</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black tabular-nums ${
                            readiness.score >= 80 ? 'text-emerald-500' : readiness.score >= 50 ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                            {readiness.score}%
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div 
                    role="progressbar" 
                    aria-valuenow={readiness.score} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                    className="w-full h-2 rounded-full bg-muted overflow-hidden"
                >
                    <div 
                        className={`h-full rounded-full transition-[width,background-color] duration-700 ease-out ${
                            readiness.score >= 80 ? 'bg-emerald-500' : readiness.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${readiness.score}%` }}
                    />
                </div>

                {/* Checklist pills (only enabled sections) */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    {([
                        ['Identity', readiness.checks.hasIdentity, true],
                        ['Summary', readiness.checks.hasSummary, isSectionEnabled(resumeData, 'summary')],
                        ['Skills', readiness.checks.hasSkills, isSectionEnabled(resumeData, 'skills')],
                        ['Experience', readiness.checks.hasExperience, isSectionEnabled(resumeData, 'experience')],
                        ['Metrics', readiness.checks.hasMetrics, isSectionEnabled(resumeData, 'experience') || (isSectionEnabled(resumeData, 'projects') && resumeData.projects.length > 0)],
                        ['Education', readiness.checks.hasEducation, isSectionEnabled(resumeData, 'education')],
                    ] as const)
                        .filter(([, , visible]) => visible)
                        .map(([label, ok]) => (
                            <span
                                key={label}
                                className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all duration-300 ${
                                    ok ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 scale-100' : 'bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                {ok && <Check className="size-2.5" />} {label}
                            </span>
                        ))}
                </div>

                {readiness.tips.length > 0 && (
                    <p className="text-[11px] text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                        <span className="font-semibold text-foreground">Next boost:</span> {readiness.tips[0]}
                    </p>
                )}
            </div>

            {/* AI Assistant Generator & Smart Import Card */}
            <div className="relative p-5 rounded-2xl bg-[#fff8e0] dark:bg-[#1a1a1e] border border-[#ffd02f]/40 dark:border-[#2c2c34] shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-[#ffd02f] shrink-0">
                            <Bot className="size-5 text-[#1c1c1e]" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#1c1c1e] dark:text-white tracking-tight text-balance">AI Assistance</h3>
                            <p className="text-[11px] text-[#746019] dark:text-[#a5a8b5] text-pretty">Draft, import, or tailor your resume in seconds</p>
                        </div>
                    </div>
                    {onOpenImport && (
                        <button
                            type="button"
                            onClick={onOpenImport}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white dark:bg-[#242428] border border-[#c7cad5] dark:border-[#3b3b45] text-[11px] font-semibold text-[#1c1c1e] dark:text-white hover:border-[#4262ff] transition-colors whitespace-nowrap shrink-0"
                        >
                            <FileUp className="size-3.5 text-[#0fbcb0]" />
                            Import Existing Resume
                        </button>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        value={jobTitle} 
                        onChange={e => setJobTitle(e.target.value)} 
                        placeholder="Target Role (e.g. Senior Frontend Engineer)" 
                        autoComplete="off" 
                    />
                    <AIButton onClick={handleGenerateFullResume} isLoading={loadingStates.fullResume} className="h-11 px-5">
                        Generate Draft
                    </AIButton>
                </div>
            </div>

            {/* Quick Section Order & Visibility Strip (dnd-kit Sortable) */}
            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-foreground">Included Sections &amp; Order</span>
                    <div className="flex items-center gap-2.5">
                        <span className="text-[11px] text-muted-foreground">Drag to reorder &middot; Click eye to hide</span>
                        {isCustomOrder && (
                            <button
                                type="button"
                                onClick={handleResetSectionOrder}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4262ff] hover:underline whitespace-nowrap shrink-0"
                            >
                                <RotateCcw className="size-3" aria-hidden="true" />
                                Reset order
                            </button>
                        )}
                    </div>
                </div>
                <SortableDndList items={orderedSections} strategy="rect" onReorder={handleSectionReorder}>
                    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Reorder and toggle included resume sections">
                        {orderedSections.map((id) => {
                            const typedId = id as SectionId;
                            return (
                                <SortableSectionChip
                                    key={typedId}
                                    id={typedId}
                                    label={SECTION_LABELS[typedId]}
                                    enabled={isSectionEnabled(resumeData, typedId)}
                                    onToggle={(e) => handleToggleSection(typedId, e)}
                                />
                            );
                        })}
                    </div>
                </SortableDndList>
            </div>

            <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full border border-border rounded-2xl bg-card overflow-hidden divide-y divide-border">
                
                {/* ATS Audit Dashboard */}
                <AccordionItem value="ats-optimizer" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">
                        <div className="flex items-center gap-2">
                            <SearchCheck className="size-4 text-primary" />
                            <span>ATS Auditor & Keyword Optimizer</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                        <FieldGroup label="Target Job Description" hint="Paste role requirements to analyze match">
                            <Textarea 
                                value={jobDescription} 
                                onChange={e => setJobDescription(e.target.value)} 
                                rows={5} 
                                placeholder="Paste the job requirements description to get your match rating and keyword checklist…" 
                            />
                        </FieldGroup>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAnalyzeKeywords}
                                disabled={loadingStates.ats}
                                className="btn-miro-primary inline-flex items-center gap-2 h-9 px-5 rounded-full text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loadingStates.ats ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <SearchCheck className="size-3.5" aria-hidden="true" />}
                                Audit Resume Match
                            </button>
                            <button
                                type="button"
                                onClick={handleTailorSummary}
                                disabled={loadingStates.tailorSummary}
                                className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border bg-secondary hover:bg-muted text-foreground text-xs font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loadingStates.tailorSummary ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Wand2 className="size-3.5 text-[#4262ff]" aria-hidden="true" />}
                                Tailor Summary to Job
                            </button>
                        </div>
                        
                        {/* Audit score & detailed suggestions feedback */}
                        {atsScore !== null && (
                            <div className="space-y-4 border-t pt-4 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    {/* Circular Progress Gauge */}
                                    <div className="flex flex-col items-center justify-center p-4 bg-muted/20 backdrop-blur-md rounded-2xl border border-border/40 shadow-inner col-span-1">
                                        <div className="relative h-20 w-20">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="32"
                                                    className="stroke-muted"
                                                    strokeWidth="6"
                                                    fill="transparent"
                                                />
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="32"
                                                    className={`transition-all duration-700 ease-out ${
                                                        atsScore >= 75 ? 'stroke-emerald-500' : atsScore >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'
                                                    }`}
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    fill="transparent"
                                                    strokeDasharray={2 * Math.PI * 32}
                                                    strokeDashoffset={2 * Math.PI * 32 * (1 - atsScore / 100)}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-lg font-black text-foreground tabular-nums">{atsScore}%</span>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-pretty">Match</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] mt-2 font-bold text-muted-foreground uppercase tracking-wider text-pretty">ATS Score</span>
                                    </div>
                                    
                                    {/* Audit Rating Callout */}
                                    <div className="sm:col-span-2 space-y-1">
                                        <h4 className="text-sm font-bold flex items-center gap-1.5">
                                            {atsScore >= 75 ? (
                                                <><CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" /><span className="text-emerald-500 text-balance">Strong Match!</span></>
                                            ) : atsScore >= 50 ? (
                                                <><AlertCircle className="size-4 text-amber-500" aria-hidden="true" /><span className="text-amber-500 text-balance">Good Potential</span></>
                                            ) : (
                                                <><AlertCircle className="size-4 text-rose-500" aria-hidden="true" /><span className="text-rose-500 text-balance">Missing Core Keywords</span></>
                                            )}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                                            {atsScore >= 75 
                                                ? "Your resume matches the target job requirements closely. Export as a selectable PDF to submit."
                                                : "Click any missing keyword below to instantly insert it into your skills!"}
                                        </p>
                                    </div>
                                </div>

                                {/* Target Keywords - 1-Click Clickable Chips */}
                                {atsKeywords.length > 0 && (
                                    <div className="p-4 bg-muted/30 border border-border/50 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Missing Keywords (Click to add to skills):
                                            </h4>
                                            <span className="text-[10px] text-primary font-semibold">1-Click Insert</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {atsKeywords.map(keyword => (
                                                <button
                                                    key={keyword}
                                                    type="button"
                                                    onClick={() => handleAddKeywordToSkills(keyword)}
                                                    className="inline-flex items-center gap-1 text-xs bg-background border border-border hover:border-primary hover:text-primary px-3 py-1 rounded-full font-medium shadow-sm transition-all active:scale-95 group"
                                                    title={`Click to add "${keyword}" to skills`}
                                                >
                                                    <Plus className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span>{keyword}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Checklist Suggestions */}
                                {atsSuggestions.length > 0 && (
                                    <div className="p-4 bg-card border border-border/50 rounded-xl space-y-2">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Content Audit Checklist:</h4>
                                        <ul className="space-y-1.5">
                                            {atsSuggestions.map((suggestion, index) => (
                                                <li key={index} className="text-xs flex items-start gap-2 text-foreground/90 font-medium">
                                                    <span className="size-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                    <span className="text-pretty">{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Personal Details */}
                <AccordionItem value="personal" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Personal Details & Links</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldGroup label="Full Name">
                                <Input 
                                    value={resumeData.name} 
                                    onChange={e => handleFieldChange('name', e.target.value)} 
                                    name="name" 
                                    autoComplete="name" 
                                    placeholder="Syed Ali Hashmi"
                                />
                            </FieldGroup>
                            <FieldGroup label="Email">
                                <Input 
                                    type="email" 
                                    value={resumeData.email} 
                                    onChange={e => handleFieldChange('email', e.target.value)} 
                                    name="email" 
                                    autoComplete="email" 
                                    spellCheck={false} 
                                    placeholder="ali@example.com"
                                />
                            </FieldGroup>
                            <FieldGroup label="Phone">
                                <Input 
                                    type="tel" 
                                    value={resumeData.phone} 
                                    onChange={e => handleFieldChange('phone', e.target.value)} 
                                    name="phone" 
                                    autoComplete="tel" 
                                    placeholder="+1 (555) 019-2834"
                                />
                            </FieldGroup>
                            <FieldGroup label="Website / Portfolio">
                                <Input 
                                    type="url" 
                                    value={resumeData.website} 
                                    onChange={e => handleFieldChange('website', e.target.value)} 
                                    name="website" 
                                    autoComplete="url" 
                                    placeholder="alihashmi.dev"
                                />
                            </FieldGroup>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Dynamically Ordered Accordion Sections (dnd-kit Sortable) */}
                <SortableDndList items={orderedSections} strategy="vertical" onReorder={handleSectionReorder}>
                    <div className="divide-y divide-border">
                        {orderedSections.map((sectionId) => {
                            if (sectionId === 'summary') {
                                const enabled = isSectionEnabled(resumeData, 'summary');
                                return (
                                    <SortableSectionWrapper key="summary" id="summary">
                                        {(handleProps) => (
                                            <AccordionItem value="summary" className={`border-b-0 px-4 py-1 ${!enabled ? 'opacity-65' : ''}`}>
                                                {renderSectionHeaderRow('summary', 'Professional Summary', handleProps)}
                                                <AccordionContent className="space-y-3 pb-4">
                                                    {!enabled && (
                                                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                                                            <span>Hidden from your resume preview.</span>
                                                            <button type="button" onClick={() => handleToggleSection('summary')} className="font-semibold text-primary hover:underline whitespace-nowrap">Show Section</button>
                                                        </div>
                                                    )}
                                                    <FieldGroup label="Summary Pitch" hint="2-3 impactful sentences highlighting your value">
                                                        <Textarea 
                                                            value={resumeData.summary} 
                                                            onChange={e => handleFieldChange('summary', e.target.value)} 
                                                            rows={4} 
                                                            placeholder="Results-oriented engineer with 4+ years of experience leading projects..." 
                                                        />
                                                    </FieldGroup>
                                                    <AIButton onClick={handleGenerateSummary} isLoading={loadingStates.summary}>
                                                        Generate AI Summary
                                                    </AIButton>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )}
                                    </SortableSectionWrapper>
                                );
                            }
                            if (sectionId === 'skills') {
                                const enabled = isSectionEnabled(resumeData, 'skills');
                                return (
                                    <SortableSectionWrapper key="skills" id="skills">
                                        {(handleProps) => (
                                            <AccordionItem value="skills" className={`border-b-0 px-4 py-1 ${!enabled ? 'opacity-65' : ''}`}>
                                                {renderSectionHeaderRow('skills', 'Skills', handleProps)}
                                                <AccordionContent className="space-y-3 pb-4">
                                                    {!enabled && (
                                                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                                                            <span>Hidden from your resume preview.</span>
                                                            <button type="button" onClick={() => handleToggleSection('skills')} className="font-semibold text-primary hover:underline whitespace-nowrap">Show Section</button>
                                                        </div>
                                                    )}

                                                    {/* Interactive Skill Tag Editor */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider">Skills</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowRawSkills((prev) => !prev)}
                                                                className="text-[11px] font-medium text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                                                            >
                                                                {showRawSkills ? 'Use tag editor' : 'Edit as text list'}
                                                            </button>
                                                        </div>

                                                        {showRawSkills ? (
                                                            <Textarea 
                                                                value={resumeData.skills} 
                                                                onChange={e => handleFieldChange('skills', e.target.value)} 
                                                                rows={3} 
                                                                placeholder="React, TypeScript, Node.js, Python, AWS..." 
                                                                aria-label="Core skills comma-separated"
                                                            />
                                                        ) : (
                                                            <>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        value={skillInput}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            if (val.includes(',')) {
                                                                                handleAddSkillTag(val);
                                                                            } else {
                                                                                setSkillInput(val);
                                                                            }
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault();
                                                                                handleAddSkillTag(skillInput);
                                                                            }
                                                                        }}
                                                                        placeholder="Type a skill and press Enter…"
                                                                        aria-label="Add a skill"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => handleAddSkillTag(skillInput)}
                                                                        className="h-11 px-4 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0"
                                                                    >
                                                                        <Plus className="size-3.5 mr-1" aria-hidden="true" />
                                                                        Add
                                                                    </Button>
                                                                </div>

                                                                {skillTags.length > 0 ? (
                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                        {skillTags.map((skill, idx) => (
                                                                            <span
                                                                                key={`${skill}-${idx}`}
                                                                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-foreground"
                                                                            >
                                                                                <span>{skill}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleRemoveSkillTag(idx)}
                                                                                    className="size-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                                                    aria-label={`Remove skill ${skill}`}
                                                                                >
                                                                                    <X className="size-3" aria-hidden="true" />
                                                                                </button>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-muted-foreground">No skills added yet.</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <AIButton onClick={handleSuggestSkills} isLoading={loadingStates.skills}>
                                                        Suggest Role Skills
                                                    </AIButton>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )}
                                    </SortableSectionWrapper>
                                );
                            }
                            if (sectionId === 'experience') {
                                const enabled = isSectionEnabled(resumeData, 'experience');
                                return (
                                    <SortableSectionWrapper key="experience" id="experience">
                                        {(handleProps) => (
                                            <AccordionItem value="experience" className={`border-b-0 px-4 py-1 ${!enabled ? 'opacity-65' : ''}`}>
                                                {renderSectionHeaderRow('experience', 'Work Experience', handleProps)}
                                                <AccordionContent className="space-y-4 pb-4">
                                                    {!enabled && (
                                                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                                                            <span>Hidden from your resume preview.</span>
                                                            <button type="button" onClick={() => handleToggleSection('experience')} className="font-semibold text-primary hover:underline whitespace-nowrap">Show Section</button>
                                                        </div>
                                                    )}
                                                    {resumeData.experience.length === 0 && (
                                                        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
                                                            <p className="text-xs text-muted-foreground">No work experience added. If you don&apos;t need this section, you can hide it cleanly.</p>
                                                            {enabled && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleSection('experience')}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                                                >
                                                                    <EyeOff className="size-3.5" aria-hidden="true" />
                                                                    Hide Work Experience from Resume
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    <SortableDndList
                                                        items={resumeData.experience.map((e) => e.id)}
                                                        strategy="vertical"
                                                        onReorder={(activeId, overId) => handleEntriesReorder('experience', activeId, overId)}
                                                    >
                                                        <div className="space-y-4">
                                                            {resumeData.experience.map((exp, idx) => (
                                                                <SortableEntryCard
                                                                    key={exp.id}
                                                                    id={exp.id}
                                                                    title={[exp.title, exp.company].filter(Boolean).join(' · ') || `Role #${idx + 1}`}
                                                                    kindLabel="Work Experience"
                                                                    actions={
                                                                        <>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7" 
                                                                                onClick={() => dispatch({ type: 'MOVE_ITEM_UP', field: 'experience', id: exp.id })}
                                                                                disabled={idx === 0}
                                                                                title="Move Up"
                                                                                aria-label="Move Experience Entry Up"
                                                                            >
                                                                                <ChevronUp className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7" 
                                                                                onClick={() => dispatch({ type: 'MOVE_ITEM_DOWN', field: 'experience', id: exp.id })}
                                                                                disabled={idx === resumeData.experience.length - 1}
                                                                                title="Move Down"
                                                                                aria-label="Move Experience Entry Down"
                                                                            >
                                                                                <ChevronDown className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                                                                onClick={() => handleDeleteItem('experience', exp.id)}
                                                                                title="Delete Entry"
                                                                                aria-label="Delete Experience Entry"
                                                                            >
                                                                                <Trash2 className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                        </>
                                                                    }
                                                                >
                                                                    <div className="space-y-3">
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                            <FieldGroup label="Company">
                                                                                <Input 
                                                                                    value={exp.company} 
                                                                                    onChange={e => handleItemChange('experience', exp.id, { company: e.target.value })} 
                                                                                    placeholder="Google, Stripe, Acme Corp..." 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                            <FieldGroup label="Job Title">
                                                                                <Input 
                                                                                    value={exp.title} 
                                                                                    onChange={e => handleItemChange('experience', exp.id, { title: e.target.value })} 
                                                                                    placeholder="Senior Software Engineer" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                            <FieldGroup label="Start Date">
                                                                                <Input 
                                                                                    value={exp.startDate} 
                                                                                    onChange={e => handleItemChange('experience', exp.id, { startDate: e.target.value })} 
                                                                                    placeholder="e.g. 2021 or Jan 2021" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                            <div className="flex flex-col gap-1.5">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</span>
                                                                                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-primary">
                                                                                        <input 
                                                                                            type="checkbox"
                                                                                            checked={exp.endDate.toLowerCase() === 'present'}
                                                                                            onChange={(e) => {
                                                                                                handleItemChange('experience', exp.id, { 
                                                                                                    endDate: e.target.checked ? 'Present' : '' 
                                                                                                });
                                                                                            }}
                                                                                            className="rounded accent-primary cursor-pointer"
                                                                                        />
                                                                                        <span>Current Role</span>
                                                                                    </label>
                                                                                </div>
                                                                                <Input 
                                                                                    value={exp.endDate} 
                                                                                    onChange={e => handleItemChange('experience', exp.id, { endDate: e.target.value })} 
                                                                                    placeholder="e.g. Present or Dec 2023" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* Action verb quick inserters */}
                                                                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                                                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Action Verbs:</span>
                                                                            {ACTION_VERBS.slice(0, 6).map((verb) => (
                                                                                <button
                                                                                    key={verb}
                                                                                    type="button"
                                                                                    onClick={() => handleAppendActionVerb(exp.id, exp.description, verb)}
                                                                                    className="text-[10px] bg-muted/60 hover:bg-primary/10 hover:text-primary px-2 py-0.5 rounded-md font-medium border border-border/50 transition-colors"
                                                                                    title={`Start bullet with "${verb}"`}
                                                                                >
                                                                                    +{verb}
                                                                                </button>
                                                                            ))}
                                                                        </div>

                                                                        <FieldGroup label="Bullet Points Description (One per line)" hint="Highlight metrics, tech, & impact">
                                                                            <Textarea 
                                                                                value={exp.description} 
                                                                                onChange={e => handleItemChange('experience', exp.id, { description: e.target.value })} 
                                                                                rows={5} 
                                                                                placeholder="• Spearheaded development of core web application, improving latency by 35%&#10;• Orchestrated cloud migration saving $40,000 annually&#10;• Mentored 4 engineers and established automated CI/CD pipelines" 
                                                                            />
                                                                        </FieldGroup>

                                                                        <AIButton 
                                                                            onClick={() => handleEnhanceDescription(exp.id, exp.description)} 
                                                                            isLoading={loadingStates.experience[exp.id]}
                                                                        >
                                                                            Enhance with STAR Method
                                                                        </AIButton>
                                                                    </div>
                                                                </SortableEntryCard>
                                                            ))}
                                                        </div>
                                                    </SortableDndList>
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => handleAddItem('experience')} 
                                                        className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"
                                                    >
                                                        <Plus className="size-4" aria-hidden="true"/> Add Experience
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )}
                                    </SortableSectionWrapper>
                                );
                            }
                            if (sectionId === 'education') {
                                const enabled = isSectionEnabled(resumeData, 'education');
                                return (
                                    <SortableSectionWrapper key="education" id="education">
                                        {(handleProps) => (
                                            <AccordionItem value="education" className={`border-b-0 px-4 py-1 ${!enabled ? 'opacity-65' : ''}`}>
                                                {renderSectionHeaderRow('education', 'Education & Degrees', handleProps)}
                                                <AccordionContent className="space-y-4 pb-4">
                                                    {!enabled && (
                                                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                                                            <span>Hidden from your resume preview.</span>
                                                            <button type="button" onClick={() => handleToggleSection('education')} className="font-semibold text-primary hover:underline whitespace-nowrap">Show Section</button>
                                                        </div>
                                                    )}
                                                    {resumeData.education.length === 0 && (
                                                        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
                                                            <p className="text-xs text-muted-foreground">No education entries added.</p>
                                                            {enabled && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleSection('education')}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                                                >
                                                                    <EyeOff className="size-3.5" aria-hidden="true" />
                                                                    Hide Education from Resume
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    <SortableDndList
                                                        items={resumeData.education.map((e) => e.id)}
                                                        strategy="vertical"
                                                        onReorder={(activeId, overId) => handleEntriesReorder('education', activeId, overId)}
                                                    >
                                                        <div className="space-y-4">
                                                            {resumeData.education.map((edu, idx) => (
                                                                <SortableEntryCard
                                                                    key={edu.id}
                                                                    id={edu.id}
                                                                    title={[edu.degree, edu.university].filter(Boolean).join(' · ') || `Education #${idx + 1}`}
                                                                    kindLabel="Education"
                                                                    actions={
                                                                        <>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7" 
                                                                                onClick={() => dispatch({ type: 'MOVE_ITEM_UP', field: 'education', id: edu.id })}
                                                                                disabled={idx === 0}
                                                                                title="Move Up"
                                                                                aria-label="Move Education Entry Up"
                                                                            >
                                                                                <ChevronUp className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7" 
                                                                                onClick={() => dispatch({ type: 'MOVE_ITEM_DOWN', field: 'education', id: edu.id })}
                                                                                disabled={idx === resumeData.education.length - 1}
                                                                                title="Move Down"
                                                                                aria-label="Move Education Entry Down"
                                                                            >
                                                                                <ChevronDown className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                                                                onClick={() => handleDeleteItem('education', edu.id)}
                                                                                title="Delete Entry"
                                                                                aria-label="Delete Education Entry"
                                                                            >
                                                                                <Trash2 className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                        </>
                                                                    }
                                                                >
                                                                    <div className="space-y-3">
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                            <FieldGroup label="University / College">
                                                                                <Input 
                                                                                    value={edu.university} 
                                                                                    onChange={e => handleItemChange('education', edu.id, { university: e.target.value })} 
                                                                                    placeholder="State University" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                            <FieldGroup label="Degree / Major">
                                                                                <Input 
                                                                                    value={edu.degree} 
                                                                                    onChange={e => handleItemChange('education', edu.id, { degree: e.target.value })} 
                                                                                    placeholder="B.S. in Computer Science" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                            <FieldGroup label="Start Year">
                                                                                <Input 
                                                                                    value={edu.startDate} 
                                                                                    onChange={e => handleItemChange('education', edu.id, { startDate: e.target.value })} 
                                                                                    placeholder="2018" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                            <FieldGroup label="End Year">
                                                                                <Input 
                                                                                    value={edu.endDate} 
                                                                                    onChange={e => handleItemChange('education', edu.id, { endDate: e.target.value })} 
                                                                                    placeholder="2022 or Present" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                        </div>
                                                                    </div>
                                                                </SortableEntryCard>
                                                            ))}
                                                        </div>
                                                    </SortableDndList>
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => handleAddItem('education')} 
                                                        className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"
                                                    >
                                                        <Plus className="size-4" aria-hidden="true"/> Add Education
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )}
                                    </SortableSectionWrapper>
                                );
                            }
                            if (sectionId === 'projects') {
                                const enabled = isSectionEnabled(resumeData, 'projects');
                                return (
                                    <SortableSectionWrapper key="projects" id="projects">
                                        {(handleProps) => (
                                            <AccordionItem value="projects" className={`border-b-0 px-4 py-1 ${!enabled ? 'opacity-65' : ''}`}>
                                                {renderSectionHeaderRow('projects', 'Key Projects', handleProps)}
                                                <AccordionContent className="space-y-4 pb-4">
                                                    {!enabled && (
                                                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                                                            <span>Hidden from your resume preview.</span>
                                                            <button type="button" onClick={() => handleToggleSection('projects')} className="font-semibold text-primary hover:underline whitespace-nowrap">Show Section</button>
                                                        </div>
                                                    )}
                                                    {resumeData.projects.length === 0 && (
                                                        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
                                                            <p className="text-xs text-muted-foreground">No projects added. If you don&apos;t have projects to list, you can hide this section.</p>
                                                            {enabled && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleSection('projects')}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                                                >
                                                                    <EyeOff className="size-3.5" aria-hidden="true" />
                                                                    Hide Projects from Resume
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    <SortableDndList
                                                        items={resumeData.projects.map((p) => p.id)}
                                                        strategy="vertical"
                                                        onReorder={(activeId, overId) => handleEntriesReorder('projects', activeId, overId)}
                                                    >
                                                        <div className="space-y-4">
                                                            {resumeData.projects.map((proj, idx) => (
                                                                <SortableEntryCard
                                                                    key={proj.id}
                                                                    id={proj.id}
                                                                    title={proj.name || `Project #${idx + 1}`}
                                                                    kindLabel="Project"
                                                                    actions={
                                                                        <>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7" 
                                                                                onClick={() => dispatch({ type: 'MOVE_ITEM_UP', field: 'projects', id: proj.id })}
                                                                                disabled={idx === 0}
                                                                                title="Move Up"
                                                                                aria-label="Move Project Entry Up"
                                                                            >
                                                                                <ChevronUp className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7" 
                                                                                onClick={() => dispatch({ type: 'MOVE_ITEM_DOWN', field: 'projects', id: proj.id })}
                                                                                disabled={idx === resumeData.projects.length - 1}
                                                                                title="Move Down"
                                                                                aria-label="Move Project Entry Down"
                                                                            >
                                                                                <ChevronDown className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                                                                onClick={() => handleDeleteItem('projects', proj.id)}
                                                                                title="Delete Entry"
                                                                                aria-label="Delete Project Entry"
                                                                            >
                                                                                <Trash2 className="size-4" aria-hidden="true" />
                                                                            </Button>
                                                                        </>
                                                                    }
                                                                >
                                                                    <div className="space-y-3">
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                            <FieldGroup label="Project Name">
                                                                                <Input 
                                                                                    value={proj.name} 
                                                                                    onChange={e => handleItemChange('projects', proj.id, { name: e.target.value })} 
                                                                                    placeholder="AI Portfolio Platform" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                            <FieldGroup label="URL / Repository (Optional)">
                                                                                <Input 
                                                                                    value={proj.url || ''} 
                                                                                    onChange={e => handleItemChange('projects', proj.id, { url: e.target.value })} 
                                                                                    placeholder="github.com/alihashmi/project" 
                                                                                    autoComplete="off" 
                                                                                />
                                                                            </FieldGroup>
                                                                        </div>
                                                                        <FieldGroup label="Description & Stack">
                                                                            <Textarea 
                                                                                value={proj.description} 
                                                                                onChange={e => handleItemChange('projects', proj.id, { description: e.target.value })} 
                                                                                rows={3} 
                                                                                placeholder="Engineered high-performance real-time analytics app using React, TypeScript, and TailwindCSS…" 
                                                                            />
                                                                        </FieldGroup>
                                                                    </div>
                                                                </SortableEntryCard>
                                                            ))}
                                                        </div>
                                                    </SortableDndList>
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => handleAddItem('projects')} 
                                                        className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"
                                                    >
                                                        <Plus className="size-4" aria-hidden="true"/> Add Project
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )}
                                    </SortableSectionWrapper>
                                );
                            }
                            return null;
                        })}
                    </div>
                </SortableDndList>
            </Accordion>
        </div>
    );
};