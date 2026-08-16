import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { BookOpen, ExternalLink, FileText, Award, Tag } from 'lucide-react';

export const Publications = () => {
  const { data } = usePortfolio();
  const publications = data?.publications || [];

  if (!publications.length) return null;

  return (
    <section id="publications" className="py-20 md:py-32 bg-background relative border-t border-foreground/10">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col mb-16 md:mb-24"
        >
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-emerald-500 mb-3 block">
            Academic & Industry Research
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-[120px] lg:text-[160px] font-normal leading-[0.85] tracking-tight uppercase text-foreground m-0">
            Publications
          </h2>
        </motion.div>

        {/* Publications Cards Grid */}
        <div className="space-y-8">
          {publications.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="bg-card border border-foreground/10 p-8 md:p-12 rounded-3xl group hover:border-foreground/30 transition-all duration-300 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-foreground/10">
                <div className="space-y-2 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-foreground/10 rounded-full text-xs font-bold text-foreground">
                      <Award size={13} className="text-emerald-500" />
                      {item.publisher}
                    </span>
                    <span className="px-3 py-1 bg-foreground/5 rounded-full text-xs font-semibold text-foreground/70">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground pt-2 leading-tight group-hover:text-emerald-500 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm font-semibold text-foreground/70 flex items-center gap-2">
                    <span>Authors:</span>
                    <span className="text-foreground font-bold">{item.authors}</span>
                  </p>
                </div>

                {/* Direct External Action Links */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground/10 hover:bg-foreground hover:text-background text-foreground rounded-full text-xs font-bold transition-all duration-300 cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>PDF Paper</span>
                    </a>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background hover:opacity-90 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm"
                    >
                      <span>View Article / DOI</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Abstract Body */}
              <div className="pt-6">
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-5xl">
                  {item.abstract}
                </p>

                {/* Research Topic Badges */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-foreground/5">
                    {item.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-lg text-xs font-medium text-foreground/70"
                      >
                        <Tag size={11} className="text-emerald-500" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
