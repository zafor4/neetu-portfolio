import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact = () => {
  const { data } = usePortfolio();
  const contact = data?.contact || {};

  const socialLinks = [
    { name: "LINKEDIN", href: contact.linkedin || "https://linkedin.com/in/adina-hawaldar-17az6" },
    { name: "GITHUB", href: contact.github || "https://github.com/adinahawaldar" },
    { name: "FIGMA", href: contact.figma || "https://figma.com/@adinahawaldar" },
    { name: "TWITTER", href: contact.twitter || "https://twitter.com/@adina_hawaldar" }
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-background relative border-t border-foreground/10 overflow-hidden">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Big Display Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col mb-16 md:mb-24"
        >
          <h2 className="text-5xl sm:text-7xl md:text-[140px] xl:text-[180px] font-normal leading-[0.85] tracking-tight uppercase text-foreground m-0">
            Contact
          </h2>
        </motion.div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-foreground/10 aspect-[4/3]">
            <img
              src={contact.officeImageUrl || "/assets/professional_office.png"}
              alt="Dhaka Office Workspace"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Right Column: Information & Links */}
          <div className="lg:col-span-5 flex flex-col space-y-10 text-foreground">
            
            {/* Location */}
            <div>
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-foreground/50 block mb-2">
                LOCATION:
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">
                {contact.location || 'DHAKA, BANGLADESH'}
              </h3>
            </div>

            {/* Get In Touch / Email */}
            <div>
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-foreground/50 block mb-2">
                GET IN TOUCH:
              </span>
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-foreground/50 block mb-2">
                EMAIL:
              </span>
              <a
                href={`mailto:${contact.email || 'adinahawaldar895@gmail.com'}`}
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-wider uppercase underline decoration-2 underline-offset-8 hover:text-foreground/70 transition-colors break-all"
              >
                {contact.email || 'ADINAHAWALDAR895@GMAIL.COM'}
              </a>
            </div>

            {/* Social Nav */}
            <div className="pt-6 border-t border-foreground/10 flex flex-col space-y-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg font-bold tracking-widest uppercase hover:text-foreground/60 transition-colors flex items-center justify-between group"
                >
                  <span>{social.name}</span>
                  <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    ↗
                  </span>
                </a>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
