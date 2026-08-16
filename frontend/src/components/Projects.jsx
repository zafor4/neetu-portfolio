import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Figma, LayoutGrid, Globe, Palette, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Projects = () => {
  const { data } = usePortfolio();
  const projectsData = data?.projects || [];

  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filterTabs = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'website', label: 'Web', icon: Globe },
    { id: 'ui/ux', label: 'Design', icon: Palette }
  ];

  const filteredProjects = useMemo(() => {
    const list = filter === 'all' ? projectsData : projectsData.filter(p => p.type === filter);
    return showAll ? list : list.slice(0, 5);
  }, [filter, showAll, projectsData]);

  return (
    <section id="projects" className="py-20 md:py-32 bg-background relative border-t border-foreground/10">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Section Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col mb-12 md:mb-20"
        >
          <h2 className="text-5xl sm:text-7xl md:text-[120px] lg:text-[160px] font-normal leading-[0.85] tracking-tight uppercase text-foreground m-0">
            Projects
          </h2>
        </motion.div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4 mb-12 flex-wrap border-b border-foreground/10 pb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-foreground text-background shadow-sm'
                      : 'border border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs sm:text-sm font-medium text-foreground/50">
            Showing {filteredProjects.length} of {projectsData.length}
          </span>
        </div>

        {/* Project Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const techList = Array.isArray(project.technologies) 
                ? project.technologies 
                : (project.technologies || '').split(',').map(t => t.trim());

              return (
                <motion.div
                  key={project.id || index}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative flex flex-col bg-foreground/5 dark:bg-card border border-foreground/10 rounded-2xl overflow-hidden hover:border-foreground/30 transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white text-black rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:bg-zinc-100 transition-colors"
                        >
                          <Globe size={14} />
                          Website
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-black/80 text-white rounded-full hover:bg-black transition-colors"
                          aria-label="GitHub Repository"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {project.figma && (
                        <a
                          href={project.figma}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:bg-zinc-900 transition-colors"
                        >
                          <Figma size={14} />
                          Figma
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content Footer */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:translate-x-1 transition-transform">
                          {project.title}
                        </h3>
                        {project.live ? (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/70 hover:text-foreground transition-colors"
                          >
                            <ArrowUpRight size={22} />
                          </a>
                        ) : project.figma ? (
                          <a
                            href={project.figma}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/70 hover:text-foreground transition-colors"
                          >
                            <ArrowUpRight size={22} />
                          </a>
                        ) : null}
                      </div>
                      <p className="text-sm md:text-base text-foreground/70 mb-6 font-normal">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-foreground/10">
                      {techList.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-foreground/10 rounded-full text-xs font-medium text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {projectsData.length > 5 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full border border-foreground/20 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
            >
              {showAll ? 'Show Less' : 'View All Projects'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
