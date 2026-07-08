import * as React from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../../types';
import { type Action } from '../../hooks/useResumeStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { Bot, Plus, Trash2, Sparkles, Loader2, SearchCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { generateAISummary, enhanceAIBulletPoint, suggestAISkills, generateAIResume, analyzeAndSuggestKeywords } from '../../services/gemini';

interface ResumeFormProps {
  resumeData: ResumeData;
  dispatch: React.Dispatch<Action>;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
      {...props} 
      className="w-full h-9 px-3 py-2 bg-background border border-border rounded-lg text-sm transition-all duration-200 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea 
      {...props} 
      className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-lg text-sm transition-all duration-200 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50" 
    />
);

const FieldGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

const AIButton: React.FC<{ onClick: () => void; isLoading: boolean, children: React.ReactNode }> = ({ onClick, isLoading, children }) => (
    <div className="relative group w-fit">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400 via-emerald-500 to-cyan-500 rounded-lg blur opacity-60 group-hover:opacity-90 transition duration-300 animate-tilt"></div>
        <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={isLoading}
            className="relative flex items-center gap-2 bg-background border-border hover:bg-accent/50"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-lime-500" />}
            {children}
        </Button>
    </div>
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
    
    const handleAnalyzeKeywords = async () => {
        if (!jobDescription) {
            alert("Please paste a job description to analyze.");
            return;
        }
        setLoadingStates(prev => ({ ...prev, ats: true }));
        setAtsKeywords([]);
        try {
            const resumeText = JSON.stringify(resumeData);
            const keywordsString = await analyzeAndSuggestKeywords(resumeText, jobDescription);
            setAtsKeywords(keywordsString.split(',').map(k => k.trim()).filter(Boolean));
        } catch (e) {
            console.error(e);
            alert("Failed to analyze keywords. Check the console for details.");
        } finally {
            setLoadingStates(prev => ({ ...prev, ats: false }));
        }
    };

    return (
        <div className="space-y-6">
            {/* AI Assistant Card */}
            <div className="p-5 border border-lime-500/30 rounded-2xl bg-card text-card-foreground shadow-lg shadow-lime-500/5 dark:shadow-lime-500/10">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-lime-500" />
                    <h3 className="text-lg font-bold bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">AI Architect Assistant</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Generate a comprehensive, ATS-ready resume draft for any role in seconds.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Senior Product Manager" />
                    <AIButton onClick={handleGenerateFullResume} isLoading={loadingStates.fullResume}>Generate Draft</AIButton>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['personal', 'summary', 'experience']} className="w-full border rounded-2xl bg-card overflow-hidden divide-y">
                
                {/* ATS Optimizer */}
                <AccordionItem value="ats-optimizer" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">ATS Keyword Optimizer</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                        <FieldGroup label="Paste Job Description Here">
                            <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={5} placeholder="Paste the full target job posting text here to identify key matching keywords..." />
                        </FieldGroup>
                        <Button variant="secondary" size="sm" onClick={handleAnalyzeKeywords} disabled={loadingStates.ats} className="w-full sm:w-auto">
                            {loadingStates.ats ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <SearchCheck className="h-4 w-4 mr-2" />}
                            Compare & Suggest Keywords
                        </Button>
                        {atsKeywords.length > 0 && (
                            <div className="p-4 bg-secondary/50 border rounded-xl">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Suggested Keywords to Add:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {atsKeywords.map(keyword => (
                                        <span key={keyword} className="text-xs bg-background border px-2.5 py-1 rounded-full font-medium shadow-sm">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Personal Details */}
                <AccordionItem value="personal" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Personal Details</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldGroup label="Full Name"><Input value={resumeData.name} onChange={e => handleFieldChange('name', e.target.value)} /></FieldGroup>
                            <FieldGroup label="Email"><Input type="email" value={resumeData.email} onChange={e => handleFieldChange('email', e.target.value)} /></FieldGroup>
                            <FieldGroup label="Phone"><Input value={resumeData.phone} onChange={e => handleFieldChange('phone', e.target.value)} /></FieldGroup>
                            <FieldGroup label="Website / Portfolio"><Input value={resumeData.website} onChange={e => handleFieldChange('website', e.target.value)} /></FieldGroup>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Summary */}
                <AccordionItem value="summary" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Professional Summary</AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                        <FieldGroup label="Summary Description">
                            <Textarea value={resumeData.summary} onChange={e => handleFieldChange('summary', e.target.value)} rows={4} placeholder="Write a brief pitch about your career background..." />
                        </FieldGroup>
                        <AIButton onClick={handleGenerateSummary} isLoading={loadingStates.summary}>Generate Summary</AIButton>
                    </AccordionContent>
                </AccordionItem>

                {/* Skills */}
                <AccordionItem value="skills" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Skills</AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                         <FieldGroup label="Skills (comma-separated)">
                            <Textarea value={resumeData.skills} onChange={e => handleFieldChange('skills', e.target.value)} rows={3} placeholder="React, Node.js, Project Management, Agile..." />
                        </FieldGroup>
                         <AIButton onClick={handleSuggestSkills} isLoading={loadingStates.skills}>Suggest Skills</AIButton>
                    </AccordionContent>
                </AccordionItem>

                {/* Experience */}
                <AccordionItem value="experience" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Experience</AccordionTrigger>
                    <AccordionContent className="space-y-6 pb-4">
                        {resumeData.experience.map((exp, idx) => (
                            <div key={exp.id} className="p-4 border rounded-xl relative bg-background/40 hover:bg-background/80 transition-colors">
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7" 
                                        onClick={() => dispatch({ type: 'MOVE_ITEM_UP', field: 'experience', id: exp.id })}
                                        disabled={idx === 0}
                                        title="Move Up"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7" 
                                        onClick={() => dispatch({ type: 'MOVE_ITEM_DOWN', field: 'experience', id: exp.id })}
                                        disabled={idx === resumeData.experience.length - 1}
                                        title="Move Down"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                        onClick={() => handleDeleteItem('experience', exp.id)}
                                        title="Delete Entry"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldGroup label="Company"><Input value={exp.company} onChange={e => handleItemChange('experience', exp.id, { company: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="Job Title"><Input value={exp.title} onChange={e => handleItemChange('experience', exp.id, { title: e.target.value })} /></FieldGroup>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldGroup label="Start Date"><Input value={exp.startDate} onChange={e => handleItemChange('experience', exp.id, { startDate: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="End Date"><Input value={exp.endDate} onChange={e => handleItemChange('experience', exp.id, { endDate: e.target.value })} /></FieldGroup>
                                    </div>
                                    <FieldGroup label="Description (one bullet point per line)">
                                        <Textarea value={exp.description} onChange={e => handleItemChange('experience', exp.id, { description: e.target.value })} rows={5} placeholder="Use action verbs. E.g.:\n- Led development on core cloud product\n- Managed a team of 4 engineers" />
                                    </FieldGroup>
                                    <AIButton onClick={() => handleEnhanceDescription(exp.id, exp.description)} isLoading={loadingStates.experience[exp.id]}>Enhance Description</AIButton>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" onClick={() => handleAddItem('experience')} className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"><Plus className="h-4 w-4"/> Add Experience</Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Education</AccordionTrigger>
                    <AccordionContent className="space-y-6 pb-4">
                        {resumeData.education.map((edu, idx) => (
                            <div key={edu.id} className="p-4 border rounded-xl relative bg-background/40 hover:bg-background/80 transition-colors">
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7" 
                                        onClick={() => dispatch({ type: 'MOVE_ITEM_UP', field: 'education', id: edu.id })}
                                        disabled={idx === 0}
                                        title="Move Up"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7" 
                                        onClick={() => dispatch({ type: 'MOVE_ITEM_DOWN', field: 'education', id: edu.id })}
                                        disabled={idx === resumeData.education.length - 1}
                                        title="Move Down"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                        onClick={() => handleDeleteItem('education', edu.id)}
                                        title="Delete Entry"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldGroup label="University"><Input value={edu.university} onChange={e => handleItemChange('education', edu.id, { university: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="Degree"><Input value={edu.degree} onChange={e => handleItemChange('education', edu.id, { degree: e.target.value })} /></FieldGroup>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldGroup label="Start Date"><Input value={edu.startDate} onChange={e => handleItemChange('education', edu.id, { startDate: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="End Date"><Input value={edu.endDate} onChange={e => handleItemChange('education', edu.id, { endDate: e.target.value })} /></FieldGroup>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" onClick={() => handleAddItem('education')} className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"><Plus className="h-4 w-4"/> Add Education</Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Projects */}
                <AccordionItem value="projects" className="border-b-0 px-4 py-1">
                    <AccordionTrigger className="font-bold text-sm">Projects</AccordionTrigger>
                    <AccordionContent className="space-y-6 pb-4">
                        {resumeData.projects.map((proj, idx) => (
                            <div key={proj.id} className="p-4 border rounded-xl relative bg-background/40 hover:bg-background/80 transition-colors">
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7" 
                                        onClick={() => dispatch({ type: 'MOVE_ITEM_UP', field: 'projects', id: proj.id })}
                                        disabled={idx === 0}
                                        title="Move Up"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7" 
                                        onClick={() => dispatch({ type: 'MOVE_ITEM_DOWN', field: 'projects', id: proj.id })}
                                        disabled={idx === resumeData.projects.length - 1}
                                        title="Move Down"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                        onClick={() => handleDeleteItem('projects', proj.id)}
                                        title="Delete Entry"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldGroup label="Project Name"><Input value={proj.name} onChange={e => handleItemChange('projects', proj.id, { name: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="URL (Optional)"><Input value={proj.url || ''} onChange={e => handleItemChange('projects', proj.id, { url: e.target.value })} /></FieldGroup>
                                    </div>
                                    <FieldGroup label="Description"><Textarea value={proj.description} onChange={e => handleItemChange('projects', proj.id, { description: e.target.value })} rows={3} placeholder="Describe the project, technologies used, and your individual contribution..." /></FieldGroup>
                                </div>
                            </div>
                        ))}
                         <Button variant="outline" onClick={() => handleAddItem('projects')} className="w-full flex items-center justify-center gap-2 border-dashed py-5 hover:bg-secondary/40 rounded-xl"><Plus className="h-4 w-4"/> Add Project</Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};