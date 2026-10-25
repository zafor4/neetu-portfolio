import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Server, Palette, Layout, Cpu, Cloud,
  Database, GitBranch, Terminal, Layers, FileCode
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const ICON_MAP = {
  Code2, Server, Palette, Layout, Cpu, Cloud, Database, GitBranch, Terminal, Layers, FileCode,
};

export const Skills = () => {
  const { data } = usePortfolio();
  const skillsData = data?.skills || [];

  return (
    <section id="skills" className="py-20 md:py-32 bg-background relative border-t border-foreground/10">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Section Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col mb-16 md:mb-24"
        >
          <h2 className="text-5xl sm:text-7xl md:text-[140px] xl:text-[180px] font-normal leading-[0.85] tracking-tight uppercase text-foreground m-0">
            Skills
          </h2>
        </motion.div>

        {/* Skill Matrix Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {skillsData.map((skill, index) => {
            const Icon = ICON_MAP[skill.icon] || Code2;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-3.5 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-xl border border-foreground/5 cursor-default group"
              >
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 shadow-sm ${skill.bg} ${skill.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs md:text-sm font-bold text-foreground truncate">
                    {skill.name}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-medium text-foreground/60 truncate">
                    {skill.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
