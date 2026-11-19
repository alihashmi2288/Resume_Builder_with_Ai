import * as React from 'react';
import { Accessibility, ShieldCheck, Feather, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const beliefs = [
  {
    icon: <Accessibility className="size-5 text-[#1c1c1e]" aria-hidden="true" />,
    title: 'Accessibility for Everyone',
    body: 'Everyone deserves access to modern career tools. Core resume building, smart import, and AI Assistance run cleanly with zero paywalls or manual API key setup.',
    colorClass: 'bg-[#fff4c4] text-[#746019] border border-[#ffd02f]/40',
  },
  {
    icon: <ShieldCheck className="size-5 text-[#187574]" aria-hidden="true" />,
    title: 'Local Drafts & Secure AI',
    body: 'Your resume profiles stay stored locally in your browser (LocalStorage), while AI parsing and optimization run through secure server-side AI Assistance endpoints.',
    colorClass: 'bg-[#c3faf5] text-[#187574] border border-[#0fbcb0]/40',
  },
  {
    icon: <Feather className="size-5 text-[#600000]" aria-hidden="true" />,
    title: 'Visual Simplicity & Power',
    body: 'Building a resume shouldn’t feel like wrestling with broken Word formatting. Import your existing resume or build from scratch on an intuitive visual canvas.',
    colorClass: 'bg-[#ffc6c6] text-[#600000] border border-[#ff9999]/40',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#141416] text-[#1c1c1e] dark:text-white transition-colors">
      
      {/* Header */}
      <div className="w-full text-center py-16 md:py-20 px-6 max-w-[1280px] mx-auto">
        <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-4 py-1.5 mb-4 inline-block">
          OUR MISSION
        </span>
        <h1 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
          About AI Resume Architect.
        </h1>
        <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5] max-w-md mx-auto">
          Empowering job seekers worldwide with visual design and AI Assistance.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="w-full max-w-3xl mx-auto px-6 pb-24">
        
        <div className="space-y-5 text-sm text-[#555a6a] dark:text-[#a5a8b5] leading-relaxed mb-16 bg-[#f7f8fa] dark:bg-[#16161a] p-8 rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34]">
          <p>
            <strong className="text-[#1c1c1e] dark:text-white font-semibold">AI Resume Architect</strong> was designed and created by{' '}
            <a
              href="https://www.linkedin.com/in/alihashmi2288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4262ff] font-semibold hover:underline"
            >
              Syed Ali Hashmi
            </a>{' '}
            to simplify, accelerate, and elevate how developers, designers, and professionals present their career stories.
          </p>
          <p>
            In today’s fast-moving job market, modern hiring combines automated Applicant Tracking Systems with demanding recruiter expectations. We believe job candidates shouldn’t have to choose between machine-readability and beautiful design.
          </p>
          <p>
            By combining AI Assistance with an intuitive visual canvas, AI Resume Architect acts as your personal career assistant—parsing existing resumes into structured profiles, polishing metrics, auditing keyword compliance, and generating crisp PDFs in seconds.
          </p>
        </div>

        {/* Core Principles */}
        <div className="mb-8 text-center sm:text-left">
          <span className="bg-[#fff8e0] text-[#746019] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Values
          </span>
          <h2 className="font-heading-2 text-[#1c1c1e] dark:text-white">What we stand for</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-16">
          {beliefs.map((b, i) => (
            <div key={b.title} className={`p-6 rounded-2xl ${b.colorClass} transition-transform hover:-translate-y-0.5`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-white/70 flex items-center justify-center">
                  {b.icon}
                </div>
                <h3 className="text-base font-bold">{b.title}</h3>
              </div>
              <p className="text-xs leading-relaxed opacity-90 pl-11">{b.body}</p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="p-10 rounded-2xl bg-[#1c1c1e] text-white text-center flex flex-col items-center">
          <h3 className="text-xl font-bold mb-2">Ready to create your resume?</h3>
          <p className="text-xs text-[#a5a8b5] max-w-sm mb-6">
            Jump into the builder right now. No sign up required, completely private.
          </p>
          <Button asChild className="btn-miro-on-dark px-8">
            <Link to="/builder">
              Start building free <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;