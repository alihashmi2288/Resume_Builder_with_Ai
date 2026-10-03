import * as React from 'react';
import { Accessibility, ShieldCheck, Feather } from 'lucide-react';

const beliefs = [
  {
    icon: <Accessibility className="size-5 text-primary" aria-hidden="true" />,
    title: 'Accessibility',
    body: 'Everyone deserves access to tools that can help them succeed professionally. That’s why core features are built on the free tier of the Gemini API.',
  },
  {
    icon: <ShieldCheck className="size-5 text-primary" aria-hidden="true" />,
    title: 'Privacy first',
    body: 'Your data is yours. All resume information and your API key are stored locally in your browser and are never sent to our servers.',
  },
  {
    icon: <Feather className="size-5 text-primary" aria-hidden="true" />,
    title: 'Radical simplicity',
    body: 'Building a resume shouldn’t be complicated. We focus on a clean, clutter-free interface that lets you focus on what matters: your content.',
  },
];

const AboutPage: React.FC = () => {
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
          style={{ width: 360, height: 360, background: 'hsl(var(--primary) / 0.09)', filter: 'blur(80px)', top: -100, left: '60%' }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Our story</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-4 text-balance">
            About AI Resume Architect
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto text-pretty">
            Empowering job seekers with cutting-edge AI technology.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 max-w-3xl pb-20">

        {/* Intro text */}
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed mb-16">
          <p className="text-pretty">
            AI Resume Architect was created by{' '}
            <span className="text-foreground font-medium">Syed Ali Hashmi</span>{' '}
            to simplify and enhance the resume-building process. In today’s competitive job market, a well-crafted resume is more important than ever. This tool leverages the power of Google’s Gemini AI to help you create a professional, impactful resume that stands out to recruiters and passes automated screening systems.
          </p>
          <p className="text-pretty">
            The goal is to provide an intuitive, user-friendly platform that combines modern design with powerful AI features. From generating a compelling professional summary to refining work experience bullet points, AI Resume Architect is your personal career assistant.
          </p>
        </div>

        {/* Core beliefs */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Core beliefs</p>
          <h2 className="font-display text-2xl font-normal text-foreground mb-10 text-balance">What we stand for</h2>
        </div>

        <div className="space-y-6">
          {beliefs.map((b, i) => (
            <div key={b.title} className="group flex gap-5 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/25 hover:shadow-md hover:shadow-primary/8 transition-all duration-300">
              <div className="flex-shrink-0 relative">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  {b.icon}
                </div>
                <span className="absolute -top-1 -right-1 text-[9px] font-black text-primary/40 leading-none tabular-nums">0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5 text-balance">{b.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
 
        <p className="text-center text-xs text-muted-foreground mt-12 leading-relaxed text-pretty">
          Thank you for using AI Resume Architect. We hope it helps you land your dream job. 🎯
        </p>
      </div>
    </div>
  );
};

export default AboutPage;