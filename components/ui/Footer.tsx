import * as React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Instagram, Star, Award, Smartphone, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1c1e] text-white border-t border-[#2c2c34] mt-auto no-print">
      {/* 6-Column Links Grid per DESIGN.md (footer-region) */}
      <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        
        {/* Col 1: Brand & Badge */}
        <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#ffd02f]">
              <svg viewBox="0 0 24 24" className="size-4 fill-[#1c1c1e]" aria-hidden="true">
                <path d="M4 18V6l4 2.5v7L4 18zm5.5 0V7l4 2v6.5l-4 2.5zm5.5 0V8.5l4 1.5v5.5l-4 2.5z" />
              </svg>
            </div>
            <span className="font-medium text-lg tracking-tight text-white">
              AI Resume Architect
            </span>
          </Link>
          <p className="text-sm text-[#a5a8b5] leading-relaxed max-w-sm">
            The AI-powered visual workspace for careers. Build ATS-optimized resumes, write tailored cover letters, and export recruiter-ready PDFs in seconds.
          </p>

          {/* Capterra & G2 Ratings Badge per DESIGN.md (capterra-badge) */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="bg-[#2c2c34] border border-[#3b3b45] rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-[#a5a8b5]">
              <div className="flex text-[#ffd02f]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3 fill-[#ffd02f]" />
                ))}
              </div>
              <span className="font-semibold text-white">4.9/5</span>
              <span>on Capterra</span>
            </div>

            <div className="bg-[#2c2c34] border border-[#3b3b45] rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs text-[#a5a8b5]">
              <Award className="size-3.5 text-[#00b473]" />
              <span className="text-white font-medium">100% Free & Private</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 mt-2">
            <a
              href="https://www.linkedin.com/in/alihashmi2288"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="size-8 rounded-full bg-[#2c2c34] hover:bg-[#ffd02f] hover:text-[#1c1c1e] text-[#a5a8b5] flex items-center justify-center transition-colors"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href="https://www.github.com/alihashmi2288"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="size-8 rounded-full bg-[#2c2c34] hover:bg-[#ffd02f] hover:text-[#1c1c1e] text-[#a5a8b5] flex items-center justify-center transition-colors"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/hashmi.ali_1/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="size-8 rounded-full bg-[#2c2c34] hover:bg-[#ffd02f] hover:text-[#1c1c1e] text-[#a5a8b5] flex items-center justify-center transition-colors"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Product */}
        <div className="flex flex-col gap-3">
          <p className="text-[16px] font-medium text-white mb-1">Product</p>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link to="/builder" className="text-[#a5a8b5] hover:text-white transition-colors">Resume Builder</Link>
            <Link to="/cover-letter" className="text-[#a5a8b5] hover:text-white transition-colors">Cover Letter AI</Link>
            <Link to="/builder?tab=audit" className="text-[#a5a8b5] hover:text-white transition-colors">ATS Scanner</Link>
            <Link to="/templates" className="text-[#a5a8b5] hover:text-white transition-colors">Template Gallery</Link>
            <Link to="/builder" className="text-[#a5a8b5] hover:text-white transition-colors">Visual Board</Link>
          </nav>
        </div>

        {/* Col 3: Templates */}
        <div className="flex flex-col gap-3">
          <p className="text-[16px] font-medium text-white mb-1">Templates</p>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link to="/builder?template=classic" className="text-[#a5a8b5] hover:text-white transition-colors">Classic (ATS)</Link>
            <Link to="/builder?template=modern" className="text-[#a5a8b5] hover:text-white transition-colors">Modern Executive</Link>
            <Link to="/builder?template=technical" className="text-[#a5a8b5] hover:text-white transition-colors">Software Engineer</Link>
            <Link to="/builder?template=creative" className="text-[#a5a8b5] hover:text-white transition-colors">Creative Portfolio</Link>
            <Link to="/builder?template=minimalist" className="text-[#a5a8b5] hover:text-white transition-colors">Minimalist Clean</Link>
            <Link to="/templates" className="text-[#ffd02f] hover:underline transition-colors text-xs font-semibold">View All 9 →</Link>
          </nav>
        </div>

        {/* Col 4: Solutions */}
        <div className="flex flex-col gap-3">
          <p className="text-[16px] font-medium text-white mb-1">Solutions</p>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link to="/templates?cat=tech" className="text-[#a5a8b5] hover:text-white transition-colors">Software Engineers</Link>
            <Link to="/templates?cat=executive" className="text-[#a5a8b5] hover:text-white transition-colors">Executives & Leaders</Link>
            <Link to="/templates?cat=ats" className="text-[#a5a8b5] hover:text-white transition-colors">Recent Graduates</Link>
            <Link to="/cover-letter" className="text-[#a5a8b5] hover:text-white transition-colors">Career Changers</Link>
            <Link to="/templates?cat=creative" className="text-[#a5a8b5] hover:text-white transition-colors">Product & Design</Link>
          </nav>
        </div>

        {/* Col 5: Company & Plans */}
        <div className="flex flex-col gap-3">
          <p className="text-[16px] font-medium text-white mb-1">Company</p>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link to="/about" className="text-[#a5a8b5] hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="text-[#a5a8b5] hover:text-white transition-colors">Contact Support</Link>
            <a href="https://github.com/alihashmi2288" target="_blank" rel="noopener noreferrer" className="text-[#a5a8b5] hover:text-white transition-colors">GitHub Repository</a>
            <span className="text-[#ffd02f] text-xs font-semibold inline-flex items-center gap-1.5 mt-1">
              <span className="size-1.5 rounded-full bg-[#00b473]"></span> Gemini 2.5 API
            </span>
          </nav>
        </div>

      </div>

      {/* Bottom Bar per DESIGN.md */}
      <div className="border-t border-[#2c2c34] bg-[#141416]">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a5a8b5]">
          <div className="flex items-center gap-2">
            <span>&copy; {year} AI Resume Architect. Built with Miro design system by</span>
            <a
              href="https://www.linkedin.com/in/alihashmi2288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffd02f] hover:underline font-medium"
            >
              Syed Ali Hashmi
            </a>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Globe className="size-3.5" /> 100% Client-Side & Private
            </span>
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
