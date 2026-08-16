import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Server, Palette, Layout, Cpu, Cloud, 
  Database, GitBranch, Terminal, Layers, FileCode, CheckCircle2 
} from 'lucide-react';

export const Skills = () => {
  const skillsData = [
    { name: "React", category: "Frontend Framework", icon: Code2, bg: "bg-[#61dafb]", color: "text-black" },
    { name: "Node.js", category: "Backend Engineering", icon: Server, bg: "bg-[#339933]", color: "text-white" },
    { name: "Tailwind CSS", category: "Styling Framework", icon: Layout, bg: "bg-[#38bdf8]", color: "text-white" },
    { name: "Figma", category: "UI/UX Design", icon: Palette, bg: "bg-zinc-900 dark:bg-zinc-100", color: "text-white dark:text-black" },
    { name: "Product Design", category: "Strategy & UX", icon: Layers, bg: "bg-foreground", color: "text-background" },
    { name: "Graphics Design", category: "Visual Identity", icon: Cpu, bg: "bg-[#ff007f]", color: "text-white" },
    { name: "AWS", category: "Cloud Infrastructure", icon: Cloud, bg: "bg-[#232F3E]", color: "text-white" },
    { name: "Firebase", category: "Backend Services", icon: Database, bg: "bg-[#ffca28]", color: "text-black" },
    { name: "Python", category: "Backend / Scripting", icon: Terminal, bg: "bg-[#3776ab]", color: "text-white" },
    { name: "MongoDB", category: "Database", icon: Database, bg: "bg-[#47a248]", color: "text-white" },
    { name: "Git & GitHub", category: "Version Control", icon: GitBranch, bg: "bg-[#181717]", color: "text-white" },
    { name: "Canva", category: "Design Software", icon: Palette, bg: "bg-[#00c4cc]", color: "text-white" },
    { name: "Java", category: "Programming", icon: FileCode, bg: "bg-[#5382a1]", color: "text-white" },
    { name: "HTML & CSS", category: "Web Foundation", icon: Code2, bg: "bg-[#e34f26]", color: "text-white" }
  ];

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
            const Icon = skill.icon;
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
