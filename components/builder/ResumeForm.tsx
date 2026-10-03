import * as React from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../../types';
import { type Action } from '../../hooks/useResumeStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { 
  Bot, Plus, Trash2, Sparkles, Loader2, SearchCheck, ChevronUp, ChevronDown, 
  CheckCircle2, AlertCircle, Check, Copy, Wand2, ShieldCheck, Zap
} from 'lucide-react';
import { 
  generateAISummary, 
  enhanceAIBulletPoint, 
  suggestAISkills, 
  generateAIResume, 
  analyzeResumeATS 
} from '../../services/gemini';

interface ResumeFormProps {
  resumeData: ResumeData;
  dispatch: React.Dispatch<Action>;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
      {...props} 
      className="w-full h-10 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all duration-200 hover:border-muted-foreground/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea 
      {...props} 
      className="w-full min-h-[90px] px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all duration-200 hover:border-muted-foreground/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const FieldGroup: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
    <label className="flex flex-col gap-1.5 cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
          {hint && <span className="text-[10px] text-muted-foreground/70">{hint}</span>}
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
        className={`btn-ai inline-flex items-center gap-2 h-8 px-3.5 rounded-lg text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
    >
        {isLoading
            ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            : <Sparkles className="size-3.5" aria-hidden="true" />
        }
        {children}
    </button>
);

const ACTION_VERBS = ["Spearheaded", "Architected", "Engineered", "Accelerated", "Optimized", "Orchestrated", "Formulated", "Scaled", "Streamlined"];

export const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, dispatch }) => {
    const { showToast } = useToast();
    const [loadingStates, setLoadingStates] = React.useState({
        summary: false,
        skills: false,
        fullResume: false,
        ats: false,
        experience: {} as Record<string, boolean>,
    });
    const [jobTitle, setJobTitle] = React.useState('Software Engineer');
    const [jobDescription, setJobDescription] = React.useState('');
    
    // ATS Audit State
    const [atsScore, setAtsScore] = React.useState<number | null>(null);
    const [atsSuggestions, setAtsSuggestions] = React.useState<string[]>([]);
    const [atsKeywords, setAtsKeywords] = React.useState<string[]>([]);

    // Calculate Resume Completeness Score
    const completeness = React.useMemo(() => {
        let score = 0;
        const checks = {
            hasName: Boolean(resumeData.name?.trim()),
            hasEmail: Boolean(resumeData.email?.trim()),
            hasSummary: Boolean(resumeData.summary?.trim() && resumeData.summary.length > 30),
            hasSkills: Boolean(resumeData.skills?.trim() && resumeData.skills.length > 5),
            hasExp: Boolean(resumeData.experience?.length > 0 && resumeData.experience[0].title?.trim()),
            hasEdu: Boolean(resumeData.education?.length > 0 && resumeData.education[0].degree?.trim()),
        };

        if (checks.hasName) score += 20;
        if (checks.hasEmail) score += 15;
        if (checks.hasSummary) score += 20;
        if (checks.hasSkills) score += 15;
        if (checks.hasExp) score += 20;
        if (checks.hasEdu) score += 10;

        return { score: Math.min(100, score), checks };
    }, [resumeData]);

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

    // Reordering handler
    const handleMoveSection = (sectionId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const currentOrder = [...(resumeData.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects'])];
        const index = currentOrder.indexOf(sectionId);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= currentOrder.length) return;

        const temp = currentOrder[index];
        currentOrder[index] = currentOrder[newIndex];
        currentOrder[newIndex] = temp;

        dispatch({ type: 'SET_FIELD', field: 'sectionOrder', value: currentOrder });
    };

    const renderReorderControls = (sectionId: string) => {
        const order = resumeData.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects'];
        const index = order.indexOf(sectionId);
        
        return (
            <div className="flex items-center gap-1 ml-auto no-print">
                <button
                    type="button"
                    onClick={(e) => handleMoveSection(sectionId, 'up', e)}
                    className={`size-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors ${
                        index === 0 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                    }`}
                    title="Move Section Up"
                    aria-label={`Move ${sectionId} Section Up`}
                    disabled={index === 0}
                >
                    <ChevronUp className="size-4" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={(e) => handleMoveSection(sectionId, 'down', e)}
                    className={`size-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors ${
                        index === order.length - 1 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                    }`}
                    title="Move Section Down"
                    aria-label={`Move ${sectionId} Section Down`}
                    disabled={index === order.length - 1}
                >
                    <ChevronDown className="size-4" aria-hidden="true" />
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Resume Completeness & Health Widget */}
            <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="size-4" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-foreground">Resume Completeness</h3>
                            <p className="text-[11px] text-muted-foreground">Recruiter and ATS readiness</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black tabular-nums ${
                            completeness.score >= 80 ? 'text-emerald-500' : completeness.score >= 50 ? 'text-amber-500' : 'text-primary'
                        }`}>
                            {completeness.score}%
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div 
                    role="progressbar" 
                    aria-valuenow={completeness.score} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                    className="w-full h-2 rounded-full bg-muted overflow-hidden"
                >
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                            completeness.score >= 80 ? 'bg-emerald-500' : completeness.score >= 50 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${completeness.score}%` }}
                    />
                </div>

                {/* Checklist pills */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        completeness.checks.hasName ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                    }`}>
                        {completeness.checks.hasName && <Check className="size-2.5" />} Name & Title
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        completeness.checks.hasSummary ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                    }`}>
                        {completeness.checks.hasSummary && <Check className="size-2.5" />} Summary
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        completeness.checks.hasSkills ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                    }`}>
                        {completeness.checks.hasSkills && <Check className="size-2.5" />} Skills
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        completeness.checks.hasExp ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                    }`}>
                        {completeness.checks.hasExp && <Check className="size-2.5" />} Experience
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        completeness.checks.hasEdu ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                    }`}>
                        {completeness.checks.hasEdu && <Check className="size-2.5" />} Education
                    </span>
                </div>
            </div>

            {/* AI Assistant Generator Card */}
            <div className="relative p-5 rounded-2xl glass-card overflow-hidden shadow-xl shadow-primary/5 border border-primary/30">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15">
                            <Bot className="size-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-foreground tracking-tight text-balance">AI Resume Copilot</h3>
                            <p className="text-[11px] text-muted-foreground text-pretty">Generate a full, tailored draft in seconds</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Input 
                            value={jobTitle} 
                            onChange={e => setJobTitle(e.target.value)} 
                            placeholder="Target Role (e.g. Senior Frontend Engineer)" 
                            autoComplete="off" 
                        />
                        <AIButton onClick={handleGenerateFullResume} isLoading={loadingStates.fullResume}>
                            Generate Draft
                        </AIButton>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['ats-optimizer', 'personal', 'summary', 'experience']} className="w-full border rounded-2xl bg-card overflow-hidden divide-y">
                
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
                        <button
                            type="button"
                            onClick={handleAnalyzeKeywords}
                            disabled={loadingStates.ats}
                            className="btn-ai inline-flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            {loadingStates.ats ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <SearchCheck className="size-3.5" aria-hidden="true" />}
                            Audit Resume Match
                        </button>
                        
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

                {/* Dynamically Ordered Accordion Sections */}
                {(resumeData.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects']).map((sectionId) => {
                    if (sectionId === 'summary') {
                        return (
                            <AccordionItem key="summary" value="summary" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Professional Summary</AccordionTrigger>
                                    {renderReorderControls('summary')}
                                </div>
                                <AccordionContent className="space-y-3 pb-4">
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
                        );
                    }
                    if (sectionId === 'skills') {
                        return (
                            <AccordionItem key="skills" value="skills" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Skills</AccordionTrigger>
                                    {renderReorderControls('skills')}
                                </div>
                                <AccordionContent className="space-y-3 pb-4">
                                     <FieldGroup label="Core Skills (comma-separated)">
                                        <Textarea 
                                            value={resumeData.skills} 
                                            onChange={e => handleFieldChange('skills', e.target.value)} 
                                            rows={3} 
                                            placeholder="React, TypeScript, Node.js, Python, AWS, System Architecture, Agile Delivery..." 
                                        />
                                    </FieldGroup>
                                     <AIButton onClick={handleSuggestSkills} isLoading={loadingStates.skills}>
                                        Suggest Role Skills
                                     </AIButton>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    if (sectionId === 'experience') {
                        return (
                            <AccordionItem key="experience" value="experience" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Work Experience</AccordionTrigger>
                                    {renderReorderControls('experience')}
                                </div>
                                <AccordionContent className="space-y-6 pb-4">
                                    {resumeData.experience.map((exp, idx) => (
                                        <div key={exp.id} className="p-4 border border-border/80 rounded-2xl relative bg-card space-y-4 hover:border-primary/40 transition-colors">
                                            <div className="absolute top-3 right-3 flex items-center gap-1">
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
                                            </div>

                                            <div className="space-y-3 pt-2">
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
                                        </div>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleAddItem('experience')} 
                                        className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"
                                    >
                                        <Plus className="size-4" aria-hidden="true"/> Add Experience
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    if (sectionId === 'education') {
                        return (
                            <AccordionItem key="education" value="education" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Education & Degrees</AccordionTrigger>
                                    {renderReorderControls('education')}
                                </div>
                                <AccordionContent className="space-y-6 pb-4">
                                    {resumeData.education.map((edu, idx) => (
                                        <div key={edu.id} className="p-4 border border-border/80 rounded-2xl relative bg-card space-y-3 hover:border-primary/40 transition-colors">
                                            <div className="absolute top-3 right-3 flex items-center gap-1">
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
                                            </div>

                                            <div className="space-y-3 pt-2">
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
                                        </div>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleAddItem('education')} 
                                        className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"
                                    >
                                        <Plus className="size-4" aria-hidden="true"/> Add Education
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    if (sectionId === 'projects') {
                        return (
                            <AccordionItem key="projects" value="projects" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Key Projects</AccordionTrigger>
                                    {renderReorderControls('projects')}
                                </div>
                                <AccordionContent className="space-y-6 pb-4">
                                    {resumeData.projects.map((proj, idx) => (
                                        <div key={proj.id} className="p-4 border border-border/80 rounded-2xl relative bg-card space-y-3 hover:border-primary/40 transition-colors">
                                            <div className="absolute top-3 right-3 flex items-center gap-1">
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
                                            </div>

                                            <div className="space-y-3 pt-2">
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
                                        </div>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleAddItem('projects')} 
                                        className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"
                                    >
                                        <Plus className="size-4" aria-hidden="true"/> Add Project
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    return null;
                })}
            </Accordion>
        </div>
    );
};