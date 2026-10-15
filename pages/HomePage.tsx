import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  Bot,
  Palette,
  FileText,
  SearchCheck,
  FileSignature,
  Check,
  Sparkles,
  MousePointer2,
  Layers,
  ChevronDown,
  ShieldCheck,
  Download,
  HelpCircle,
  Zap,
  Sliders,
  Maximize2
} from 'lucide-react';
import { ResumePreview } from '../components/builder/ResumePreview';
import type { ResumeData, TemplateId } from '../types';

/* ─── Sample data for live template previews ─────────────────────────── */
const sampleResumeData: ResumeData = {
  name: 'Syed Ali Hashmi',
  email: 'syed@email.com',
  phone: '555-123-4567',
  website: 'syedali.dev',
  summary: 'Senior Software Engineer with 5+ years of experience building scalable web architectures and AI applications.',
  skills: 'TypeScript, React, Node.js, Python, Docker, AWS, GraphQL',
  education: [
    {
      id: 'edu-1',
      university: 'Karachi University',
      degree: 'B.S. Computer Science',
      startDate: '2018',
      endDate: '2022'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Corp',
      title: 'Senior Software Engineer',
      startDate: '2022',
      endDate: 'Present',
      description: '• Architected resilient microservices handling 4M+ requests/day\n• Reduced API latency by 42% through distributed caching\n• Mentored 6 engineers and drove CI/CD automation'
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      title: 'Full Stack Developer',
      startDate: '2020',
      endDate: '2022',
      description: '• Developed client-facing dashboard using React and TypeScript\n• Optimized bundle size by 35% and improved Core Web Vitals'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'AI Resume Architect',
      description: 'Visual AI resume builder with ATS scoring and real-time PDF generation.',
      url: 'github.com/alihashmi2288/resume-builder'
    }
  ]
};

const templates: { id: TemplateId; name: string; tag: string }[] = [
  { id: 'classic',    name: 'Classic',    tag: 'ATS Optimized' },
  { id: 'modern',     name: 'Modern',     tag: 'Popular' },
  { id: 'creative',   name: 'Creative',   tag: 'Design & UI' },
  { id: 'technical',  name: 'Technical',  tag: 'Engineering' },
  { id: 'minimalist', name: 'Minimalist', tag: 'Zero Clutter' },
  { id: 'academic',   name: 'Academic',   tag: 'Scholarly' },
  { id: 'executive',  name: 'Executive',  tag: 'Leadership' },
  { id: 'infographic',name: 'Infographic',tag: 'Visual' },
  { id: 'startup',    name: 'Startup',    tag: 'Fast Paced' }
];

const faqs = [
  {
    q: 'Why is an ATS-optimized resume so important?',
    a: 'Over 90% of Fortune 500 companies use Applicant Tracking Systems (ATS) like Workday, Greenhouse, and Taleo. Our templates are constructed with semantic hierarchy, clean single/two-column flows, and selectable vector typography so your achievements parse without error.'
  },
  {
    q: 'How does the Gemini AI integration work?',
    a: 'You can generate tailored executive summaries, refine existing bullet points into quantified impact statements, or match your resume to a job description. You can provide your own free Gemini API key in the header settings for completely unlimited, private generation.'
  },
  {
    q: 'Is my data secure and private?',
    a: 'Yes, 100%. All your profile data, work history, and API keys remain stored locally in your browser (LocalStorage). Nothing is stored on an external database.'
  },
  {
    q: 'Can I export clean, text-selectable PDF files?',
    a: 'Absolutely. We use native jsPDF and clean vector generation so recruiters and automated screening software can copy, paste, and parse text directly.'
  }
];

const HomePage: React.FC = () => {
  const [activeTemplateIndex, setActiveTemplateIndex] = React.useState(0);
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'annual'>('annual');
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');

  // Rotate hero template preview every 3 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveTemplateIndex((prev) => (prev + 1) % templates.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const filteredTemplates = React.useMemo(() => {
    if (selectedFilter === 'ats') return templates.filter(t => ['classic', 'minimalist', 'academic'].includes(t.id));
    if (selectedFilter === 'tech') return templates.filter(t => ['technical', 'modern', 'startup'].includes(t.id));
    if (selectedFilter === 'design') return templates.filter(t => ['creative', 'infographic', 'executive'].includes(t.id));
    return templates;
  }, [selectedFilter]);

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#141416] text-[#1c1c1e] dark:text-[#ffffff] transition-colors">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (hero-band-marketing per DESIGN.md)                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 max-w-[1280px] mx-auto text-center flex flex-col items-center">
        
        {/* Yellow Tag Chip per DESIGN.md (badge-tag-yellow) */}
        <div className="inline-flex items-center gap-2 bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-4 py-1.5 mb-8 border border-[#fcb900]/40 shadow-sm">
          <span className="size-2 rounded-full bg-[#ffd02f] animate-pulse" />
          <span>AI Visual Workspace for Resumes • 9 ATS Templates • 100% Free</span>
        </div>

        {/* 80px Hero Display per DESIGN.md (hero-display: 80px, 500, line-height 1.05, tracking -2px) */}
        <h1 className="font-hero-display text-[#1c1c1e] dark:text-white max-w-4xl mx-auto text-balance mb-6">
          See how teams & talent get great done with AI.
        </h1>

        {/* Hero Subtitle (18px, 400, line-height 1.50) */}
        <p className="text-[18px] text-[#555a6a] dark:text-[#a5a8b5] max-w-2xl mx-auto leading-relaxed mb-10 text-pretty">
          The collaborative visual workspace where you craft interview-winning resumes, audit ATS keyword compatibility, and generate tailored cover letters in seconds.
        </p>

        {/* Primary Black-Pill CTA + Secondary Outlined Pill per DESIGN.md */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button asChild size="lg" className="btn-miro-primary h-[50px] px-8 text-[15px]">
            <Link to="/builder">
              Get started free
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="secondary" className="btn-miro-secondary h-[50px] px-8 text-[15px]">
            <Link to="/templates">
              Explore 9 templates
            </Link>
          </Button>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* WHITEBOARD MOCKUP (whiteboard-mockup per DESIGN.md)                */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-[1180px] rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-[#ffffff] dark:bg-[#1a1a1e] shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)] overflow-hidden relative text-left">
          
          {/* Miro Board Top Application Bar */}
          <div className="h-12 border-b border-[#eef0f3] dark:border-[#2c2c34] bg-[#fafbfc] dark:bg-[#141416] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#ffd02f]">
                <svg viewBox="0 0 24 24" className="size-4 fill-[#1c1c1e]">
                  <path d="M4 18V6l4 2.5v7L4 18zm5.5 0V7l4 2v6.5l-4 2.5zm5.5 0V8.5l4 1.5v5.5l-4 2.5z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#1c1c1e] dark:text-white">
                Syed Ali – Senior Software Engineer Resume.miro
              </span>
              <span className="hidden sm:inline-block text-[11px] bg-[#eef0f3] dark:bg-[#2c2c34] text-[#6b6f7e] dark:text-[#a5a8b5] px-2 py-0.5 rounded-full font-medium">
                Auto-saved
              </span>
            </div>

            {/* Collaborator Avatars & Controls */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 overflow-hidden items-center mr-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#0fbcb0] text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1a1a1e]" title="Alex (Recruiter)">AL</span>
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#ffd02f] text-[10px] font-bold text-[#1c1c1e] ring-2 ring-white dark:ring-[#1a1a1e]" title="Gemini AI">AI</span>
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#4262ff] text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1a1a1e]" title="You (Author)">ME</span>
              </div>
              <span className="hidden md:inline-flex items-center text-xs font-medium text-[#00b473] bg-[#c3faf5]/40 px-2.5 py-1 rounded-full">
                <span className="size-1.5 rounded-full bg-[#00b473] mr-1.5 animate-pulse" />
                Live Whiteboard
              </span>
            </div>
          </div>

          {/* Whiteboard Interactive Canvas Area */}
          <div className="relative p-6 sm:p-10 min-h-[560px] bg-[#f7f8fa] dark:bg-[#16161a] overflow-hidden flex items-center justify-center">
            
            {/* Grid dot pattern simulating infinite canvas */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#a5a8b5 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Left Miro Tool Palette */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 p-1.5 bg-white dark:bg-[#1f1f24] border border-[#e0e2e8] dark:border-[#2c2c34] rounded-xl shadow-md z-20">
              <button aria-label="Select tool" className="size-8 rounded-lg bg-[#f0f0f3] dark:bg-[#2c2c34] flex items-center justify-center text-[#1c1c1e] dark:text-white"><MousePointer2 className="size-4" /></button>
              <button aria-label="Sticky note tool" className="size-8 rounded-lg hover:bg-[#f0f0f3] dark:hover:bg-[#2c2c34] flex items-center justify-center text-[#e11d48]"><div className="size-4 bg-[#ffd02f] rounded-sm" /></button>
              <button aria-label="Text tool" className="size-8 rounded-lg hover:bg-[#f0f0f3] dark:hover:bg-[#2c2c34] flex items-center justify-center text-[#555a6a] dark:text-[#a5a8b5] font-serif font-bold text-sm">T</button>
              <button aria-label="AI tool" className="size-8 rounded-lg hover:bg-[#f0f0f3] dark:hover:bg-[#2c2c34] flex items-center justify-center text-[#4262ff]"><Sparkles className="size-4" /></button>
              <button aria-label="Layers" className="size-8 rounded-lg hover:bg-[#f0f0f3] dark:hover:bg-[#2c2c34] flex items-center justify-center text-[#555a6a] dark:text-[#a5a8b5]"><Layers className="size-4" /></button>
            </div>

            {/* Sticky Note 1 (Yellow #fff4c4 per DESIGN.md sticky note palette) */}
            <div className="absolute top-6 left-8 md:left-20 z-10 w-[200px] p-4 rounded-xl bg-[#fff4c4] text-[#746019] shadow-md border border-[#ffd02f]/30 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="size-3.5 text-[#ffd02f] fill-[#ffd02f]" />
                <span>Gemini Copilot</span>
              </div>
              <p className="text-xs leading-snug">
                "Quantify bullet points with metric percentages to boost ATS score +18%."
              </p>
            </div>

            {/* Sticky Note 2 (Teal #c3faf5 per DESIGN.md sticky note palette) */}
            <div className="absolute bottom-8 left-6 md:left-24 z-10 w-[190px] p-4 rounded-xl bg-[#c3faf5] text-[#187574] shadow-md border border-[#0fbcb0]/30 transform rotate-2 hover:rotate-0 transition-transform">
              <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <SearchCheck className="size-3.5" />
                <span>ATS Pass Score</span>
              </div>
              <p className="text-xl font-bold font-display">98 / 100</p>
              <p className="text-[11px] opacity-80">Passed Workday & Taleo</p>
            </div>

            {/* Sticky Note 3 (Coral #ffc6c6 per DESIGN.md sticky note palette) */}
            <div className="absolute top-8 right-6 md:right-16 z-10 w-[200px] p-4 rounded-xl bg-[#ffc6c6] text-[#600000] shadow-md border border-[#ff9999]/40 transform rotate-3 hover:rotate-0 transition-transform">
              <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileSignature className="size-3.5" />
                <span>Cover Letter</span>
              </div>
              <p className="text-xs leading-snug">
                Tailored 1-click letter synced to Google SRE requirements.
              </p>
            </div>

            {/* Sticky Note 4 (Rose #fde0f0 per DESIGN.md sticky note palette) */}
            <div className="absolute bottom-8 right-8 md:right-20 z-10 w-[190px] p-4 rounded-xl bg-[#fde0f0] text-[#1c1c1e] shadow-md border border-[#ffd8f4]/50 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="text-xs font-bold uppercase tracking-wider mb-1 text-[#4262ff]">
                Template Style
              </div>
              <p className="text-xs font-semibold">
                Active: {templates[activeTemplateIndex].name}
              </p>
              <p className="text-[11px] text-[#555a6a]">9 Switchable Layouts</p>
            </div>

            {/* Live Cursor 1: Recruiter */}
            <div className="absolute top-[35%] right-[22%] z-30 pointer-events-none hidden sm:flex items-center gap-1">
              <MousePointer2 className="size-4 text-[#0fbcb0] fill-[#0fbcb0]" />
              <span className="bg-[#0fbcb0] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                Alex (Recruiter)
              </span>
            </div>

            {/* Live Cursor 2: Gemini AI */}
            <div className="absolute bottom-[30%] left-[26%] z-30 pointer-events-none hidden sm:flex items-center gap-1">
              <MousePointer2 className="size-4 text-[#ffd02f] fill-[#ffd02f]" />
              <span className="bg-[#1c1c1e] text-[#ffd02f] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                Gemini 2.5
              </span>
            </div>

            {/* Center Live Resume Preview Document Frame */}
            <div className="relative z-10 w-[300px] sm:w-[380px] md:w-[460px] bg-white rounded-xl shadow-2xl border border-[#e0e2e8] dark:border-[#3b3b45] overflow-hidden transition-all duration-500">
              <div className="h-8 bg-[#fafbfc] border-b border-[#eef0f3] px-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="size-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] text-[#8e91a0] font-mono">
                  {templates[activeTemplateIndex].id}.pdf (Vector ATS)
                </span>
                <span className="text-[10px] text-[#00b473] font-semibold">Ready</span>
              </div>

              <div className="relative overflow-hidden" style={{ height: '360px' }}>
                <div className="scale-[0.44] sm:scale-[0.52] md:scale-[0.58] origin-top-left pointer-events-none" style={{ width: '200%', height: '200%' }}>
                  <ResumePreview data={sampleResumeData} template={templates[activeTemplateIndex].id} />
                </div>
              </div>

              {/* Template Switcher Bar */}
              <div className="bg-[#ffffff] border-t border-[#eef0f3] p-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1c1c1e]">
                  Template: <span className="text-[#4262ff]">{templates[activeTemplateIndex].name}</span>
                </span>
                <Link
                  to={`/builder?template=${templates[activeTemplateIndex].id}`}
                  className="bg-[#1c1c1e] hover:bg-[#2c2c34] text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                >
                  Customize <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. STAT DISPLAY & SOCIAL PROOF STRIP (stat-display per DESIGN.md)    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 border-y border-[#e0e2e8] dark:border-[#2c2c34] bg-[#f7f8fa] dark:bg-[#16161a]">
        <div className="max-w-[1280px] mx-auto px-6">
          
          {/* Stat Row per DESIGN.md (stat-display: 64px, 500, -1.5px tracking) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
            <div>
              <p className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums">9</p>
              <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
                ATS-Optimized Templates
              </p>
            </div>
            <div>
              <p className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums">98%</p>
              <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
                ATS Scanner Pass Rate
              </p>
            </div>
            <div>
              <p className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums">100%</p>
              <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
                Private & Client-Side
              </p>
            </div>
            <div>
              <p className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums">0s</p>
              <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
                No Signup Required
              </p>
            </div>
          </div>

          {/* Hiring Wall Wordmarks */}
          <div className="pt-8 border-t border-[#e0e2e8] dark:border-[#2c2c34] text-center">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#8e91a0] mb-6">
              Empowering candidates interviewing at leading companies worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-[#6b6f7e] dark:text-[#a5a8b5] font-semibold text-lg">
              <span>Google</span>
              <span>Microsoft</span>
              <span>Amazon</span>
              <span>Stripe</span>
              <span>Airbnb</span>
              <span>Spotify</span>
              <span>Shopify</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. PASTEL FEATURE CARDS (card-feature-* per DESIGN.md)             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-24 px-6 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-3.5 py-1 mb-4 inline-block">
            VISUAL WORKSPACE CAPABILITIES
          </span>
          <h2 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
            Everything you need to land interviews.
          </h2>
          <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5]">
            From smart bullet suggestions to vector PDF export, explore tools designed to beat automated filters and impress recruiters.
          </p>
        </div>

        {/* Feature Grid with Miro Sticky-Note Pastels (Yellow, Coral, Teal, Rose, White) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tile 1: Yellow Feature Card ({card-feature-yellow}) */}
          <div className="card-feature-yellow flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#1c1c1e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Gemini AI
                </span>
                <Bot className="size-6 text-[#1c1c1e]" />
              </div>
              <h3 className="font-heading-3 text-[#1c1c1e] mb-3">
                AI Content Engine
              </h3>
              <p className="text-sm text-[#1c1c1e]/85 leading-relaxed">
                Generate professional summaries, refine work experience into quantified metric bullets, and suggest role-matched skills with Google Gemini in one click.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/builder" className="text-sm font-bold text-[#1c1c1e] inline-flex items-center gap-1.5 hover:underline">
                Try AI Builder <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Tile 2: Teal Feature Card ({card-feature-teal}) */}
          <div className="card-feature-teal flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#0fbcb0] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ATS Verified
                </span>
                <SearchCheck className="size-6 text-[#187574]" />
              </div>
              <h3 className="font-heading-3 text-[#187574] mb-3">
                Live ATS Score & Audit
              </h3>
              <p className="text-sm text-[#187574]/90 leading-relaxed">
                Instant parsing audit tests your resume against real ATS scanner rules. Get immediate feedback on keywords, contact info completeness, and formatting traps.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/builder?tab=audit" className="text-sm font-bold text-[#187574] inline-flex items-center gap-1.5 hover:underline">
                Audit Your Resume <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Tile 3: Coral Feature Card ({card-feature-coral}) */}
          <div className="card-feature-coral flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#ff9999] text-[#600000] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tailored Letters
                </span>
                <FileSignature className="size-6 text-[#600000]" />
              </div>
              <h3 className="font-heading-3 text-[#600000] mb-3">
                Cover Letter Generator
              </h3>
              <p className="text-sm text-[#600000]/85 leading-relaxed">
                Generate high-impact, personalized cover letters tailored to your target job description and your resume experience without generic corporate clichés.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/cover-letter" className="text-sm font-bold text-[#600000] inline-flex items-center gap-1.5 hover:underline">
                Write Cover Letter <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Tile 4: Rose Feature Card ({card-feature-rose}) */}
          <div className="card-feature-rose flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#1c1c1e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  9 Layouts
                </span>
                <Palette className="size-6 text-[#1c1c1e]" />
              </div>
              <h3 className="font-heading-3 text-[#1c1c1e] mb-3">
                9 Premium Templates
              </h3>
              <p className="text-sm text-[#1c1c1e]/85 leading-relaxed">
                From executive single-column classics to modern engineering designs. Customize accent colors, margins, and typography live without losing data.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/templates" className="text-sm font-bold text-[#1c1c1e] inline-flex items-center gap-1.5 hover:underline">
                Browse Templates <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Tile 5: White Base Card ({card-feature} with border) */}
          <div className="card-feature lg:col-span-2 flex flex-col justify-between min-h-[340px] relative overflow-hidden group bg-white dark:bg-[#1a1a1e] border border-[#e0e2e8] dark:border-[#2c2c34]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#4262ff] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Text-Selectable Vector
                </span>
                <Download className="size-6 text-[#4262ff]" />
              </div>
              <h3 className="font-heading-3 text-[#1c1c1e] dark:text-white mb-3">
                Pixel-Perfect Vector PDF Export
              </h3>
              <p className="text-sm text-[#555a6a] dark:text-[#a5a8b5] leading-relaxed max-w-xl">
                We generate real vector PDFs with live selectable text—never low-res canvas screenshots. Your resume renders crisp at 300 DPI on any display and parses flawlessly in applicant software.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between border-t border-[#eef0f3] dark:border-[#2c2c34] mt-6">
              <span className="text-xs text-[#8e91a0]">
                Works with Workday, Greenhouse, Taleo, iCIMS, Lever
              </span>
              <Link to="/builder" className="text-sm font-bold text-[#4262ff] inline-flex items-center gap-1.5 hover:underline">
                Build Now <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. TEMPLATE GALLERY SHOWCASE (pill-tab per DESIGN.md)               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-20 bg-[#f7f8fa] dark:bg-[#16161a] border-y border-[#e0e2e8] dark:border-[#2c2c34]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-3.5 py-1 mb-3 inline-block">
                CURATED LAYOUTS
              </span>
              <h2 className="font-heading-1 text-[#1c1c1e] dark:text-white">
                Choose your ideal resume format.
              </h2>
            </div>

            {/* Pill Tabs per DESIGN.md (pill-tab and pill-tab-active) */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Templates (9)' },
                { id: 'ats', label: 'ATS Verified' },
                { id: 'tech', label: 'Tech & Engineering' },
                { id: 'design', label: 'Creative & Exec' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedFilter === f.id
                      ? 'bg-[#1c1c1e] text-white'
                      : 'bg-white dark:bg-[#1f1f24] text-[#555a6a] dark:text-[#a5a8b5] border border-[#e0e2e8] dark:border-[#2c2c34] hover:bg-[#f0f0f3]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.slice(0, 6).map((tmpl) => (
              <div
                key={tmpl.id}
                className="group bg-white dark:bg-[#1c1c1e] border border-[#e0e2e8] dark:border-[#2c2c34] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Header Strip */}
                <div className="px-4 py-3 border-b border-[#eef0f3] dark:border-[#2c2c34] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1c1c1e] dark:text-white">{tmpl.name}</span>
                  <span className="bg-[#fff8e0] text-[#746019] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tmpl.tag}
                  </span>
                </div>

                {/* Scaled Preview */}
                <div className="relative overflow-hidden bg-white" style={{ height: '320px' }}>
                  <div className="scale-[0.38] origin-top-left pointer-events-none" style={{ width: '263%', height: '263%' }}>
                    <ResumePreview data={sampleResumeData} template={tmpl.id} />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#1c1c1e]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <Link
                      to={`/builder?template=${tmpl.id}`}
                      className="btn-miro-primary text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                    >
                      Use this template
                    </Link>
                  </div>
                </div>

                <div className="p-4 border-t border-[#eef0f3] dark:border-[#2c2c34] flex items-center justify-between text-xs">
                  <span className="text-[#8e91a0]">100% ATS Ready</span>
                  <Link
                    to={`/builder?template=${tmpl.id}`}
                    className="text-[#4262ff] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Select <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="secondary" size="lg" className="btn-miro-secondary">
              <Link to="/templates">
                View all 9 templates in gallery
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. 4-TIER PRICING & FEATURE COMPARISON (Key Miro Spec per DESIGN.md)*/}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-24 px-6 max-w-[1280px] mx-auto text-center">
        <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-3.5 py-1 mb-4 inline-block">
          PLANS & ACCESS
        </span>
        <h2 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
          Transparent plans for every ambition.
        </h2>
        <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5] max-w-xl mx-auto mb-10">
          Core builder is 100% free with your own Gemini API key. No hidden paywalls to download your PDF.
        </p>

        {/* Monthly / Annual Toggle per DESIGN.md (toggle-monthly-yearly) */}
        <div className="inline-flex items-center p-1.5 bg-[#f0f0f3] dark:bg-[#2c2c34] rounded-full mb-16 gap-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-[#1c1c1e] text-[#1c1c1e] dark:text-white shadow-sm'
                : 'text-[#555a6a] dark:text-[#a5a8b5]'
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingPeriod === 'annual'
                ? 'bg-white dark:bg-[#1c1c1e] text-[#1c1c1e] dark:text-white shadow-sm'
                : 'text-[#555a6a] dark:text-[#a5a8b5]'
            }`}
          >
            <span>Annual</span>
            <span className="badge-discount text-[10px]">SAVE 20%</span>
          </button>
        </div>

        {/* 4-Tier Pricing Grid per DESIGN.md (Free / Starter / Business / Enterprise) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-20">
          
          {/* Tier 1: Free */}
          <div className="pricing-card flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8e91a0] mb-2">Community</p>
              <h3 className="text-xl font-bold text-[#1c1c1e] dark:text-white mb-2">Free</h3>
              <p className="text-xs text-[#6b6f7e] dark:text-[#a5a8b5] mb-6">
                Everything you need to craft and download an ATS resume today.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[#1c1c1e] dark:text-white">$0</span>
                <span className="text-xs text-[#8e91a0]">forever</span>
              </div>
              <ul className="space-y-3 text-xs text-[#555a6a] dark:text-[#a5a8b5] mb-8">
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> All 9 ATS templates</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Unlimited text PDF exports</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Own Gemini API key support</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> 100% Client-side privacy</li>
              </ul>
            </div>
            <Button asChild variant="secondary" className="btn-miro-secondary w-full text-xs">
              <Link to="/builder">Get started free</Link>
            </Button>
          </div>

          {/* Tier 2: Starter */}
          <div className="pricing-card flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8e91a0] mb-2">Individual</p>
              <h3 className="text-xl font-bold text-[#1c1c1e] dark:text-white mb-2">Starter</h3>
              <p className="text-xs text-[#6b6f7e] dark:text-[#a5a8b5] mb-6">
                For active job seekers who want AI polish on all sections.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[#1c1c1e] dark:text-white">
                  {billingPeriod === 'annual' ? '$6' : '$8'}
                </span>
                <span className="text-xs text-[#8e91a0]">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-[#555a6a] dark:text-[#a5a8b5] mb-8">
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Everything in Free</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Managed AI without API key</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Live ATS keyword scanner</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Bullet impact quantification</li>
              </ul>
            </div>
            <Button asChild variant="secondary" className="btn-miro-secondary w-full text-xs">
              <Link to="/builder">Start 14-day trial</Link>
            </Button>
          </div>

          {/* Tier 3: Business (Featured tier with lavender bg + 2px blue border per DESIGN.md) */}
          <div className="pricing-card-featured flex flex-col justify-between shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#4262ff] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Most Popular
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4262ff] mb-2">Pro Career</p>
              <h3 className="text-xl font-bold text-[#1c1c1e] dark:text-white mb-2">Business Pro</h3>
              <p className="text-xs text-[#555a6a] dark:text-[#a5a8b5] mb-6">
                Full AI suite with tailored cover letters & deep ATS parsing.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[#1c1c1e] dark:text-white">
                  {billingPeriod === 'annual' ? '$12' : '$16'}
                </span>
                <span className="text-xs text-[#8e91a0]">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-[#1c1c1e] dark:text-white mb-8">
                <li className="flex items-center gap-2"><Check className="size-4 text-[#4262ff]" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#4262ff]" /> Unlimited Tailored Cover Letters</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#4262ff]" /> Multi-version resume profiles</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#4262ff]" /> Real-time job description matcher</li>
              </ul>
            </div>
            <Button asChild className="btn-miro-blue w-full text-xs">
              <Link to="/builder">Get Business Pro</Link>
            </Button>
          </div>

          {/* Tier 4: Enterprise (Dark card per DESIGN.md pricing-card-enterprise) */}
          <div className="pricing-card-enterprise flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#a5a8b5] mb-2">Organization</p>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-xs text-[#a5a8b5] mb-6">
                For career coaches, universities, and recruiting agencies.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-3 text-xs text-[#a5a8b5] mb-8">
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Custom template branding</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Team member seat licenses</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> Dedicated ATS parser tests</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-[#00b473]" /> SSO & Priority 24/7 SLA</li>
              </ul>
            </div>
            <Button asChild className="btn-miro-on-dark w-full text-xs">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>

        </div>

        {/* Dense Comparison Table per DESIGN.md (comparison-table & comparison-row) */}
        <div className="w-full text-left max-w-4xl mx-auto border border-[#e0e2e8] dark:border-[#2c2c34] rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-[#fafbfc] dark:bg-[#1a1a1e] p-5 border-b border-[#e0e2e8] dark:border-[#2c2c34] font-semibold text-sm">
            Detailed Feature Comparison Table
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e0e2e8] dark:border-[#2c2c34] bg-[#f7f8fa] dark:bg-[#141416] text-[#6b6f7e]">
                  <th className="p-4 font-semibold">Features & Capabilities</th>
                  <th className="p-4 font-semibold text-center">Free</th>
                  <th className="p-4 font-semibold text-center">Starter</th>
                  <th className="p-4 font-semibold text-center text-[#4262ff]">Business</th>
                  <th className="p-4 font-semibold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef0f3] dark:divide-[#2c2c34]">
                <tr>
                  <td className="p-4 font-medium text-[#1c1c1e] dark:text-white">Templates Included</td>
                  <td className="p-4 text-center">All 9</td>
                  <td className="p-4 text-center">All 9</td>
                  <td className="p-4 text-center text-[#4262ff] font-semibold">All 9</td>
                  <td className="p-4 text-center">All 9 + Custom</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#1c1c1e] dark:text-white">Text-Selectable Vector PDF</td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#1c1c1e] dark:text-white">Use Personal Gemini API Key</td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#1c1c1e] dark:text-white">Live ATS Keyword Scanner</td>
                  <td className="p-4 text-center text-[#8e91a0]">Basic</td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center">Deep Parser</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#1c1c1e] dark:text-white">Tailored Cover Letter AI</td>
                  <td className="p-4 text-center text-[#8e91a0]">Manual</td>
                  <td className="p-4 text-center">5 / mo</td>
                  <td className="p-4 text-center text-[#4262ff] font-semibold">Unlimited</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#1c1c1e] dark:text-white">Client-Side Privacy (Zero tracking)</td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="size-4 text-[#00b473] mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. FAQ ACCORDION (faq-accordion-item per DESIGN.md)                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-20 px-6 max-w-3xl mx-auto border-t border-[#e0e2e8] dark:border-[#2c2c34]">
        <div className="text-center mb-12">
          <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-3.5 py-1 mb-3 inline-block">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="font-heading-2 text-[#1c1c1e] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#e0e2e8] dark:border-[#2c2c34] rounded-xl overflow-hidden bg-white dark:bg-[#1a1a1e]"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-semibold text-sm flex items-center justify-between text-[#1c1c1e] dark:text-white hover:bg-[#f7f8fa] dark:hover:bg-[#242428] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`size-4 text-[#8e91a0] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#555a6a] dark:text-[#a5a8b5] leading-relaxed border-t border-[#eef0f3] dark:border-[#2c2c34] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 7. CTA BANNER DARK (cta-banner-dark per DESIGN.md)                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 px-6 max-w-[1280px] mx-auto">
        <div className="cta-banner-dark text-center relative overflow-hidden flex flex-col items-center justify-center">
          
          {/* Subtle yellow highlight ring in corner */}
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-[#ffd02f]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-[#4262ff]/10 blur-3xl pointer-events-none" />

          <span className="bg-[#ffd02f] text-[#1c1c1e] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            Instant Free Access
          </span>

          <h2 className="font-display-lg text-white mb-6 text-balance max-w-2xl">
            Get great done with AI Resume Architect today.
          </h2>

          <p className="font-subtitle text-[#a5a8b5] max-w-xl mb-10 text-pretty">
            Build your ATS-optimized resume in minutes, test keyword coverage, and download your free recruiter-ready PDF.
          </p>

          <Button asChild size="lg" className="btn-miro-on-dark h-[50px] px-10 text-[15px]">
            <Link to="/builder">
              Get started free
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
