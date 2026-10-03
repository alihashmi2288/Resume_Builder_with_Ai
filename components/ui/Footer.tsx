import * as React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Instagram, Sparkles } from 'lucide-react';

const SocialIconLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all duration-200"
    >
        {icon}
    </a>
);

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand column */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="inline-flex items-center gap-2 group w-fit">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              AI Resume<span className="text-primary"> Architect</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
            Build ATS-ready resumes in minutes with the power of Google Gemini AI.
          </p>
          <div className="flex items-center gap-1 mt-1">
            <SocialIconLink href="https://www.linkedin.com/in/alihashmi2288" icon={<Linkedin className="w-4 h-4" aria-hidden="true" />} label="LinkedIn" />
            <SocialIconLink href="https://www.github.com/alihashmi2288" icon={<Github className="w-4 h-4" aria-hidden="true" />} label="GitHub" />
            <SocialIconLink href="https://www.instagram.com/hashmi.ali_1/" icon={<Instagram className="w-4 h-4" aria-hidden="true" />} label="Instagram" />
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Product</p>
          <nav className="flex flex-col gap-2">
            {[
              { to: '/builder', label: 'Resume Builder' },
              { to: '/templates', label: 'Templates' },
              { to: '/cover-letter', label: 'Cover Letter' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-xs text-muted-foreground hover:text-primary transition-colors">{label}</Link>
            ))}
          </nav>
        </div>

        {/* Company links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Company</p>
          <nav className="flex flex-col gap-2">
            {[
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-xs text-muted-foreground hover:text-primary transition-colors">{label}</Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {year} AI Resume Architect. Built by{' '}
            <a
              href="https://www.linkedin.com/in/alihashmi2288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              Syed Ali Hashmi
            </a>
          </p>
          <p className="text-xs text-muted-foreground">Powered by Google Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};
