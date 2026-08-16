import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPortfolioData } from '../services/api';

const PortfolioContext = createContext();

const defaultData = {
  profile: {
    name: 'MD ZAFOR IQBAL',
    title: 'Software Engineer & Programming Instructor',
    location: 'Dhaka, Bangladesh',
    statement: '[Computer Science and Engineering graduate (CGPA 3.80/4.00) and M.Sc. candidate with professional software engineering experience, published research in Deep Learning & AI, and hands-on teaching experience in React.js and modern Web Development.]',
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
      title: 'Tech Meet',
      type: 'website',
      image: '/assets/snippit.png',
      description: 'Automated recruitment platform using the M-Smart hybrid AI matching model for candidate profiling, ranking, and shortlisting.',
      technologies: ['Next.js', 'Express.js', 'FastAPI', 'Python', 'AI'],
      github: 'https://github.com/zafor4/tech-meet',
      live: 'https://portfolio-client-five-ebon.vercel.app'
    },
    {
      id: '2',
      title: 'Bhubanmajhi',
      type: 'website',
      image: '/assets/zentra.png',
      description: 'Full-stack travel booking platform covering tour, hotel, flight, and reservation workflows; integrated SSLCommerz payment and booking management.',
      technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'SSLCommerz'],
      github: 'https://github.com/zafor4/bhubanmajhi',
      live: ''
    },
    {
      id: '3',
      title: 'Surveillance & Mapping System',
      type: 'website',
      image: '/assets/autovion.png',
      description: 'Real-time surveillance and mapping system supporting live tracking, ride-sharing, and delivery workflows.',
      technologies: ['React Native', 'React.js', 'Node.js', 'WebSockets', 'MapLibre'],
      github: 'https://github.com/zafor4/surveillance-system',
      live: ''
    },
    {
      id: '4',
      title: 'eFamily Court Judiciary Platform',
      type: 'website',
      image: '/assets/smartchain.png',
      description: 'Digital paperless judiciary platform developed at CSE Tech for judicial user interface workflows and API integration.',
      technologies: ['Next.js', 'React.js', 'NestJS', 'Prisma', 'PostgreSQL'],
      github: '',
      live: ''
    }
  ],
  experiences: [
    {
      id: '1',
      company: 'CSE Tech',
      role: 'Software Engineer (Frontend)',
      duration: '01/2026 – Present',
      desc: 'Develop enterprise web applications using Next.js, React.js, NestJS, and PostgreSQL. Rebuilt company portfolio and digital paperless judiciary platform eFamily Court. Guide junior developers and interns.'
    },
    {
      id: '2',
      company: 'Fawz Biz Enterprises',
      role: 'Full Stack Developer & Database Specialist',
      duration: '02/2026 – Present',
      desc: 'Design relational & non-relational database structures, SQL queries, Prisma ORM integrations, and RESTful APIs for enterprise software projects.'
    },
    {
      id: '3',
      company: 'SharpBD IT Solution',
      role: 'Frontend Developer',
      duration: '04/2025 – 09/2025',
      desc: 'Developed real-time surveillance & mapping system using WebSockets & MapLibre, and full-stack travel booking platform.'
    },
    {
      id: '4',
      company: 'SharpBD IT Solution',
      role: 'React.js Developer (Intern)',
      duration: '01/2025 – 04/2025',
      desc: 'Integrated RESTful APIs using Axios and built responsive user interfaces using Bootstrap and CSS.'
    }
  ],
  skills: [
    { name: 'C++', category: 'Programming & CS', icon: 'Code2', bg: 'bg-[#00599C]', color: 'text-white' },
    { name: 'Python', category: 'Programming & AI', icon: 'Terminal', bg: 'bg-[#3776ab]', color: 'text-white' },
    { name: 'JavaScript & TS', category: 'Programming & Web', icon: 'Code2', bg: 'bg-[#f7df1e]', color: 'text-black' },
    { name: 'React.js & Next.js', category: 'Frontend Engineering', icon: 'Layout', bg: 'bg-[#61dafb]', color: 'text-black' },
    { name: 'NestJS & Node.js', category: 'Backend Engineering', icon: 'Server', bg: 'bg-[#E0234E]', color: 'text-white' },
    { name: 'PostgreSQL & MySQL', category: 'Database Systems', icon: 'Database', bg: 'bg-[#4169E1]', color: 'text-white' },
    { name: 'MongoDB', category: 'NoSQL Databases', icon: 'Database', bg: 'bg-[#47a248]', color: 'text-white' },
    { name: 'Prisma ORM', category: 'Database ORM', icon: 'Layers', bg: 'bg-[#2D3748]', color: 'text-white' },
    { name: 'Machine Learning & Deep Learning', category: 'AI & Research', icon: 'Cpu', bg: 'bg-[#ff007f]', color: 'text-white' },
    { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', icon: 'Cpu', bg: 'bg-foreground', color: 'text-background' },
    { name: 'Docker & Git', category: 'Tools & DevOps', icon: 'GitBranch', bg: 'bg-[#2496ED]', color: 'text-white' },
    { name: 'Tailwind CSS', category: 'Styling Framework', icon: 'Layout', bg: 'bg-[#38bdf8]', color: 'text-white' },
    { name: 'WebSockets & MapLibre', category: 'Real-time & Maps', icon: 'Cloud', bg: 'bg-[#ff9900]', color: 'text-black' }
  ],
  publications: [
    {
      id: '1',
      title: 'Enhanced Agricultural Productivity: Dragon Fruit Leaf Disease Detection Using Deep Learning Models',
      publisher: 'International Conference on Intelligent Data Analysis and Applications (IDAA 2025)',
      year: 'Dec 2025',
      authors: 'MD ZAFOR IQBAL, et al.',
      abstract: 'Published research proposing an automated deep learning framework for accurate identification and classification of dragon fruit leaf diseases to increase agricultural crop yield.',
      doi: '10.1007/IDAA2025',
      link: 'https://github.com/zafor4',
      pdfUrl: '/documents/dragon_fruit_research.pdf',
      tags: ['Deep Learning', 'Computer Vision', 'Agricultural AI', 'Image Classification']
    },
    {
      id: '2',
      title: 'M SMART: An Automated Multi Stage Semantic Evaluation Pipeline for Job Candidate Compatibility Assessment in the Tech Industry',
      publisher: 'The International Conference on Recent Progresses in Science, Engineering and Technology (ICRPSET-2026)',
      year: '2026',
      authors: 'MD ZAFOR IQBAL, et al.',
      abstract: 'Submitted research paper introducing an automated AI semantic evaluation pipeline for candidate resume profiling, skill matching, and technical compatibility scoring.',
      doi: '',
      link: '',
      pdfUrl: '/documents/msmart_research.pdf',
      tags: ['NLP', 'Sentence Transformers', 'Semantic Matching', 'AI Recruitment']
    }
  ],
  activities: [
    {
      id: '1',
      title: 'React.js Course Instructor',
      category: 'Teaching & Instruction',
      organization: 'NCSA-EDGE Project Training Program (BCC & ICT Division) | Daffodil International University',
      date: '05/2026 – 06/2026',
      description: 'Instructed the "SPA Development with React.js" course for 25+ learners through hands-on coding sessions, state management, REST API integration, and deployment practices.',
      image: '/assets/professional_office.png',
      link: 'https://github.com/zafor4'
    },
    {
      id: '2',
      title: 'M.Sc. in Computer Science & Engineering',
      category: 'Education & Academics',
      organization: 'Daffodil International University, Dhaka',
      date: '05/2026 – Present',
      description: 'Advanced graduate studies focused on Data Mining, Machine Learning, and Distributed Software Architectures.',
      image: '/assets/autovion.png',
      link: ''
    },
    {
      id: '3',
      title: 'B.Sc. in Computer Science & Engineering (CGPA: 3.80/4.00)',
      category: 'Education & Academics',
      organization: 'Daffodil International University, Dhaka',
      date: '01/2022 – 12/2025',
      description: 'Graduated with high distinction (CGPA 3.80/4.00). Specialized in Software Engineering, Algorithms, and Machine Learning.',
      image: '/assets/zentra.png',
      link: ''
    }
  ],
  contact: {
    location: 'DHAKA, BANGLADESH',
    email: 'xoy4444@gmail.com',
    linkedin: 'https://linkedin.com/in/zaforiqbalxoy',
    github: 'https://github.com/zafor4',
    figma: 'https://figma.com/@zaforiqbal',
    twitter: 'https://twitter.com/@zaforiqbal',
    githubUsername: 'zafor4',
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
