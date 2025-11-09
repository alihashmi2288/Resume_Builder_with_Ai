import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { PenSquare, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Enhanced nav link style with animated underline
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `relative py-2 text-sm font-medium transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${
            isActive ? 'text-primary after:scale-x-100' : 'text-muted-foreground hover:text-primary'
        }`;
        
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <NavLink to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80" onClick={closeMenu}>
                    <PenSquare className="h-6 w-6" />
                    <span className="font-bold">AI Resume Architect</span>
                </NavLink>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                    <NavLink to="/builder" className={navLinkClass}>Builder</NavLink>
                    <NavLink to="/templates" className={navLinkClass}>Templates</NavLink>
                    <NavLink to="/cover-letter" className={navLinkClass}>Cover Letter</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-md transition-colors hover:bg-accent"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Animated Mobile Navigation Menu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-96 border-t' : 'max-h-0'}`}>
                <nav className="flex flex-col items-center gap-4 py-4">
                    <NavLink to="/" className={navLinkClass} onClick={closeMenu} end>Home</NavLink>
                    <NavLink to="/builder" className={navLinkClass} onClick={closeMenu}>Builder</NavLink>
                    <NavLink to="/templates" className={navLinkClass} onClick={closeMenu}>Templates</NavLink>
                    <NavLink to="/cover-letter" className={navLinkClass} onClick={closeMenu}>Cover Letter</NavLink>
                    <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>Contact</NavLink>
                </nav>
            </div>
        </header>
    );
};