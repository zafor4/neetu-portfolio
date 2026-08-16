import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { Sun, Moon, Menu, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { data } = usePortfolio();
  const profile = data?.profile || {};
  const profileName = profile.name || 'Humayra Arzooman';

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allLinks = [
    { name: 'About', href: '#about', visible: profile.showHero !== false },
    { name: 'Projects', href: '#projects', visible: profile.showProjects !== false },
    { name: 'Experience', href: '#experience', visible: profile.showExperience !== false },
    { name: 'Skills', href: '#skills', visible: profile.showSkills !== false },
    { name: 'Publications', href: '#publications', visible: profile.showPublications !== false },
    { name: 'Contact', href: '#contact', visible: profile.showContact !== false },
  ];

  const navLinks = allLinks.filter(link => link.visible);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-md border-b border-foreground/10 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between">
        {/* Brand Name */}
        <a 
          href="#" 
          className="text-base md:text-lg font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          {profileName}
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/login"
            title="Admin Portal"
            className="p-2 rounded-full border border-foreground/10 text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
          >
            <Lock size={16} />
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full border border-foreground/10 text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-foreground/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-medium text-foreground py-2 border-b border-foreground/5"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-foreground py-2 text-emerald-500"
          >
            🔒 Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
};
