import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export const Experience = () => {
  const { data } = usePortfolio();
  const experiences = data?.experiences || [];

  return (
    <section id="experience" className="py-20 md:py-32 bg-background relative border-t border-foreground/10">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Title Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col mb-16 md:mb-24"
        >
          <h2 className="text-5xl sm:text-7xl md:text-[120px] lg:text-[160px] font-normal leading-[0.85] tracking-tight uppercase text-foreground m-0">
            Experience
          </h2>
        </motion.div>

        {/* Sub-header text */}
        <div className="flex flex-col lg:flex-row justify-between border-t border-foreground/10 pt-12 md:pt-16 mb-12">
          <div className="w-full lg:w-5/12 pr-0 lg:pr-16 mb-8 lg:mb-0">
            <h3 className="text-3xl md:text-5xl font-normal tracking-tight text-foreground leading-[1.1]">
              Experience That<br />Builds Trust
            </h3>
          </div>
        </div>

        {/* Experience Rows */}
        <div className="divide-y divide-foreground/10 border-b border-foreground/10">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:bg-foreground/5 transition-colors px-4 rounded-xl"
            >
              <div className="flex flex-col md:w-5/12">
                <h4 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
                  {exp.company}
                </h4>
                <span className="text-base md:text-lg font-medium text-foreground/70 mt-1">
                  {exp.role}
                </span>
              </div>

              <div className="md:w-5/12">
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-normal">
                  {exp.desc}
                </p>
              </div>

              <div className="md:w-2/12 text-left md:text-right">
                <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">
                  {exp.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
