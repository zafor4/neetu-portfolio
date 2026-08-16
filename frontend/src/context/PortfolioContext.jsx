import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPortfolioData } from '../services/api';

const PortfolioContext = createContext();

const defaultData = {
  profile: {
    name: 'Humayra Arzooman',
    title: 'UI/UX Designer & Product Designer',
    location: 'Dhaka, Bangladesh',
    statement: '[A product-focused Designer & Founder from Bangladesh, building high-performance digital experiences where modern design meets scalable technology, cloud innovation, and intelligent solutions.]',
    availableForWork: true,
    resumeUrl: '/resume.pdf',
    avatarUrl: '/assets/adina.jpeg',
    showHero: true,
    showProjects: true,
    showExperience: true,
    showSkills: true,
    showGithub: true,
    showPublications: true,
    showActivities: true,
    showContact: true,
  },
  projects: [
    {
      id: '1',
      title: 'Snippit Code Snippet Platform',
      type: 'website',
      image: '/assets/snippit.png',
      description: 'A developer productivity platform designed in Figma with dark glassmorphism aesthetic and sleek code management workflows.',
      technologies: ['Figma', 'UI/UX Design', 'Design Systems', 'React'],
      github: 'https://github.com/adinahawaldar/snippit',
      live: 'https://humayraarzooman.me'
    },
    {
      id: '2',
      title: 'Zentra Task & Workflow Manager',
      type: 'website',
      image: '/assets/zentra.png',
      description: 'Enterprise task management platform interface featuring intuitive drag-and-drop kanban boards, micro-animations, and team analytics.',
      technologies: ['Figma', 'Prototyping', 'User Research', 'React'],
      github: 'https://github.com/adinahawaldar/zentra',
      live: ''
    },
    {
      id: '3',
      title: 'Autovion Fleet & Mobility App',
      type: 'website',
      image: '/assets/autovion.png',
      description: 'Mobile and web fleet management dashboard with live vehicle telemetry, dark mode UI, and interactive map widgets.',
      technologies: ['UI/UX', 'Mobile App Design', 'Figma', 'React Native'],
      github: 'https://github.com/adinahawaldar/autovion',
      live: ''
    },
    {
      id: '4',
      title: 'SmartChain Web3 Analytics',
      type: 'website',
      image: '/assets/smartchain.png',
      description: 'Web3 crypto portfolio and decentralized finance dashboard with dynamic chart visualizations and glassmorphism styling.',
      technologies: ['UI/UX Design', 'Design Tokens', 'Tailwind CSS'],
      github: '',
      live: ''
    }
  ],
  experiences: [
    {
      id: '1',
      company: 'Adina Studio',
      role: 'Lead UI/UX & Product Designer',
      duration: '2023 – Present',
      desc: 'Leading product design strategy, user research, wireframing, high-fidelity Figma prototyping, and design system engineering for international clients.'
    },
    {
      id: '2',
      company: 'Creative Tech Solutions',
      role: 'Senior UI/UX Specialist',
      duration: '2022 – 2023',
      desc: 'Crafted responsive Web and Mobile application interfaces, conducted usability testing, and built comprehensive component design libraries.'
    },
    {
      id: '3',
      company: 'PixelCraft Agency',
      role: 'Junior Product Designer',
      duration: '2021 – 2022',
      desc: 'Collaborated with engineering teams to convert client requirements into intuitive interactive prototypes and modern user journeys.'
    }
  ],
  skills: [
    { name: 'Figma & FigJam', category: 'UI/UX Tools', icon: 'Layout', bg: 'bg-[#F24E1E]', color: 'text-white' },
    { name: 'UI/UX Design', category: 'Design Discipline', icon: 'Layout', bg: 'bg-[#a259ff]', color: 'text-white' },
    { name: 'Design Systems', category: 'Design Architecture', icon: 'Layers', bg: 'bg-[#1abcfe]', color: 'text-white' },
    { name: 'Prototyping & Motion', category: 'Interaction Design', icon: 'Cpu', bg: 'bg-[#ff7262]', color: 'text-white' },
    { name: 'User Research & Wireframing', category: 'UX Discipline', icon: 'Code2', bg: 'bg-[#0acf83]', color: 'text-white' },
    { name: 'React.js & Next.js', category: 'Frontend Tech', icon: 'Code2', bg: 'bg-[#61dafb]', color: 'text-black' },
    { name: 'Tailwind CSS', category: 'Styling Framework', icon: 'Layout', bg: 'bg-[#38bdf8]', color: 'text-white' },
    { name: 'HTML5 & CSS3', category: 'Web Fundamentals', icon: 'Terminal', bg: 'bg-[#e34f26]', color: 'text-white' }
  ],
  publications: [
    {
      id: '1',
      title: 'Human-Centered AI Interfaces: Design Systems for Generative UX Workflows',
      publisher: 'International Journal of Human-Computer Interaction',
      year: '2025',
      authors: 'Humayra Arzooman, et al.',
      abstract: 'Explores design system principles for seamless human-AI collaboration, focusing on micro-interactions, feedback loops, and dynamic dark UI themes.',
      doi: '10.1080/IJHCI2025',
      link: 'https://github.com/adinahawaldar',
      pdfUrl: '/documents/ux_ai_research.pdf',
      tags: ['UI/UX', 'Design Systems', 'AI Interaction', 'Human-Computer Interaction']
    }
  ],
  activities: [
    {
      id: '1',
      title: 'UI/UX Workshop Lead & Instructor',
      category: 'Teaching & Mentorship',
      organization: 'Tech Mentors Community',
      date: '2024 – Present',
      description: 'Conducting hands-on design masterclasses covering Figma auto-layout, design tokens, design systems, and developer handoff practices for 100+ aspiring designers.',
      image: '/assets/professional_office.png',
      link: 'https://github.com/adinahawaldar'
    },
    {
      id: '2',
      title: 'Design System Advocate',
      category: 'Events & Speaking',
      organization: 'Figma Community Dhaka',
      date: '2024',
      description: 'Keynote speaker on building enterprise design systems and bridging the gap between Figma designs and React code implementations.',
      image: '/assets/zentra.png',
      link: ''
    }
  ],
  contact: {
    location: 'DHAKA, BANGLADESH',
    email: 'adinahawaldar895@gmail.com',
    linkedin: 'https://linkedin.com/in/adina-hawaldar-17az6',
    github: 'https://github.com/adinahawaldar',
    figma: 'https://figma.com/@adinahawaldar',
    twitter: 'https://twitter.com/@adina_hawaldar',
    githubUsername: 'adinahawaldar',
    officeImageUrl: '/assets/professional_office.png'
  }
};

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await fetchPortfolioData();
      if (res && res.profile) {
        setData({
          profile: { ...defaultData.profile, ...res.profile },
          projects: res.projects?.length ? res.projects : defaultData.projects,
          experiences: res.experiences?.length ? res.experiences : defaultData.experiences,
          skills: res.skills?.length ? res.skills : defaultData.skills,
          publications: res.publications?.length ? res.publications : defaultData.publications,
          activities: res.activities?.length ? res.activities : defaultData.activities,
          contact: res.contact ? { ...defaultData.contact, ...res.contact } : defaultData.contact,
        });
      }
    } catch (err) {
      console.warn('Backend API unreachable. Serving fallback portfolio data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, setData, refreshData, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
