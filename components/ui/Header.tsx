import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { CurioLogo } from './CurioLogo';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showPromo, setShowPromo] = React.useState(true);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 px-1 text-[14px] font-medium whitespace-nowrap transition-colors ${
      isActive
        ? 'text-[#1c1c1e] dark:text-white font-semibold'
        : 'text-[#555a6a] dark:text-[#a5a8b5] hover:text-[#1c1c1e] dark:hover:text-white'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="sticky top-0 z-50 w-full no-print">
      {/* Top Promo Banner per DESIGN.md (promo-banner) */}
      {showPromo && (
        <div className="bg-[#1c1c1e] text-white py-2 pl-4 pr-10 sm:px-10 text-[13px] md:text-[14px] font-medium flex items-center justify-center gap-2.5 sm:gap-3 border-b border-[#2c2c34] relative">
          <span className="shrink-0 bg-[#ffd02f] text-[#1c1c1e] text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
            NEW
          </span>
          <span className="truncate">
            Curio AI Assistance is live — Write with AI, import your resume &amp; audit ATS match free.
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
        <div className="max-w-[1280px] mx-auto flex lg:grid lg:grid-cols-[1fr_auto_1fr] h-[64px] items-center justify-between lg:gap-4 px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center lg:justify-self-start lg:shrink-0">
            <NavLink
              to="/"
              className="flex items-center transition-opacity hover:opacity-90"
              onClick={closeMenu}
              aria-label="Curio Home"
            >
              <CurioLogo size="md" />
            </NavLink>
          </div>

          {/* Centered Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-7 lg:justify-self-center">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/builder" className={navLinkClass}>Builder</NavLink>
            <NavLink to="/templates" className={navLinkClass}>Templates</NavLink>
            <NavLink to="/cover-letter" className={navLinkClass}>Cover Letter</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>

          {/* Right-side Action CTAs */}
          <div className="flex items-center gap-2.5 lg:justify-self-end lg:shrink-0">
            {/* Black Pill Primary CTA */}
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

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#e0e2e8] dark:border-[#2c2c34] bg-white dark:bg-[#141416] px-4 py-6 shadow-lg">
            <nav className="flex flex-col gap-4">
              <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/builder" className={navLinkClass} onClick={closeMenu}>Builder</NavLink>
              <NavLink to="/templates" className={navLinkClass} onClick={closeMenu}>Templates</NavLink>
              <NavLink to="/cover-letter" className={navLinkClass} onClick={closeMenu}>Cover Letter</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>Contact</NavLink>

              <div className="pt-4 border-t border-[#e0e2e8] dark:border-[#2c2c34] flex flex-col gap-3">
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
