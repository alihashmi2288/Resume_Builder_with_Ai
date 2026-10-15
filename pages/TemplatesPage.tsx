import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Check } from 'lucide-react';
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
  { id: 'classic',     name: 'Classic',      desc: 'Timeless single-column design trusted by corporate recruiters and ATS systems worldwide.', category: 'ats', badge: 'ATS #1 Best Pick' },
  { id: 'modern',      name: 'Modern',       desc: 'Clean lines, balanced whitespace, and contemporary typography for tech roles.', category: 'tech', badge: 'High Engagement' },
  { id: 'creative',    name: 'Creative',     desc: 'Designed to stand out in UI/UX design, marketing, media, and product roles.', category: 'creative', badge: 'Portfolio Ready' },
  { id: 'technical',   name: 'Technical',    desc: 'Optimized for software engineers, DevOps specialists, and data scientists.', category: 'tech', badge: 'Engineer Favorite' },
  { id: 'minimalist',  name: 'Minimalist',   desc: 'Ultra-clean typography that lets your achievements speak for themselves.', category: 'ats', badge: 'Zero Clutter' },
  { id: 'academic',    name: 'Academic',     desc: 'Structured for researchers, educators, scholars, and scientific publications.', category: 'ats', badge: 'Scholarly Layout' },
  { id: 'executive',   name: 'Executive',    desc: 'Authoritative, distinguished layout tailored for VP, Director, and leadership roles.', category: 'executive', badge: 'Leadership' },
  { id: 'infographic', name: 'Infographic',  desc: 'Dynamic visual presentation with engaging skill bars and clear hierarchy.', category: 'creative', badge: 'Visual Impact' },
  { id: 'startup',     name: 'Startup',      desc: 'High-impact design for early-stage tech founders and fast-moving teams.', category: 'tech', badge: 'Fast-Paced' },
];

const colors: { id: ThemeColor; name: string; hex: string }[] = [
  { id: 'slate',   name: 'Slate',   hex: '#475569' },
  { id: 'indigo',  name: 'Indigo',  hex: '#4262ff' },
  { id: 'blue',    name: 'Blue',    hex: '#2563eb' },
  { id: 'emerald', name: 'Emerald', hex: '#00b473' },
  { id: 'rose',    name: 'Rose',    hex: '#e11d48' },
  { id: 'amber',   name: 'Amber',   hex: '#ffd02f' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates (9)' },
  { id: 'ats', label: 'ATS Verified' },
  { id: 'tech', label: 'Tech & Engineering' },
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative & Design' },
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
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#141416] text-[#1c1c1e] dark:text-white transition-colors">
      
      {/* Page Header */}
      <div className="w-full text-center py-16 md:py-20 px-6 max-w-[1280px] mx-auto">
        <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-4 py-1.5 mb-4 inline-block">
          9 PROFESSIONAL RESUME LAYOUTS
        </span>
        <h1 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
          Pick your winning resume style.
        </h1>
        <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5] max-w-xl mx-auto mb-8">
          Every template is engineered to pass Applicant Tracking Systems (ATS) and impress hiring managers. Filter by industry and customize colors in real-time.
        </p>

        {/* Interactive Live Color Palette Bar */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f7f8fa] dark:bg-[#1f1f24] border border-[#e0e2e8] dark:border-[#2c2c34]">
          <span className="text-xs font-semibold text-[#555a6a] dark:text-[#a5a8b5] flex items-center gap-1.5">
            <Palette className="size-3.5 text-[#ffd02f]" />
            Preview Palette:
          </span>
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c.id)}
                className={`size-6 rounded-full transition-transform ${
                  selectedColor === c.id
                    ? 'ring-2 ring-[#1c1c1e] dark:ring-white scale-110'
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

      {/* Pill-Tab Filter Bar per DESIGN.md */}
      <div className="w-full max-w-[1280px] mx-auto px-6 mb-12 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1c1c1e] text-white shadow-sm'
                  : 'bg-[#f7f8fa] dark:bg-[#1f1f24] text-[#555a6a] dark:text-[#a5a8b5] border border-[#e0e2e8] dark:border-[#2c2c34] hover:bg-[#eef0f3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="w-full max-w-[1280px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Link
              key={template.id}
              to={`/builder?template=${template.id}`}
              className="group flex flex-col relative text-left"
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`Use ${template.name} template`}
            >
              <div className={`relative rounded-2xl border overflow-hidden bg-white dark:bg-[#1c1c1e] transition-all duration-300 flex flex-col ${
                hoveredId === template.id
                  ? 'border-[#1c1c1e] dark:border-[#ffd02f] shadow-xl -translate-y-1'
                  : 'border-[#e0e2e8] dark:border-[#2c2c34] shadow-sm'
              }`}>
                {/* Header bar */}
                <div className="h-10 border-b border-[#eef0f3] dark:border-[#2c2c34] px-4 flex items-center justify-between text-xs bg-[#fafbfc] dark:bg-[#16161a]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1c1c1e] dark:text-white">{template.name}</span>
                    <span className="text-[10px] text-[#8e91a0] font-mono lowercase">.{template.id}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fff8e0] text-[#746019]">
                    {template.badge}
                  </span>
                </div>

                <div className="overflow-hidden pointer-events-none relative bg-white" style={{ aspectRatio: '8.5/11' }}>
                  <div className="origin-top-left" style={{ transform: 'scale(0.4)', width: '250%', height: '250%' }}>
                    <ResumePreview data={previewResumeData} template={template.id} />
                  </div>
                </div>

                {/* Hover overlay with Miro pill CTA */}
                <div className="absolute inset-0 bg-[#1c1c1e]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <span className="btn-miro-primary text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    Use {template.name}
                    <ArrowRight className="size-3.5 ml-1" />
                  </span>
                </div>
              </div>

              {/* Description row */}
              <div className="flex items-start justify-between mt-3 px-1">
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1c1e] dark:text-white group-hover:text-[#4262ff] transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-[#555a6a] dark:text-[#a5a8b5] leading-relaxed mt-0.5 max-w-[280px]">
                    {template.desc}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#4262ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-0.5">
                  Select <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 text-center p-10 rounded-2xl bg-[#f7f8fa] dark:bg-[#1a1a1e] border border-[#e0e2e8] dark:border-[#2c2c34] max-w-2xl mx-auto">
          <span className="bg-[#ffd02f] text-[#1c1c1e] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            Seamless Switch
          </span>
          <h3 className="text-xl font-bold text-[#1c1c1e] dark:text-white mb-2">Switch Layouts Anytime</h3>
          <p className="text-xs text-[#555a6a] dark:text-[#a5a8b5] mb-6 max-w-md mx-auto">
            Your profile details and content are automatically preserved when switching layouts. Experiment with different templates to find your ideal fit.
          </p>
          <Button asChild size="lg" className="btn-miro-primary">
            <Link to="/builder">
              Open Resume Builder
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;