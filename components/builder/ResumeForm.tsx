import * as React from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../../types';
import { type Action } from '../../hooks/useResumeStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { Bot, Plus, Trash2, Sparkles, Loader2, SearchCheck, ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateAISummary, enhanceAIBulletPoint, suggestAISkills, generateAIResume, analyzeResumeATS } from '../../services/gemini';

interface ResumeFormProps {
  resumeData: ResumeData;
  dispatch: React.Dispatch<Action>;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
      {...props} 
      className="w-full h-9 px-3 py-2 bg-background border border-border rounded-lg text-sm transition-all duration-200 hover:border-muted-foreground/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea 
      {...props} 
      className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-lg text-sm transition-all duration-200 hover:border-muted-foreground/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const FieldGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <label className="flex flex-col gap-1.5 cursor-pointer">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        {children}
    </label>
);

const AIButton: React.FC<{ onClick: () => void; isLoading: boolean, children: React.ReactNode }> = ({ onClick, isLoading, children }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="btn-ai inline-flex items-center gap-2 h-8 px-3.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
        {isLoading
            ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            : <Sparkles className="size-3.5" aria-hidden="true" />
        }
        {children}
    </button>
);

export const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, dispatch }) => {
    const [loadingStates, setLoadingStates] = React.useState({
        summary: false,
        skills: false,
        fullResume: false,
        ats: false,
        experience: {} as Record<string, boolean>,
    });
    const [jobTitle, setJobTitle] = React.useState('Software Engineer');
    const [jobDescription, setJobDescription] = React.useState('');
    
    // Upgraded ATS State
    const [atsScore, setAtsScore] = React.useState<number | null>(null);
    const [atsSuggestions, setAtsSuggestions] = React.useState<string[]>([]);
    const [atsKeywords, setAtsKeywords] = React.useState<string[]>([]);

    const handleFieldChange = (field: keyof Omit<ResumeData, 'experience' | 'education' | 'projects'>, value: string) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const handleItemChange = (field: 'experience' | 'education' | 'projects', id: string, data: Partial<Experience | Education | Project>) => {
        dispatch({ type: 'UPDATE_ITEM', field, id, data });
    };
    
    const handleAddItem = (field: 'experience' | 'education' | 'projects') => {
        dispatch({ type: 'ADD_ITEM', field });
    };

    const handleDeleteItem = (field: 'experience' | 'education' | 'projects', id: string) => {
        dispatch({ type: 'DELETE_ITEM', field, id });
    };

    const handleGenerateFullResume = async () => {
        if (!jobTitle) {
            alert("Please enter a job title.");
            return;
        }
        setLoadingStates(prev => ({...prev, fullResume: true}));
        try {
            const aiResume = await generateAIResume(jobTitle);
            dispatch({ type: 'LOAD_DRAFT', data: aiResume });
        } catch (e) {
            console.error(e);
            alert("Failed to generate resume. Check the console for details.");
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
        } catch (e) {
            console.error(e);
            alert("Failed to generate summary. Check the console for details.");
        } finally {
            setLoadingStates(prev => ({...prev, summary: false}));
        }
    };

    const handleSuggestSkills = async () => {
        setLoadingStates(prev => ({...prev, skills: true}));
        try {
            const newSkills = await suggestAISkills(resumeData.experience[0]?.title || 'relevant field');
            handleFieldChange('skills', newSkills);
        } catch (e) {
            console.error(e);
            alert("Failed to suggest skills. Check the console for details.");
        } finally {
            setLoadingStates(prev => ({...prev, skills: false}));
        }
    };

    const handleEnhanceDescription = async (expId: string, description: string) => {
        setLoadingStates(prev => ({ ...prev, experience: { ...prev.experience, [expId]: true } }));
        try {
            const context = `Job Title: ${resumeData.experience.find(e => e.id === expId)?.title}. Resume Summary: ${resumeData.summary}`;
            const enhancedDesc = await enhanceAIBulletPoint(description, context);
            handleItemChange('experience', expId, { description: enhancedDesc });
        } catch (e) {
            console.error(e);
            alert("Failed to enhance description. Check the console for details.");
        } finally {
            setLoadingStates(prev => ({ ...prev, experience: { ...prev.experience, [expId]: false } }));
        }
    };
    
    // Upgraded AI ATS Auditor
    const handleAnalyzeKeywords = async () => {
        if (!jobDescription) {
            alert("Please paste a job description to analyze.");
            return;
        }
        setLoadingStates(prev => ({ ...prev, ats: true }));
        setAtsScore(null);
        setAtsSuggestions([]);
        setAtsKeywords([]);
        try {
            const { name, email, phone, website, themeColor, fontSize, lineHeight, margins, ...contentOnly } = resumeData;
            const resumeText = JSON.stringify(contentOnly);
            const result = await analyzeResumeATS(resumeText, jobDescription);
            setAtsScore(result.score);
            setAtsSuggestions(result.suggestions || []);
            setAtsKeywords(result.missingKeywords || []);
        } catch (e) {
            console.error(e);
            alert("Failed to audit resume. Check the console for details.");
        } finally {
            setLoadingStates(prev => ({ ...prev, ats: false }));
        }
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

        // Swap
        const temp = currentOrder[index];
        currentOrder[index] = currentOrder[newIndex];
        currentOrder[newIndex] = temp;

        dispatch({ type: 'SET_FIELD', field: 'sectionOrder', value: currentOrder });
    };

    // Section reordering buttons
    const renderReorderControls = (sectionId: string) => {
        const order = resumeData.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects'];
        const index = order.indexOf(sectionId);
        
        return (
            <div className="flex items-center gap-1.5 ml-auto no-print">
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
            {/* AI Assistant Card */}
            <div className="relative p-6 rounded-2xl glass-card overflow-hidden shadow-xl shadow-primary/5 border border-primary/25">
                {/* Ambient glow in top-right */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-1.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15">
                            <Bot className="size-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-foreground tracking-tight text-balance">AI Architect Assistant</h3>
                            <p className="text-[10px] text-muted-foreground font-sans text-pretty">Generate a full ATS-ready draft in seconds</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                        <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Senior Product Manager" autocomplete="off" />
                        <AIButton onClick={handleGenerateFullResume} isLoading={loadingStates.fullResume}>Generate Draft</AIButton>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['personal', 'summary', 'experience']} className="w-full border rounded-2xl bg-card overflow-hidden divide-y">
                
                {/* ATS Audit Dashboard */}
                <AccordionItem value="ats-optimizer" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">ATS Auditor & Review</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                        <FieldGroup label="Target Job Description">
                            <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={5} placeholder="Paste the job requirements description to get your match rating and optimization advice…" />
                        </FieldGroup>
                        <button
                            onClick={handleAnalyzeKeywords}
                            disabled={loadingStates.ats}
                            className="btn-ai inline-flex items-center gap-2 h-8 px-4 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            {loadingStates.ats ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <SearchCheck className="size-3.5" aria-hidden="true" />}
                            Audit Resume Match
                        </button>
                        
                        {/* Audit score & detailed suggestions feedback */}
                        {atsScore !== null && (
                            <div className="space-y-4 border-t pt-4">
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
                                                    strokeWidth="5"
                                                    fill="transparent"
                                                />
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="32"
                                                    className={`transition-all duration-700 ease-out ${
                                                        atsScore >= 75 ? 'stroke-emerald-500' : atsScore >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'
                                                    }`}
                                                    strokeWidth="5"
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
                                                <><CheckCircle2 className="size-[1.125rem] text-emerald-500" aria-hidden="true" /><span className="text-emerald-500 text-balance">Strong Match!</span></>
                                            ) : atsScore >= 50 ? (
                                                <><AlertCircle className="size-[1.125rem] text-amber-500" aria-hidden="true" /><span className="text-amber-500 text-balance">Needs Work</span></>
                                            ) : (
                                                <><AlertCircle className="size-[1.125rem] text-rose-500" aria-hidden="true" /><span className="text-rose-500 text-balance">Weak Fit</span></>
                                            )}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                                            {atsScore >= 75 
                                                ? "Your resume matches the target job description well. Focus on polishing formatting and exporting a selectable PDF for submissions."
                                                : "Review the missing keywords list and AI auditor advice checklist below to integrate missing requirements into your bullet points."}
                                        </p>
                                    </div>
                                </div>

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

                                {/* Target Keywords */}
                                {atsKeywords.length > 0 && (
                                    <div className="p-4 bg-muted/30 border border-border/40 rounded-xl">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Suggested Keywords to Add:</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {atsKeywords.map(keyword => (
                                                <span key={keyword} className="text-[10px] bg-background border px-2.5 py-0.5 rounded-full font-medium shadow-sm transition-colors hover:bg-secondary">{keyword}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Personal Details */}
                <AccordionItem value="personal" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Personal Details</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldGroup label="Full Name"><Input value={resumeData.name} onChange={e => handleFieldChange('name', e.target.value)} name="name" autocomplete="name" /></FieldGroup>
                            <FieldGroup label="Email"><Input type="email" value={resumeData.email} onChange={e => handleFieldChange('email', e.target.value)} name="email" autocomplete="email" spellCheck={false} /></FieldGroup>
                            <FieldGroup label="Phone"><Input type="tel" value={resumeData.phone} onChange={e => handleFieldChange('phone', e.target.value)} name="phone" autocomplete="tel" /></FieldGroup>
                            <FieldGroup label="Website / Portfolio"><Input type="url" value={resumeData.website} onChange={e => handleFieldChange('website', e.target.value)} name="website" autocomplete="url" /></FieldGroup>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Dynamically Ordered Accordion Content Items */}
                {(resumeData.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects']).map((sectionId) => {
                    if (sectionId === 'summary') {
                        return (
                            <AccordionItem key="summary" value="summary" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Professional Summary</AccordionTrigger>
                                    {renderReorderControls('summary')}
                                </div>
                                <AccordionContent className="space-y-3 pb-4">
                                    <FieldGroup label="Summary Description">
                                        <Textarea value={resumeData.summary} onChange={e => handleFieldChange('summary', e.target.value)} rows={4} placeholder="Write a brief pitch about your career background…" />
                                    </FieldGroup>
                                    <AIButton onClick={handleGenerateSummary} isLoading={loadingStates.summary}>Generate Summary</AIButton>
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
                                     <FieldGroup label="Skills (comma-separated)">
                                        <Textarea value={resumeData.skills} onChange={e => handleFieldChange('skills', e.target.value)} rows={3} placeholder="React, Node.js, Project Management, Agile…" />
                                    </FieldGroup>
                                     <AIButton onClick={handleSuggestSkills} isLoading={loadingStates.skills}>Suggest Skills</AIButton>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    if (sectionId === 'experience') {
                        return (
                            <AccordionItem key="experience" value="experience" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Experience</AccordionTrigger>
                                    {renderReorderControls('experience')}
                                </div>
                                <AccordionContent className="space-y-6 pb-4">
                                    {resumeData.experience.map((exp, idx) => (
                                        <div key={exp.id} className="p-4 border rounded-xl relative bg-background/40 hover:bg-background/80 transition-colors">
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
                                            <div className="space-y-4 pt-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FieldGroup label="Company"><Input value={exp.company} onChange={e => handleItemChange('experience', exp.id, { company: e.target.value })} autocomplete="off" /></FieldGroup>
                                                    <FieldGroup label="Job Title"><Input value={exp.title} onChange={e => handleItemChange('experience', exp.id, { title: e.target.value })} autocomplete="off" /></FieldGroup>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FieldGroup label="Start Date"><Input value={exp.startDate} onChange={e => handleItemChange('experience', exp.id, { startDate: e.target.value })} autocomplete="off" /></FieldGroup>
                                                    <FieldGroup label="End Date"><Input value={exp.endDate} onChange={e => handleItemChange('experience', exp.id, { endDate: e.target.value })} autocomplete="off" /></FieldGroup>
                                                </div>
                                                <FieldGroup label="Description (one bullet point per line)">
                                                    <Textarea value={exp.description} onChange={e => handleItemChange('experience', exp.id, { description: e.target.value })} rows={5} placeholder="Use action verbs. E.g.:\n- Led development on core cloud product\n- Managed a team of 4 engineers" />
                                                </FieldGroup>
                                                <AIButton onClick={() => handleEnhanceDescription(exp.id, exp.description)} isLoading={loadingStates.experience[exp.id]}>Enhance Description</AIButton>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem('experience')} className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"><Plus className="size-4" aria-hidden="true"/> Add Experience</Button>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    if (sectionId === 'education') {
                        return (
                            <AccordionItem key="education" value="education" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Education</AccordionTrigger>
                                    {renderReorderControls('education')}
                                </div>
                                <AccordionContent className="space-y-6 pb-4">
                                    {resumeData.education.map((edu, idx) => (
                                        <div key={edu.id} className="p-4 border rounded-xl relative bg-background/40 hover:bg-background/80 transition-colors">
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
                                            <div className="space-y-4 pt-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FieldGroup label="University"><Input value={edu.university} onChange={e => handleItemChange('education', edu.id, { university: e.target.value })} autocomplete="off" /></FieldGroup>
                                                    <FieldGroup label="Degree"><Input value={edu.degree} onChange={e => handleItemChange('education', edu.id, { degree: e.target.value })} autocomplete="off" /></FieldGroup>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FieldGroup label="Start Date"><Input value={edu.startDate} onChange={e => handleItemChange('education', edu.id, { startDate: e.target.value })} autocomplete="off" /></FieldGroup>
                                                    <FieldGroup label="End Date"><Input value={edu.endDate} onChange={e => handleItemChange('education', edu.id, { endDate: e.target.value })} autocomplete="off" /></FieldGroup>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem('education')} className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"><Plus className="size-4" aria-hidden="true"/> Add Education</Button>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                    if (sectionId === 'projects') {
                        return (
                            <AccordionItem key="projects" value="projects" className="border-b-0 px-4 py-1">
                                <div className="flex items-center w-full">
                                    <AccordionTrigger className="font-bold text-sm flex-grow">Projects</AccordionTrigger>
                                    {renderReorderControls('projects')}
                                </div>
                                <AccordionContent className="space-y-6 pb-4">
                                    {resumeData.projects.map((proj, idx) => (
                                        <div key={proj.id} className="p-4 border rounded-xl relative bg-background/40 hover:bg-background/80 transition-colors">
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
                                            <div className="space-y-4 pt-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FieldGroup label="Project Name"><Input value={proj.name} onChange={e => handleItemChange('projects', proj.id, { name: e.target.value })} autocomplete="off" /></FieldGroup>
                                                    <FieldGroup label="URL (Optional)"><Input value={proj.url || ''} onChange={e => handleItemChange('projects', proj.id, { url: e.target.value })} autocomplete="off" /></FieldGroup>
                                                </div>
                                                <FieldGroup label="Description"><Textarea value={proj.description} onChange={e => handleItemChange('projects', proj.id, { description: e.target.value })} rows={3} placeholder="Describe the project, technologies used, and your individual contribution…" /></FieldGroup>
                                            </div>
                                        </div>
                                    ))}
                                     <Button variant="outline" onClick={() => handleAddItem('projects')} className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"><Plus className="size-4" aria-hidden="true"/> Add Project</Button>
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