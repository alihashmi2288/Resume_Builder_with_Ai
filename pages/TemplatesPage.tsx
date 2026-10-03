import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ResumePreview } from '../components/builder/ResumePreview';
import { type ResumeData, type TemplateId } from '../types';
import { Button } from '../components/ui/Button';

const sampleResumeData: ResumeData = {
  name: 'Syed Ali Hashmi',
  email: 'syed.ali.hashmi@email.com',
  phone: '555-123-4567',
  website: 'syedalihashmi.dev',
  summary: 'Dedicated Software Engineer with 5+ years of experience designing and deploying scalable web applications. Proficient in modern frontend and backend technologies.',
  skills: 'JavaScript, TypeScript, React, Node.js, Python, Docker, AWS',
  education: [
    { id: 'edu-1', university: 'State University', degree: 'B.S. in Computer Science', startDate: '2014', endDate: '2018' },
  ],
  experience: [
    { id: 'exp-1', company: 'Innovate Inc.', title: 'Senior Software Engineer', startDate: '2020', endDate: 'Present', description: '- Led development of a new microservices-based architecture.\n- Mentored junior engineers and conducted code reviews.' },
    { id: 'exp-2', company: 'Data Solutions', title: 'Software Engineer', startDate: '2018', endDate: '2020', description: '- Developed features for a high-traffic customer-facing dashboard.\n- Improved application performance by 20%.' },
  ],
  projects: [
    { id: 'proj-1', name: 'Personal Portfolio', description: 'A responsive personal website to showcase projects.', url: 'github.com/alihashmi/portfolio' },
  ],
};

const templates: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'classic',     name: 'Classic',      desc: 'Timeless and trusted by recruiters in any industry.' },
  { id: 'modern',      name: 'Modern',       desc: 'Clean lines and a bold header for a contemporary look.' },
  { id: 'creative',    name: 'Creative',     desc: 'Stand out in design, marketing, or creative roles.' },
  { id: 'technical',   name: 'Technical',    desc: 'Optimised for engineers and technical specialists.' },
  { id: 'minimalist',  name: 'Minimalist',   desc: 'Less is more — lets your content do the talking.' },
  { id: 'academic',    name: 'Academic',     desc: 'Structured for research, teaching, and academia.' },
  { id: 'executive',   name: 'Executive',    desc: 'Authoritative layout for senior leadership roles.' },
  { id: 'infographic', name: 'Infographic',  desc: 'Visual and engaging for portfolio-driven professions.' },
  { id: 'startup',     name: 'Startup',      desc: 'Dynamic and direct for fast-moving startup environments.' },
];

const TemplatesPage: React.FC = () => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-center">
      {/* Page header */}
      <div className="w-full text-center py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, background: 'hsl(var(--primary) / 0.08)', filter: 'blur(80px)', top: -120, right: -80 }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">9 layouts</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-4 text-balance">
            Choose your template
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed text-pretty">
            Select a design that fits your role. You can switch templates any time in the builder — your data is always preserved.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              to={`/builder?template=${template.id}`}
              className="group flex flex-col relative"
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`Use ${template.name} template`}
            >
              {/* Preview card with macOS window controls */}
              <div className={`relative rounded-2xl border overflow-hidden bg-card transition-all duration-300 flex flex-col ${
                hoveredId === template.id
                  ? 'border-primary/40 shadow-2xl shadow-primary/15 -translate-y-1.5'
                  : 'border-border/60 shadow-sm'
              }`}>
                {/* macOS style Window Header */}
                <div className="window-chrome" aria-hidden="true">
                  <div className="window-dot bg-rose-500/80"></div>
                  <div className="window-dot bg-amber-500/80"></div>
                  <div className="window-dot bg-emerald-500/80"></div>
                  <span className="text-[10px] text-muted-foreground font-mono ml-2 opacity-60 lowercase">{template.id}.pdf</span>
                </div>

                <div className="overflow-hidden pointer-events-none relative" style={{ aspectRatio: '8.5/11' }} aria-hidden="true">
                  <div className="origin-top-left" style={{ transform: 'scale(0.4)', width: '250%', height: '250%' }}>
                    <ResumePreview data={sampleResumeData} template={template.id} />
                  </div>
                </div>

                {/* Hover glass action overlay */}
                <div className="preview-hover-overlay">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out select-none">
                    Use {template.name}
                  </span>
                </div>
              </div>

              {/* Label row */}
              <div className="flex items-start justify-between mt-3.5 px-0.5">
                <div>
                  <h3 className={`text-sm font-semibold transition-colors ${
                    hoveredId === template.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5 max-w-[220px] text-pretty">{template.desc}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold text-primary transition-all duration-300 mt-0.5 flex-shrink-0 ${
                  hoveredId === template.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
                }`}>
                  Use this
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4 text-pretty">Not sure which to pick? Start with Classic — you can always switch later.</p>
          <Button asChild size="lg">
            <Link to="/builder">
              Open the Builder
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;