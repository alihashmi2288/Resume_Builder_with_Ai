import * as React from 'react';
import { Link } from 'react-router-dom';
import { ResumePreview } from '../components/builder/ResumePreview';
import { type ResumeData, type TemplateId } from '../types';

// Sample data to populate the template previews
const sampleResumeData: ResumeData = {
  name: 'Syed Ali Hashmi',
  email: 'syed.ali.hashmi@email.com',
  phone: '555-123-4567',
  website: 'syedalihashmi.dev',
  summary: 'Dedicated and results-oriented Software Engineer with 5+ years of experience in designing, developing, and deploying scalable web applications. Proficient in modern frontend and backend technologies.',
  skills: 'JavaScript, TypeScript, React, Node.js, Python, Docker, AWS',
  education: [
    { id: 'edu-1', university: 'State University', degree: 'B.S. in Computer Science', startDate: '2014', endDate: '2018' },
  ],
  experience: [
    { id: 'exp-1', company: 'Innovate Inc.', title: 'Senior Software Engineer', startDate: '2020', endDate: 'Present', description: '- Led the development of a new microservices-based architecture.\n- Mentored junior engineers and conducted code reviews.' },
    { id: 'exp-2', company: 'Data Solutions', title: 'Software Engineer', startDate: '2018', endDate: '2020', description: '- Developed features for a high-traffic customer-facing dashboard.\n- Improved application performance by 20%.' },
  ],
  projects: [
    { id: 'proj-1', name: 'Personal Portfolio', description: 'A responsive personal website to showcase projects.', url: 'github.com/alihashmi/portfolio' },
  ],
};

const templates: { id: TemplateId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'creative', name: 'Creative' },
  { id: 'technical', name: 'Technical' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'academic', name: 'Academic' },
  { id: 'executive', name: 'Executive' },
  { id: 'infographic', name: 'Infographic' },
  { id: 'startup', name: 'Startup' },
];

const TemplatesPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Choose Your Template</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Select a professionally designed template to start building your resume. You can always switch templates later.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {templates.map((template) => (
          <div key={template.id} className="group">
            <Link to={`/builder?template=${template.id}`}>
              <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-2 duration-300 ease-in-out">
                {/* 
                  This creates a scaled-down, non-interactive preview of the resume template.
                  The inner div is scaled, and its container clips the oversized content.
                  w-[250%] is 1/0.4, compensating for the scale down to make the preview fill its space.
                */}
                <div className="overflow-hidden aspect-[8.5/11] pointer-events-none">
                    <div className="scale-[0.4] origin-top-left w-[250%] h-[250%]">
                        <ResumePreview data={sampleResumeData} template={template.id} />
                    </div>
                </div>
              </div>
              <h3 className="text-center mt-4 text-lg font-medium bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">{template.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;