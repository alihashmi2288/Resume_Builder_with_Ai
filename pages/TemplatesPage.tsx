import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Palette, Sparkles, Filter } from 'lucide-react';
import { ResumePreview } from '../components/builder/ResumePreview';
import { type ResumeData, type TemplateId, type ThemeColor } from '../types';
import { Button } from '../components/ui/Button';

const baseSampleResumeData: ResumeData = {
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

interface TemplateMeta {
  id: TemplateId;
  name: string;
  desc: string;
  category: 'ats' | 'tech' | 'executive' | 'creative';
  badge: string;
}

const templates: TemplateMeta[] = [
  { id: 'classic',     name: 'Classic',      desc: 'Timeless and trusted by corporate recruiters and ATS scanners worldwide.', category: 'ats', badge: 'ATS #1 Best Pick' },
  { id: 'modern',      name: 'Modern',       desc: 'Clean lines, balanced whitespace, and contemporary typography.', category: 'tech', badge: 'High Engagement' },
  { id: 'creative',    name: 'Creative',     desc: 'Designed to stand out in UI/UX design, marketing, and media roles.', category: 'creative', badge: 'Portfolio Ready' },
  { id: 'technical',   name: 'Technical',    desc: 'Optimized for software developers, devops engineers, and IT specialists.', category: 'tech', badge: 'Engineer Favorite' },
  { id: 'minimalist',  name: 'Minimalist',   desc: 'Less is more. Ultra-clean typography that lets your achievements shine.', category: 'ats', badge: 'Zero Clutter' },
  { id: 'academic',    name: 'Academic',     desc: 'Structured for researchers, educators, scholars, and scientific publications.', category: 'ats', badge: 'Scholarly Layout' },
  { id: 'executive',   name: 'Executive',    desc: 'Authoritative, distinguished layout tailored for VP, Director, and C-suite roles.', category: 'executive', badge: 'Leadership' },
  { id: 'infographic', name: 'Infographic',  desc: 'Dynamic visual presentation with engaging visual hierarchy.', category: 'creative', badge: 'Visual Impact' },
  { id: 'startup',     name: 'Startup',      desc: 'Fast-paced, high-impact design for high-growth tech companies and founders.', category: 'tech', badge: 'Fast-Paced' },
];

const colors: { id: ThemeColor; name: string; hex: string }[] = [
  { id: 'slate',   name: 'Slate',   hex: '#475569' },
  { id: 'indigo',  name: 'Indigo',  hex: '#4f46e5' },
  { id: 'blue',    name: 'Blue',    hex: '#2563eb' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'rose',    name: 'Rose',    hex: '#e11d48' },
  { id: 'amber',   name: 'Amber',   hex: '#d97706' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates (9)' },
  { id: 'ats', label: 'ATS Verified' },
  { id: 'tech', label: 'Modern & Tech' },
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative' },
] as const;

const TemplatesPage: React.FC = () => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<ThemeColor>('indigo');
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const filteredTemplates = React.useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const previewResumeData = React.useMemo(() => ({
    ...baseSampleResumeData,
    themeColor: selectedColor,
  }), [selectedColor]);

  return (
    <div className="flex flex-col items-center">
      {/* Page header */}
      <div className="w-full text-center py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, background: 'hsl(var(--primary) / 0.08)', filter: 'blur(80px)', top: -120, right: -80 }} />
        
        <div className="container mx-auto px-4 relative max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">9 Professional Layouts</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3 text-balance">
            Pick Your Winning Resume Style
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed text-pretty">
            Every template is engineered to pass Applicant Tracking Systems (ATS) and impress hiring managers. Filter by industry and customize colors in real-time.
          </p>

          {/* Interactive Live Color Palette Bar */}
          <div className="mt-8 inline-flex items-center gap-3 p-2 rounded-2xl bg-card border border-border/80 shadow-sm backdrop-blur-md">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 pl-2">
              <Palette className="size-3.5 text-primary" />
              Preview Accent:
            </span>
            <div className="flex items-center gap-1.5 pr-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`size-6 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedColor === c.id
                      ? 'ring-2 ring-offset-2 ring-offset-background scale-110 shadow-md'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} palette`}
                  aria-label={`Preview ${c.name} color`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="container mx-auto px-4 max-w-6xl mb-8 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-muted/40 border border-border/70">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeCategory === cat.id
                  ? 'bg-card text-foreground shadow-sm border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredTemplates.map((template) => (
            <Link
              key={template.id}
              to={`/builder?template=${template.id}`}
              className="group flex flex-col relative"
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`Use ${template.name} template`}
            >
              {/* Preview card with macOS window frame */}
              <div className={`relative rounded-2xl border overflow-hidden bg-card transition-all duration-300 flex flex-col ${
                hoveredId === template.id
                  ? 'border-primary/50 shadow-2xl shadow-primary/15 -translate-y-1.5 ring-1 ring-primary/20'
                  : 'border-border/60 shadow-sm'
              }`}>
                {/* macOS style Window Header */}
                <div className="window-chrome flex items-center justify-between" aria-hidden="true">
                  <div className="flex items-center gap-1.5">
                    <div className="window-dot bg-rose-500/80"></div>
                    <div className="window-dot bg-amber-500/80"></div>
                    <div className="window-dot bg-emerald-500/80"></div>
                    <span className="text-[10px] text-muted-foreground font-mono ml-2 opacity-60 lowercase">{template.id}.pdf</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/8 px-2 py-0.5 rounded-full">
                    {template.badge}
                  </span>
                </div>

                <div className="overflow-hidden pointer-events-none relative" style={{ aspectRatio: '8.5/11' }} aria-hidden="true">
                  <div className="origin-top-left" style={{ transform: 'scale(0.4)', width: '250%', height: '250%' }}>
                    <ResumePreview data={previewResumeData} template={template.id} />
                  </div>
                </div>

                {/* Hover glass action overlay */}
                <div className="preview-hover-overlay">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out select-none flex items-center gap-1.5">
                    Use {template.name}
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>

              {/* Label row */}
              <div className="flex items-start justify-between mt-3.5 px-0.5">
                <div>
                  <h3 className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    hoveredId === template.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5 max-w-[240px] text-pretty">{template.desc}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold text-primary transition-all duration-300 mt-0.5 flex-shrink-0 ${
                  hoveredId === template.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
                }`}>
                  Select
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-card border border-border/80 shadow-sm max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-foreground mb-2">Switch Templates Anytime</h3>
          <p className="text-xs text-muted-foreground mb-5 max-w-md mx-auto text-pretty">
            Your profile details and content are automatically preserved when switching layouts. Experiment with different templates to find your ideal fit.
          </p>
          <Button asChild size="lg" className="btn-primary-glow">
            <Link to="/builder">
              Open Resume Builder
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;