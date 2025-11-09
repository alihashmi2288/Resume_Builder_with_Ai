import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResumeForm } from '../components/builder/ResumeForm';
import { ResumePreview } from '../components/builder/ResumePreview';
import { useResumeStore } from '../hooks/useResumeStore';
import { type TemplateId } from '../types';
import { downloadAsPdf } from '../lib/pdf';
import { Button } from '../components/ui/Button';
import { Download, Eye, Code, Trash2 } from 'lucide-react';

const BuilderPage: React.FC = () => {
  const { resumeData, dispatch } = useResumeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTemplate, setActiveTemplate] = React.useState<TemplateId>(
    (searchParams.get('template') as TemplateId) || 'classic'
  );
  const [viewMode, setViewMode] = React.useState<'form' | 'preview'>('form');

  React.useEffect(() => {
    const templateFromUrl = searchParams.get('template') as TemplateId;
    if (templateFromUrl) {
      setActiveTemplate(templateFromUrl);
    }
  }, [searchParams]);
  
  const handleTemplateChange = (template: TemplateId) => {
    setActiveTemplate(template);
    setSearchParams({ template });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      dispatch({ type: 'RESET_DATA' });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background/80 backdrop-blur-sm sticky top-[56px] z-40 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-foreground/70 text-transparent bg-clip-text">Resume Builder</h1>
          </div>
          
          {/* Mobile controls consolidated in the header */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'form' ? 'preview' : 'form')}
            >
              {viewMode === 'form' ? <Eye className="h-4 w-4 mr-1" /> : <Code className="h-4 w-4 mr-1" />}
              <span>{viewMode === 'form' ? 'Preview' : 'Edit'}</span>
            </Button>
            <select 
              value={activeTemplate}
              onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
              className="h-9 px-2 bg-transparent border rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Select Template"
            >
              <option value="classic" className="text-black">Classic</option>
              <option value="modern" className="text-black">Modern</option>
              <option value="creative" className="text-black">Creative</option>
              <option value="technical" className="text-black">Technical</option>
              <option value="minimalist" className="text-black">Minimalist</option>
              <option value="academic" className="text-black">Academic</option>
              <option value="executive" className="text-black">Executive</option>
              <option value="infographic" className="text-black">Infographic</option>
              <option value="startup" className="text-black">Startup</option>
            </select>
            <Button variant="outline" size="icon" onClick={() => downloadAsPdf('resume-preview-content')}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download PDF</span>
            </Button>
          </div>
          
          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-2">
             <select 
               value={activeTemplate}
               onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
               className="h-9 px-3 bg-transparent border rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
             >
               <option value="classic" className="text-black">Classic</option>
               <option value="modern" className="text-black">Modern</option>
               <option value="creative" className="text-black">Creative</option>
               <option value="technical" className="text-black">Technical</option>
               <option value="minimalist" className="text-black">Minimalist</option>
               <option value="academic" className="text-black">Academic</option>
               <option value="executive" className="text-black">Executive</option>
               <option value="infographic" className="text-black">Infographic</option>
               <option value="startup" className="text-black">Startup</option>
             </select>
             <Button variant="outline" size="sm" onClick={handleReset}>
               <Trash2 className="h-4 w-4 mr-2" />
               Reset
             </Button>
             <Button size="sm" onClick={() => downloadAsPdf('resume-preview-content')}>
               <Download className="h-4 w-4 mr-2" />
               Download PDF
             </Button>
          </div>
        </div>
      </div>
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className={`lg:col-span-2 ${viewMode === 'preview' ? 'hidden' : ''} md:block`}>
            <ResumeForm resumeData={resumeData} dispatch={dispatch} />
          </div>
          <div className={`lg:col-span-3 ${viewMode === 'form' ? 'hidden' : ''} md:block`}>
            <div className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto bg-white rounded-lg p-4">
              <ResumePreview data={resumeData} template={activeTemplate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;