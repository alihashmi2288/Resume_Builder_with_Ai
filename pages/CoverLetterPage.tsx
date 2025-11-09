import * as React from 'react';
import { useResumeStore } from '../hooks/useResumeStore';
import { generateAICoverLetter } from '../services/gemini';
import { Button } from '../components/ui/Button';
import { Sparkles, Loader2, Clipboard, ClipboardCheck, AlertCircle } from 'lucide-react';

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="w-full min-h-[80px] px-3 py-2 bg-transparent border rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
);

const CoverLetterPage: React.FC = () => {
    const { resumeData } = useResumeStore();
    const [jobDescription, setJobDescription] = React.useState('');
    const [generatedLetter, setGeneratedLetter] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [isCopied, setIsCopied] = React.useState(false);

    const handleGenerate = async () => {
        if (!jobDescription) {
            setError('Please paste a job description first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedLetter('');
        try {
            const letter = await generateAICoverLetter(resumeData, jobDescription);
            setGeneratedLetter(letter);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">AI Cover Letter Generator</h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Paste a job description below. The AI will use your saved resume data to write a tailored cover letter.
                </p>
            </div>
            
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-lg">
                        <label htmlFor="job-description" className="block text-lg font-semibold mb-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">
                           1. Paste Job Description
                        </label>
                        <Textarea 
                            id="job-description"
                            rows={15}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                        />
                        <div className="mt-4">
                            <Button onClick={handleGenerate} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                {isLoading ? 'Generating...' : 'Generate Cover Letter'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-lg min-h-[400px]">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">2. Generated Cover Letter</h2>
                            {generatedLetter && (
                                <Button variant="ghost" size="sm" onClick={handleCopy}>
                                    {isCopied ? <ClipboardCheck className="h-4 w-4 mr-2 text-green-500" /> : <Clipboard className="h-4 w-4 mr-2" />}
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </Button>
                            )}
                        </div>
                        {isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-muted-foreground">
                                    <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                                    <p>Crafting your cover letter...</p>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-destructive" role="alert">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                    <p>Error: {error}</p>
                                </div>
                            </div>
                        )}
                        {generatedLetter && !isLoading && (
                            <div className="p-3 bg-secondary rounded-md text-sm whitespace-pre-wrap font-serif">
                                {generatedLetter}
                            </div>
                        )}
                         {!generatedLetter && !isLoading && !error && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground text-center">Your generated cover letter will appear here.</p>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterPage;