import * as React from 'react';
import { MessageSquareQuote, SlidersHorizontal, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const principles = [
  {
    number: '01',
    icon: <MessageSquareQuote className="size-5 text-[#1c1c1e]" aria-hidden="true" />,
    title: 'Your voice',
    body: 'AI helps you articulate your experience without making you sound like everyone else. Curio refines your phrasing while keeping your career story unmistakably yours.',
    colorClass: 'bg-[#fff4c4] text-[#746019] border border-[#ffd02f]/40',
  },
  {
    number: '02',
    icon: <SlidersHorizontal className="size-5 text-[#187574]" aria-hidden="true" />,
    title: 'Your control',
    body: 'Every section, sentence, layout, and detail remains fully editable. Drag to reorder, switch designs live, or fine-tune typography—AI assists, you decide.',
    colorClass: 'bg-[#c3faf5] text-[#187574] border border-[#0fbcb0]/40',
  },
  {
    number: '03',
    icon: <Sparkles className="size-5 text-[#600000]" aria-hidden="true" />,
    title: 'Your clarity',
    body: 'Communicate your value without wrestling with fragile formatting. Live ATS audits and clean vector PDFs ensure both automated scanners and recruiters read your work effortlessly.',
    colorClass: 'bg-[#ffc6c6] text-[#600000] border border-[#ff9999]/40',
  },
  {
    number: '04',
    icon: <ShieldCheck className="size-5 text-[#1c1c1e]" aria-hidden="true" />,
    title: 'Your confidence',
    body: 'Updating your resume shouldn’t feel intimidating or gated behind paywalls. Your drafts stay private in your browser, with zero sign-up barriers and free access for every candidate.',
    colorClass: 'bg-[#fde0f0] text-[#1c1c1e] border border-[#ffd8f4]/60',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#141416] text-[#1c1c1e] dark:text-white transition-colors">
      
      {/* Header */}
      <div className="w-full text-center py-16 md:py-20 px-6 max-w-[1280px] mx-auto">
        <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-4 py-1.5 mb-4 inline-block">
          ABOUT CURIO
        </span>
        <h1 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
          Your career, clearly expressed.
        </h1>
        <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5] max-w-lg mx-auto">
          A smarter way to build a resume that represents you.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="w-full max-w-3xl mx-auto px-6 pb-24">
        
        <div className="space-y-5 text-sm text-[#555a6a] dark:text-[#a5a8b5] leading-relaxed mb-16 bg-[#f7f8fa] dark:bg-[#16161a] p-8 rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34]">
          <p className="text-base font-medium text-[#1c1c1e] dark:text-white">
            Your experience is more than a list of jobs, skills, and qualifications. It&rsquo;s your story.
          </p>
          <p>
            <strong className="text-[#1c1c1e] dark:text-white font-semibold">Curio</strong>—created by{' '}
            <a
              href="https://www.linkedin.com/in/alihashmi2288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4262ff] font-semibold hover:underline"
            >
              Syed Ali Hashmi
            </a>{' '}
            —helps you tell that story clearly. Build your resume from scratch, use AI Assistance to refine your writing, customize every detail, and export a professional document that reflects who you are and where you want to go.
          </p>
          <p>
            Most people have valuable experience but struggle to communicate it cleanly to both Applicant Tracking Systems and busy hiring managers. Curio gives you a calm, responsive resume workspace so you spend less time fighting formatting and more time landing opportunities.
          </p>
          <p className="font-semibold text-[#1c1c1e] dark:text-white">
            AI helps you create. You decide what represents you.
          </p>
        </div>

        {/* Core Product Philosophy */}
        <div className="mb-8 text-center sm:text-left">
          <span className="bg-[#fff8e0] text-[#746019] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Product Philosophy
          </span>
          <h2 className="font-heading-2 text-[#1c1c1e] dark:text-white">What Curio stands for</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {principles.map((p) => (
            <div key={p.title} className={`p-6 rounded-2xl ${p.colorClass} transition-transform duration-200 hover:-translate-y-0.5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white/75 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <h3 className="text-base font-bold">{p.title}</h3>
                </div>
                <span className="text-xs font-bold tracking-widest opacity-60 tabular-nums">
                  {p.number}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{p.body}</p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="p-10 rounded-2xl bg-[#1c1c1e] text-white text-center flex flex-col items-center">
          <h3 className="text-xl font-bold mb-2">Ready to create your resume?</h3>
          <p className="text-xs text-[#a5a8b5] max-w-sm mb-6">
            AI-assisted. Fully editable. Made to represent you—no sign-up required.
          </p>
          <Button asChild className="btn-miro-on-dark px-8">
            <Link to="/builder">
              Create my resume <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;