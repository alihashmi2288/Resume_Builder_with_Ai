import * as React from 'react';
import { Accessibility, ShieldCheck, Feather } from 'lucide-react';

const BeliefItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">{title}</h4>
        <p className="text-muted-foreground text-sm mt-1">{children}</p>
      </div>
    </div>
  );
};


const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="relative bg-card border rounded-xl shadow-lg overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[150%] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl opacity-50 dark:opacity-30 -z-10"></div>
        
        <div className="p-8 md:p-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-foreground/70 text-transparent bg-clip-text">
              About AI Resume Architect
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Empowering job seekers with cutting-edge AI technology.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6 text-foreground/90">
            <p>
              AI Resume Architect was created by Syed Ali Hashmi to simplify and enhance the resume-building process. In today's competitive job market, a well-crafted resume is more important than ever. This tool leverages the power of Google's Gemini AI to help you create a professional, impactful resume that stands out to recruiters.
            </p>
            <p>
              Our goal is to provide an intuitive, user-friendly platform that combines modern design with powerful AI features. From generating a compelling summary to refining your work experience, AI Resume Architect is your personal career assistant.
            </p>
            
            <div className="pt-8">
              <h3 className="text-2xl font-semibold text-center mb-8">Core Beliefs</h3>
              <div className="space-y-8">
                <BeliefItem
                  icon={<Accessibility className="w-5 h-5 text-primary" />}
                  title="Accessibility"
                >
                  Everyone deserves access to tools that can help them succeed professionally. That's why the core features are built on the free tier of the Gemini API.
                </BeliefItem>

                <BeliefItem
                  icon={<ShieldCheck className="w-5 h-5 text-primary" />}
                  title="Privacy"
                >
                  Your data is yours. All resume information and your API key are stored locally in your browser and are never sent to our servers.
                </BeliefItem>

                <BeliefItem
                  icon={<Feather className="w-5 h-5 text-primary" />}
                  title="Simplicity"
                >
                  Building a resume shouldn't be complicated. We focus on a clean, clutter-free interface that lets you focus on what matters: your content.
                </BeliefItem>
              </div>
            </div>

            <p className="text-center pt-8">
              Thank you for using AI Resume Architect. We hope it helps you land your dream job!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;