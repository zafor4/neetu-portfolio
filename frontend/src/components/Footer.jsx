import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 bg-background border-t border-foreground/10 text-foreground/60 text-xs sm:text-sm font-medium">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between">
        <div>
          <p>© {new Date().getFullYear()} Humayra Arzooman. All rights reserved.</p>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Back to Top"
        >
          <span>Back to Top</span>
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};
