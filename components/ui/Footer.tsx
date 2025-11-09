import * as React from 'react';
import { Linkedin, Github, Instagram } from 'lucide-react';

const SocialIconLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted-foreground hover:text-primary transition-colors">
        {icon}
    </a>
);


export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built by Syed Ali Hashmi.
        </p>
        <div className="flex items-center gap-4">
            <SocialIconLink href="https://www.linkedin.com/in/alihashmi2288" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
            <SocialIconLink href="https://www.github.com/alihashmi2288" icon={<Github className="w-5 h-5" />} label="GitHub" />
            <SocialIconLink href="https://www.instagram.com/hashmi.ali_1/" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
        </div>
      </div>
    </footer>
  );
};