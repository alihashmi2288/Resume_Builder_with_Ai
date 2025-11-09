import * as React from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../../types';
import { type Action } from '../../hooks/useResumeStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { Bot, Plus, Trash2, Sparkles, Loader2, SearchCheck } from 'lucide-react';
import { generateAISummary, enhanceAIBulletPoint, suggestAISkills, generateAIResume, analyzeAndSuggestKeywords } from '../../services/gemini';

interface ResumeFormProps {
  resumeData: ResumeData;
  dispatch: React.Dispatch<Action>;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full h-9 px-3 py-2 bg-transparent border rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="w-full min-h-[80px] px-3 py-2 bg-transparent border rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
);

const FieldGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{label}</label>
        {children}
    </div>
);

const AIButton: React.FC<{ onClick: () => void; isLoading: boolean, children: React.ReactNode }> = ({ onClick, isLoading, children }) => (
    <div className="relative group w-fit">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400 via-emerald-500 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={isLoading}
            className="relative flex items-center gap-2 bg-background"
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
            <div className="p-4 border border-lime-500/30 rounded-lg bg-card text-card-foreground shadow-lg shadow-lime-500/10 dark:shadow-lime-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-lime-500" />
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">AI Assistant</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Generate a full resume draft based on a job title.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Senior Product Manager" />
                    <AIButton onClick={handleGenerateFullResume} isLoading={loadingStates.fullResume}>Generate</AIButton>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['personal', 'summary', 'experience']} className="w-full">
                
                <AccordionItem value="ats-optimizer">
                    <AccordionTrigger>ATS Keyword Optimizer</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <FieldGroup label="Paste Job Description Here">
                            <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={6} placeholder="Paste the full job description to find missing keywords..." />
                        </FieldGroup>
                        <Button variant="secondary" size="sm" onClick={handleAnalyzeKeywords} disabled={loadingStates.ats}>
                            {loadingStates.ats ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <SearchCheck className="h-4 w-4 mr-2" />}
                            Analyze & Suggest Keywords
                        </Button>
                        {atsKeywords.length > 0 && (
                            <div className="p-3 bg-secondary rounded-md">
                                <h4 className="text-sm font-semibold mb-2">Suggested Keywords to Add:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {atsKeywords.map(keyword => (
                                        <span key={keyword} className="text-xs bg-background border px-2 py-1 rounded-full">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="personal">
                    <AccordionTrigger>Personal Details</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <FieldGroup label="Full Name"><Input value={resumeData.name} onChange={e => handleFieldChange('name', e.target.value)} /></FieldGroup>
                        <FieldGroup label="Email"><Input type="email" value={resumeData.email} onChange={e => handleFieldChange('email', e.target.value)} /></FieldGroup>
                        <FieldGroup label="Phone"><Input value={resumeData.phone} onChange={e => handleFieldChange('phone', e.target.value)} /></FieldGroup>
                        <FieldGroup label="Website / Portfolio"><Input value={resumeData.website} onChange={e => handleFieldChange('website', e.target.value)} /></FieldGroup>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="summary">
                    <AccordionTrigger>Professional Summary</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        <FieldGroup label="Summary">
                            <Textarea value={resumeData.summary} onChange={e => handleFieldChange('summary', e.target.value)} rows={4} />
                        </FieldGroup>
                        <AIButton onClick={handleGenerateSummary} isLoading={loadingStates.summary}>Generate Summary</AIButton>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="skills">
                    <AccordionTrigger>Skills</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                         <FieldGroup label="Skills (comma-separated)">
                            <Textarea value={resumeData.skills} onChange={e => handleFieldChange('skills', e.target.value)} rows={3} />
                        </FieldGroup>
                         <AIButton onClick={handleSuggestSkills} isLoading={loadingStates.skills}>Suggest Skills</AIButton>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="experience">
                    <AccordionTrigger>Experience</AccordionTrigger>
                    <AccordionContent className="space-y-6">
                        {resumeData.experience.map(exp => (
                            <div key={exp.id} className="p-4 border rounded-md relative">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleDeleteItem('experience', exp.id)}><Trash2 className="h-4 w-4" /></Button>
                                <div className="space-y-4">
                                    <FieldGroup label="Company"><Input value={exp.company} onChange={e => handleItemChange('experience', exp.id, { company: e.target.value })} /></FieldGroup>
                                    <FieldGroup label="Job Title"><Input value={exp.title} onChange={e => handleItemChange('experience', exp.id, { title: e.target.value })} /></FieldGroup>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldGroup label="Start Date"><Input value={exp.startDate} onChange={e => handleItemChange('experience', exp.id, { startDate: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="End Date"><Input value={exp.endDate} onChange={e => handleItemChange('experience', exp.id, { endDate: e.target.value })} /></FieldGroup>
                                    </div>
                                    <FieldGroup label="Description (one bullet point per line)">
                                        <Textarea value={exp.description} onChange={e => handleItemChange('experience', exp.id, { description: e.target.value })} rows={5} />
                                    </FieldGroup>
                                    <AIButton onClick={() => handleEnhanceDescription(exp.id, exp.description)} isLoading={loadingStates.experience[exp.id]}>Enhance Description</AIButton>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" onClick={() => handleAddItem('experience')} className="flex items-center gap-2"><Plus className="h-4 w-4"/> Add Experience</Button>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="education">
                    <AccordionTrigger>Education</AccordionTrigger>
                    <AccordionContent className="space-y-6">
                        {resumeData.education.map(edu => (
                            <div key={edu.id} className="p-4 border rounded-md relative">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleDeleteItem('education', edu.id)}><Trash2 className="h-4 w-4" /></Button>
                                <div className="space-y-4">
                                    <FieldGroup label="University"><Input value={edu.university} onChange={e => handleItemChange('education', edu.id, { university: e.target.value })} /></FieldGroup>
                                    <FieldGroup label="Degree"><Input value={edu.degree} onChange={e => handleItemChange('education', edu.id, { degree: e.target.value })} /></FieldGroup>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldGroup label="Start Date"><Input value={edu.startDate} onChange={e => handleItemChange('education', edu.id, { startDate: e.target.value })} /></FieldGroup>
                                        <FieldGroup label="End Date"><Input value={edu.endDate} onChange={e => handleItemChange('education', edu.id, { endDate: e.target.value })} /></FieldGroup>
                                    </div>
                                </div>
                            </div>
                        ))}
                         <Button variant="outline" onClick={() => handleAddItem('education')} className="flex items-center gap-2"><Plus className="h-4 w-4"/> Add Education</Button>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="projects">
                    <AccordionTrigger>Projects</AccordionTrigger>
                    <AccordionContent className="space-y-6">
                        {resumeData.projects.map(proj => (
                            <div key={proj.id} className="p-4 border rounded-md relative">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleDeleteItem('projects', proj.id)}><Trash2 className="h-4 w-4" /></Button>
                                <div className="space-y-4">
                                    <FieldGroup label="Project Name"><Input value={proj.name} onChange={e => handleItemChange('projects', proj.id, { name: e.target.value })} /></FieldGroup>
                                    {/* Fix: Changed FieldGromp to FieldGroup */}
                                    <FieldGroup label="URL (Optional)"><Input value={proj.url} onChange={e => handleItemChange('projects', proj.id, { url: e.target.value })} /></FieldGroup>
                                    <FieldGroup label="Description"><Textarea value={proj.description} onChange={e => handleItemChange('projects', proj.id, { description: e.target.value })} rows={3} /></FieldGroup>
                                </div>
                            </div>
                        ))}
                         <Button variant="outline" onClick={() => handleAddItem('projects')} className="flex items-center gap-2"><Plus className="h-4 w-4"/> Add Project</Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};