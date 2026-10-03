import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Bot, Palette, FileText, SearchCheck, FileSignature, ChevronRight, Check } from 'lucide-react';
import { ResumePreview } from '../components/builder/ResumePreview';
import type { ResumeData, TemplateId } from '../types';

/* ─── Sample data for live template previews ─────────────────────────── */
const sampleResumeData: ResumeData = {
  name: 'Syed Ali',
  email: 'syed@email.com',
  phone: '555-123-4567',
  website: 'syedali.dev',
  summary: 'Software Engineer with 3+ years of experience building web applications.',
  skills: 'JavaScript, React, Node.js, Python',
  education: [{ id: 'edu-1', university: 'Karachi University', degree: 'B.S. Computer Science', startDate: '2018', endDate: '2022' }],
  experience: [
    { id: 'exp-1', company: 'Tech Corp', title: 'Software Engineer', startDate: '2022', endDate: 'Present', description: '• Built web applications\n• Collaborated with team' },
    { id: 'exp-2', company: 'StartupXYZ', title: 'Junior Developer', startDate: '2021', endDate: '2022', description: '• Developed mobile apps\n• Reduced load time 40%' },
  ],
  projects: [
    { id: 'proj-1', name: 'Portfolio Site', description: 'Personal website built with React.', url: '' },
    { id: 'proj-2', name: 'Task Manager', description: 'Todo app with React and Node.js.', url: '' },
  ],
};

const templates: { id: TemplateId; name: string }[] = [
  { id: 'classic',    name: 'Classic'    },
  { id: 'modern',     name: 'Modern'     },
  { id: 'creative',   name: 'Creative'   },
  { id: 'technical',  name: 'Technical'  },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'academic',   name: 'Academic'   },
  { id: 'executive',  name: 'Executive'  },
  { id: 'infographic',name: 'Infographic'},
  { id: 'startup',    name: 'Startup'    },
];

/* ─── useReveal: IntersectionObserver scroll-reveal ─────────────────── */
function useReveal() {
  React.useEffect(() => {
    const targets = document.querySelectorAll('.reveal-hidden');
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}

/* ─── Page ───────────────────────────────────────────────────────────── */
const HomePage: React.FC = () => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = React.useState(0);
  const [showcaseIndex, setShowcaseIndex] = React.useState(0);
  useReveal();

  React.useEffect(() => {
    const t1 = setInterval(() => setCurrentTemplateIndex(p => (p + 1) % templates.length), 2400);
    return () => clearInterval(t1);
  }, []);

  React.useEffect(() => {
    const pairs = Math.ceil(templates.length / 3);
    const t2 = setInterval(() => setShowcaseIndex(p => (p + 1) % pairs), 4500);
    return () => clearInterval(t2);
  }, []);

  const showcasePairs = React.useMemo(() => {
    const chunks: (typeof templates)[] = [];
    for (let i = 0; i < templates.length; i += 3) {
      chunks.push(templates.slice(i, i + 3));
    }
    return chunks;
  }, []);

  return (
    <div className="flex flex-col items-center">

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.055) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.055) 1px, transparent 1px)`,
            backgroundSize: '52px 52px',
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 520, height: 520, background: 'hsl(var(--primary) / 0.12)', filter: 'blur(90px)', top: -180, right: -120 }} />
        <div className="absolute pointer-events-none rounded-full animate-orb-drift"
          style={{ width: 340, height: 340, background: 'hsl(var(--ai-accent) / 0.09)', filter: 'blur(80px)', bottom: 20, left: -80 }} />
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />

        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-16 items-center">

            {/* Copy — max 4 text elements: badge, headline, subtext, CTAs */}
            <div className="text-center lg:text-left">
              {/* Element 1: Badge / eyebrow #1 */}
              <div className="animate-float-up inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary mb-7">
                <span className="size-1.5 rounded-full bg-primary animate-pulse-ring" />
                Powered by Google Gemini
              </div>
 
              {/* Element 2: Headline */}
              <h1 className="animate-float-up delay-100 font-display text-[3rem] md:text-[4.25rem] lg:text-[4.75rem] font-bold leading-[1.0] tracking-tight text-foreground text-balance">
                Build resumes<br />
                <em className="not-italic text-shimmer">that get hired.</em>
              </h1>
 
              {/* Element 3: Subtext */}
              <p className="animate-float-up delay-200 mt-6 text-base md:text-lg text-muted-foreground max-w-[480px] mx-auto lg:mx-0 leading-relaxed text-pretty">
                AI-generated content, ATS scoring, 9 premium templates, and a pixel-perfect PDF.
              </p>
 
              {/* Element 4: CTAs */}
              <div className="animate-float-up delay-300 mt-9 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="btn-primary-glow px-8 h-11">
                  <Link to="/builder">
                    Build my resume
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-6 h-11">
                  <Link to="/templates">
                    Browse templates
                    <ChevronRight className="ml-1.5 size-4 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Animated template stack */}
            <div className="hidden lg:flex justify-center items-center relative animate-float-up delay-400" aria-hidden="true">
              <div className="relative w-full" style={{ height: 500 }}>
                {templates.map((template, index) => {
                  const offset = (index - currentTemplateIndex + templates.length) % templates.length;
                  const isActive = offset === 0;
                  const isBehind = offset === 1 || offset === templates.length - 1;
                  return (
                    <div
                      key={template.id}
                      className="absolute transition-all duration-700 ease-in-out"
                      style={{
                        left: isActive ? '50%' : isBehind ? (offset === 1 ? '65%' : '35%') : '50%',
                        top: isActive ? '0' : isBehind ? '32px' : '64px',
                        transform: `translateX(-50%) rotate(${isActive ? 0 : offset === 1 ? 6 : -6}deg)`,
                        opacity: isActive ? 1 : isBehind ? 0.45 : 0,
                        zIndex: isActive ? 20 : isBehind ? 10 : 1,
                        width: '220px',
                      }}
                    >
                      <div className={`overflow-hidden rounded-xl transition-all duration-700 flex flex-col bg-card ${
                        isActive ? 'shadow-2xl shadow-primary/20 ring-1 ring-primary/25' : 'shadow-lg'
                      }`} style={{ height: '290px' }}>
                        <div className="window-chrome py-1.5 px-2.5">
                          <div className="window-dot bg-rose-500/80" style={{ width: '7px', height: '7px' }}></div>
                          <div className="window-dot bg-amber-500/80" style={{ width: '7px', height: '7px' }}></div>
                          <div className="window-dot bg-emerald-500/80" style={{ width: '7px', height: '7px' }}></div>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                          <div className="scale-[0.28] origin-top-left pointer-events-none" style={{ width: '357%', height: '357%' }}>
                            <ResumePreview data={sampleResumeData} template={template.id} />
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="mt-3 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {template.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stat strip — moved below hero stack, separated by border */}
          <div className="animate-float-up delay-500 mt-12 flex items-center gap-8 md:gap-12 justify-center lg:justify-start border-t border-border/30 pt-7">
            {[['9', 'Templates'], ['ATS', 'Optimised'], ['Free', 'No signup']].map(([n, l]) => (
              <div key={l} className="text-center lg:text-left">
                <p className="text-xl font-bold text-foreground font-display tabular-nums">{n}</p>
                <p className="text-[11px] text-muted-foreground tracking-wide mt-0.5 text-pretty">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — Bento Grid (4 cells, no eyebrow) */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <h2 className="reveal-hidden font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
              Everything you need to stand out
            </h2>
            <p className="reveal-hidden delay-100 mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed text-pretty">
              Intelligent tools that work together — from blank page to hired.
            </p>
          </div>

          {/* Bento: large (2col) + 2 medium + 1 accent = 4 cells */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large tile — spans 2 cols on lg */}
            <div className="reveal-hidden lg:col-span-2 group relative flex flex-col gap-4 rounded-2xl glass-card p-8 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/12">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 10% 10%, hsl(var(--primary) / 0.08) 0%, transparent 65%)' }} />
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-primary/10 opacity-30 group-hover:opacity-85 transition-opacity duration-300 rounded-l-2xl" />
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bot className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 leading-snug text-balance">AI Content Generation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-sans text-pretty">
                  Generate ATS-tuned summaries, bullet points, and skill suggestions in one click. Powered by Google Gemini.
                </p>
              </div>
              <span className="self-start text-[9px] font-bold uppercase tracking-[0.15em] text-primary border border-primary/20 bg-primary/6 rounded-full px-2.5 py-1">Gemini AI</span>
            </div>

            {/* Medium tile */}
            <div className="reveal-hidden delay-100 group relative flex flex-col gap-4 rounded-2xl glass-card p-7 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/12">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 10% 10%, hsl(var(--primary) / 0.08) 0%, transparent 65%)' }} />
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-primary/10 opacity-30 group-hover:opacity-85 transition-opacity duration-300 rounded-l-2xl" />
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Palette className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1.5 leading-snug text-balance">9 Premium Templates</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans text-pretty">Classic to Creative — a design for every industry.</p>
              </div>
              <span className="self-start text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground border border-border/50 rounded-full px-2.5 py-1">Fully customisable</span>
            </div>

            {/* Medium tile */}
            <div className="reveal-hidden delay-200 group relative flex flex-col gap-4 rounded-2xl glass-card p-7 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/12">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 10% 10%, hsl(var(--primary) / 0.08) 0%, transparent 65%)' }} />
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-primary/10 opacity-30 group-hover:opacity-85 transition-opacity duration-300 rounded-l-2xl" />
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <SearchCheck className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1.5 leading-snug text-balance">ATS Score and Audit</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans text-pretty">Live score and keyword checklist so your resume passes filters.</p>
              </div>
              <span className="self-start text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground border border-border/50 rounded-full px-2.5 py-1">Beat the bots</span>
            </div>

            {/* Accent tile — tinted glass-card for visual diversity */}
            <div className="reveal-hidden delay-300 group relative flex flex-col gap-4 rounded-2xl p-7 overflow-hidden glass-card hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/12"
              style={{ background: 'hsl(var(--primary) / 0.12)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 80% 80%, hsl(var(--primary) / 0.1) 0%, transparent 60%)' }} />
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1.5 leading-snug text-balance">Selectable PDF Export</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">Clean, fully text-selectable PDF — no image rasterisation.</p>
              </div>
              <span className="self-start text-[9px] font-bold uppercase tracking-[0.15em] text-primary border border-primary/25 rounded-full px-2.5 py-1">ATS-safe format</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — Numbered watermark rail (no eyebrow) */}
      <section className="w-full py-20 md:py-28 border-t border-border/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="reveal-hidden font-display text-3xl md:text-4xl font-bold text-foreground mb-16 text-center text-balance">
            Three steps to your next job
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { n: '01', title: 'Pick a template', body: 'Choose from 9 professionally designed layouts suited to any role or industry.' },
              { n: '02', title: 'Fill in your details', body: 'The AI generates and enhances every section as you type — no blank-page dread.' },
              { n: '03', title: 'Download your PDF', body: 'Export a clean, recruiter-ready PDF with fully selectable text in one click.' },
            ].map((step, i) => (
              <div key={step.n} className={`reveal-hidden delay-${(i + 1) * 100} relative`}>
                <p className="font-display text-[5rem] font-bold leading-none text-foreground/5 select-none mb-2 -ml-1 tabular-nums" aria-hidden="true">
                  {step.n}
                </p>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/8 text-xs font-bold text-primary tabular-nums">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 leading-snug text-balance">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE — eyebrow #2 */}
      <section className="w-full py-20 md:py-28 border-t border-border/30">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="reveal-hidden text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Templates</p>
          <h2 className="reveal-hidden delay-100 font-display text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Find your perfect style
          </h2>
          <p className="reveal-hidden delay-200 text-sm text-muted-foreground mb-12 text-pretty">9 professionally designed layouts — one is already yours.</p>

          <div className="relative" style={{ minHeight: 360 }}>
            {showcasePairs.map((chunk, chunkIndex) => (
              <div
                key={chunkIndex}
                className="transition-all duration-700"
                style={{
                  opacity: chunkIndex === showcaseIndex ? 1 : 0,
                  position: chunkIndex === showcaseIndex ? 'relative' : 'absolute',
                  inset: 0,
                  pointerEvents: chunkIndex === showcaseIndex ? 'auto' : 'none',
                }}
              >
                <div className={`grid gap-5 ${chunk.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'}`}>
                  {chunk.map((template) => (
                    <Link key={template.id} to={`/builder?template=${template.id}`} className="block group relative" aria-label={`Use ${template.name} template`}>
                      <div className="rounded-2xl border border-border/40 bg-card overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/15 group-hover:-translate-y-1.5 flex flex-col relative">
                        
                        {/* macOS style Window Header */}
                        <div className="window-chrome" aria-hidden="true">
                          <div className="window-dot bg-rose-500/80"></div>
                          <div className="window-dot bg-amber-500/80"></div>
                          <div className="window-dot bg-emerald-500/80"></div>
                          <span className="text-[10px] text-muted-foreground font-mono ml-2 opacity-60 lowercase">{template.id}.pdf</span>
                        </div>

                        <div className="overflow-hidden pointer-events-none relative" style={{ aspectRatio: '8.5/10' }} aria-hidden="true">
                          <div className="origin-top-left" style={{ transform: 'scale(0.36)', width: '278%', height: '278%' }}>
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
                      <p className="mt-3 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-widest text-center">
                        {template.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-8">
            {showcasePairs.map((_, i) => (
              <button
                key={i}
                id={`template-dot-${i}`}
                onClick={() => setShowcaseIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === showcaseIndex ? '24px' : '8px',
                  height: '8px',
                  background: i === showcaseIndex ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)',
                }}
                aria-label={`Template group ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/templates">
                Browse templates
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* COVER LETTER — Asymmetric inverted strip (no eyebrow, no card) */}
      <section className="w-full py-16 border-t border-border/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div
            className="reveal-hidden rounded-2xl overflow-hidden grid md:grid-cols-[1fr_auto]"
            style={{ background: 'hsl(var(--primary) / 0.07)', border: '1px solid hsl(var(--primary) / 0.15)' }}
          >
            <div className="p-10 md:p-14 flex flex-col justify-center gap-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary flex-shrink-0">
                  <FileSignature className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight text-balance">
                  Go beyond the resume
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md text-pretty">
                Our AI writes a tailored cover letter using your resume and the job description — ready in seconds, no boilerplate.
              </p>
              <div>
                <Button asChild className="btn-primary-glow">
                  <Link to="/cover-letter">
                    Generate cover letter
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center p-12 gap-2 min-w-[200px]"
              style={{ borderLeft: '1px solid hsl(var(--primary) / 0.12)' }}
            >
              <p className="font-display text-6xl font-bold text-primary leading-none tabular-nums">AI</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest text-center text-pretty">Cover letters<br />in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA — eyebrow #3 */}
      <section className="w-full py-20 md:py-28 border-t border-border/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="reveal-hidden relative rounded-2xl border border-primary/20 bg-card overflow-hidden p-12 md:p-16">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 65%)' }} />
            <div className="absolute pointer-events-none rounded-full"
              style={{ width: 300, height: 300, background: 'hsl(var(--primary) / 0.06)', filter: 'blur(60px)', top: -100, right: -80 }} />
            <div className="absolute pointer-events-none rounded-full"
              style={{ width: 220, height: 220, background: 'hsl(var(--ai-accent) / 0.06)', filter: 'blur(50px)', bottom: -60, left: -60 }} />
            <div className="relative">
              {/* Eyebrow #3 — final allowed on page */}
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Free to use</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight text-balance">
                Ready to land<br />
                <em className="not-italic text-shimmer">your dream job?</em>
              </h2>
              <p className="text-muted-foreground text-sm mb-9 max-w-xs mx-auto leading-relaxed text-pretty">
                No signup required. Start building your resume right now.
              </p>
              <ul className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-9 text-xs text-muted-foreground">
                {['9 templates included', 'ATS score included', 'PDF export included'].map(item => (
                  <li key={item} className="flex items-center gap-1.5 text-pretty">
                    <Check className="size-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="btn-primary-glow px-10">
                <Link to="/builder">
                  Build my resume
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT — Inline strip (no card, no eyebrow) */}
      <section className="w-full py-10 border-t border-border/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-pretty">
              Have questions? We are here to help.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/contact">
                Contact us
                <ChevronRight className="ml-1.5 size-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
