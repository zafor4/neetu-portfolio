import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { GitHubStats } from './components/GitHubStats';
import { Publications } from './components/Publications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function LivePortfolioContent() {
  const { data } = usePortfolio();
  const profile = data?.profile || {};

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <Navbar />
      <main>
        {profile.showHero !== false && <Hero />}
        {profile.showProjects !== false && <Projects />}
        {profile.showExperience !== false && <Experience />}
        {profile.showSkills !== false && <Skills />}
        {profile.showGithub !== false && <GitHubStats />}
        {profile.showPublications !== false && <Publications />}
        {profile.showContact !== false && <Contact />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LivePortfolioContent />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
