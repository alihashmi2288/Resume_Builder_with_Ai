import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Key, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { ApiKeyDialog } from '../ApiKeyDialog';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = React.useState(false);
  const [showPromo, setShowPromo] = React.useState(true);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 px-1 text-[14px] font-medium transition-colors ${
      isActive
        ? 'text-[#1c1c1e] dark:text-white font-semibold'
        : 'text-[#555a6a] dark:text-[#a5a8b5] hover:text-[#1c1c1e] dark:hover:text-white'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="sticky top-0 z-50 w-full no-print">
      {/* Top Promo Banner per DESIGN.md (promo-banner) */}
      {showPromo && (
        <div className="bg-[#1c1c1e] text-white py-2 px-4 text-[13px] md:text-[14px] font-medium flex items-center justify-center gap-3 border-b border-[#2c2c34] relative">
          <span className="bg-[#ffd02f] text-[#1c1c1e] text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
            NEW
          </span>
          <span className="truncate">
            AI Workflows 2.0 is live — Generate ATS-optimized resumes with real-time scoring.
          </span>
          <Link
            to="/builder"
            className="hidden sm:inline-flex items-center gap-1 text-[#ffd02f] hover:underline font-semibold text-xs ml-1"
          >
            Try Free <ArrowRight className="size-3" />
          </Link>
          <button
            onClick={() => setShowPromo(false)}
            aria-label="Close promotion banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a5a8b5] hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Sticky Navbar per DESIGN.md */}
      <header className="w-full border-b border-[#e0e2e8] dark:border-[#2c2c34] bg-[#ffffff] dark:bg-[#141416] transition-colors">
        <div className="max-w-[1280px] mx-auto flex h-[64px] items-center justify-between px-4 sm:px-6">
          {/* Brand Logo with Miro canary-yellow mark */}
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              onClick={closeMenu}
            >
              {/* Signature Canary-Yellow Mark ({colors.brand-yellow}) */}
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#ffd02f] shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 fill-[#1c1c1e]"
                  aria-hidden="true"
                >
                  {/* Miro-inspired geometric diagonal visual slats */}
                  <path d="M4 18V6l4 2.5v7L4 18zm5.5 0V7l4 2v6.5l-4 2.5zm5.5 0V8.5l4 1.5v5.5l-4 2.5z" />
                </svg>
              </div>
              <span className="font-medium text-[18px] tracking-tight text-[#1c1c1e] dark:text-white">
                AI Resume <span className="text-[#6b6f7e] dark:text-[#a5a8b5] font-normal">Architect</span>
              </span>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink to="/" className={navLinkClass}>Overview</NavLink>
              <NavLink to="/builder" className={navLinkClass}>Builder</NavLink>
              <NavLink to="/templates" className={navLinkClass}>Templates</NavLink>
              <NavLink to="/cover-letter" className={navLinkClass}>Cover Letter</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </nav>
          </div>

          {/* Right-side Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsKeyDialogOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c7cad5] dark:border-[#3b3b45] text-xs font-medium text-[#1c1c1e] dark:text-white hover:bg-[#f7f8fa] dark:hover:bg-[#242428] transition-colors"
              title="Configure Gemini API Key"
              aria-label="API Key Settings"
            >
              <Key className="size-3.5 text-[#746019] dark:text-[#ffd02f]" aria-hidden="true" />
              <span>API Key</span>
            </button>

            {/* Miro Black Pill Primary CTA */}
            <Button
              asChild
              className="hidden md:inline-flex btn-miro-primary text-[14px] font-medium"
            >
              <Link to="/builder">Get started free</Link>
            </Button>

            <ThemeToggle />

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex items-center justify-center size-9 rounded-full border border-[#e0e2e8] dark:border-[#2c2c34] text-[#1c1c1e] dark:text-white hover:bg-[#f7f8fa] dark:hover:bg-[#242428]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <ApiKeyDialog isOpen={isKeyDialogOpen} onClose={() => setIsKeyDialogOpen(false)} />

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#e0e2e8] dark:border-[#2c2c34] bg-white dark:bg-[#141416] px-4 py-6 shadow-lg">
            <nav className="flex flex-col gap-4">
              <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Overview</NavLink>
              <NavLink to="/builder" className={navLinkClass} onClick={closeMenu}>Builder</NavLink>
              <NavLink to="/templates" className={navLinkClass} onClick={closeMenu}>Templates</NavLink>
              <NavLink to="/cover-letter" className={navLinkClass} onClick={closeMenu}>Cover Letter</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>Contact</NavLink>

              <div className="pt-4 border-t border-[#e0e2e8] dark:border-[#2c2c34] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { setIsKeyDialogOpen(true); closeMenu(); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#c7cad5] dark:border-[#3b3b45] text-sm font-medium"
                >
                  <Key className="size-4 text-[#ffd02f]" />
                  <span>Configure Gemini API Key</span>
                </button>
                <Button asChild className="btn-miro-primary w-full py-3">
                  <Link to="/builder" onClick={closeMenu}>Get started free</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};
