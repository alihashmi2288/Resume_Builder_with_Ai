import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from './Button';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `relative py-1.5 text-sm font-medium transition-all duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${
            isActive
                ? 'text-foreground after:scale-x-100'
                : 'text-muted-foreground hover:text-foreground'
        }`;

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    onClick={closeMenu}
                >
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary shadow-glow-primary">
                        <Sparkles className="size-4 text-white" aria-hidden="true" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight">
                        AI Resume<span className="text-primary"> Architect</span>
                    </span>
                </NavLink>
 
                {/* Desktop nav - Home link removed (logo = home), keeps single line */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <NavLink to="/builder" className={navLinkClass}>Builder</NavLink>
                    <NavLink to="/templates" className={navLinkClass}>Templates</NavLink>
                    <NavLink to="/cover-letter" className={navLinkClass}>Cover Letter</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </nav>
 
                <div className="flex items-center gap-2">
                    {/* Primary CTA - desktop only */}
                    <Button asChild size="sm" className="hidden md:inline-flex btn-primary-glow h-8 px-4 text-xs">
                        <Link to="/builder">Build Resume</Link>
                    </Button>
                    <ThemeToggle />
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center justify-center size-8 rounded-md transition-colors hover:bg-accent text-muted-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Mobile slide-down menu */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
                    isMenuOpen ? 'max-h-96 border-t border-border/40' : 'max-h-0'
                }`}
            >
                <nav className="flex flex-col items-center gap-5 py-5 px-4">
                    <NavLink to="/" className={navLinkClass} onClick={closeMenu} end>Home</NavLink>
                    <NavLink to="/builder" className={navLinkClass} onClick={closeMenu}>Builder</NavLink>
                    <NavLink to="/templates" className={navLinkClass} onClick={closeMenu}>Templates</NavLink>
                    <NavLink to="/cover-letter" className={navLinkClass} onClick={closeMenu}>Cover Letter</NavLink>
                    <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>Contact</NavLink>
                    <Button asChild size="sm" className="btn-primary-glow w-full h-9 text-sm">
                        <Link to="/builder" onClick={closeMenu}>Build Resume</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
};
