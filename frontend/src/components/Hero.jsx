import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero = () => {
  const { data } = usePortfolio();
  const profile = data?.profile || {};

  return (
    <section id="about" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-background overflow-hidden min-h-screen flex flex-col justify-between">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10 flex-1 flex flex-col justify-center">
        
        {/* Main Display Name */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center my-6 md:my-12"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] xl:text-[135px] font-bold leading-[0.9] tracking-tighter uppercase text-foreground select-none">
            {profile.name || 'HUMAYRA ARZOOMAN'}
          </h1>
        </motion.div>

        {/* Info Grid Bar */}
        <div className="border-t border-foreground/15 pt-6 pb-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm md:text-base font-medium text-foreground/80">
          <div className="text-left">
            <span>{profile.title || 'UI/UX Designer & Product Designer'}</span>
          </div>
          <div className="text-center">
            <span>Based in</span><br />
            <span className="font-semibold text-foreground">{profile.location || 'Dhaka, Bangladesh'}</span>
          </div>
          <div className="text-right">
            <span>Working</span><br />
            <span>Globally</span>
          </div>
        </div>

        {/* Bio Intro Statement */}
        <motion.div
          initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-12 max-w-5xl mx-auto text-center px-2 sm:px-4"
        >
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[38px] font-medium leading-[1.25] tracking-tight text-foreground">
            {profile.statement || '[A product-focused Designer & Founder from Bangladesh, building high-performance digital experiences.]'}
          </p>
        </motion.div>

        {/* CTA Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          {profile.availableForWork !== false && (
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer group text-xs sm:text-sm font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Available for work</span>
            </div>
          )}

          <a
            href={profile.resumeUrl || '/resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 border border-foreground/20 rounded-full hover:bg-foreground hover:text-background transition-colors duration-300 text-xs sm:text-sm font-medium"
          >
            <span>Resume / CV</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
};
