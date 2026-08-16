import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Github, Users, BookOpen, GitCommit, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { fetchGithubStatsApi } from '../services/api';

export const GitHubStats = () => {
  const { data } = usePortfolio();
  const contact = data?.contact || {};

  // Extract GitHub profile link dynamically from contact details
  const githubProfileUrl = useMemo(() => {
    if (contact.github && contact.github.trim()) {
      const url = contact.github.trim();
      return url.startsWith('http') ? url : `https://${url}`;
    }
    return 'https://github.com/adinahawaldar';
  }, [contact.github]);

  // Extract GitHub username dynamically from contact.github or contact.githubUsername
  const username = useMemo(() => {
    if (contact.github && contact.github.trim()) {
      const cleanUrl = contact.github.trim().replace(/\/+$/, '');
      const parts = cleanUrl.split('/');
      const extracted = parts.pop();
      if (extracted && extracted !== 'github.com') return extracted;
    }
    if (contact.githubUsername && contact.githubUsername.trim()) {
      return contact.githubUsername.trim();
    }
    return 'adinahawaldar';
  }, [contact.github, contact.githubUsername]);

  const [stats, setStats] = useState({
    followers: 0,
    publicRepos: 0,
    totalContributions: 0,
    avatarUrl: ''
  });
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadLiveStats = async () => {
      setLoading(true);
      try {
        const res = await fetchGithubStatsApi(username);
        if (isMounted && res) {
          setStats({
            followers: res.followers || 0,
            publicRepos: res.publicRepos || 0,
            totalContributions: res.totalContributions || 0,
            avatarUrl: res.avatarUrl || ''
          });
          setWeeks(res.weeks || []);
        }
      } catch (err) {
        console.warn('Backend GitHub API fallback used:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadLiveStats();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const getSquareColor = (count) => {
    if (!count || count === 0) return 'bg-foreground/10';
    if (count < 3) return 'bg-emerald-400/50 dark:bg-emerald-700/60';
    if (count < 6) return 'bg-emerald-500 dark:bg-emerald-500';
    if (count < 10) return 'bg-emerald-600 dark:bg-emerald-400';
    return 'bg-emerald-800 dark:bg-emerald-300';
  };

  return (
    <section id="github" className="py-20 md:py-32 bg-background relative border-t border-foreground/10">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Section Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col mb-16 md:mb-24"
        >
          <h2 className="text-5xl sm:text-7xl md:text-[120px] lg:text-[160px] font-normal leading-[0.85] tracking-tight uppercase text-foreground m-0">
            GitHub
          </h2>
        </motion.div>

        {/* Stats Row & Heatmap Container */}
        <div className="flex flex-col gap-12 bg-foreground/5 dark:bg-card border border-foreground/10 p-8 md:p-12 rounded-3xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-foreground/10">
            <div className="flex items-center gap-4">
              {stats.avatarUrl ? (
                <img src={stats.avatarUrl} alt={username} className="w-14 h-14 rounded-2xl border border-foreground/10 object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Github size={30} className="text-foreground" />
                </div>
              )}
              <div>
                <a 
                  href={githubProfileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xl md:text-2xl font-bold text-foreground hover:underline flex items-center gap-2"
                >
                  <span>@{username}</span>
                  <ExternalLink size={16} className="text-muted-foreground" />
                </a>
                <p className="text-xs md:text-sm text-foreground/60">Live Public Activity & Contributions</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {loading ? '...' : stats.followers}
                </span>
                <span className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {loading ? '...' : stats.totalContributions}
                </span>
                <span className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Commits / Year</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {loading ? '...' : stats.publicRepos}
                </span>
                <span className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Public Repos</span>
              </div>
            </div>
          </div>

          {/* Activity Squares Heatmap */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-1.5 min-w-[750px]">
              {weeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-1.5">
                  {week.map((day, dIndex) => (
                    <div
                      key={dIndex}
                      title={day.date ? `${day.count || 0} contributions on ${day.date}` : `${day.count || 0} contributions`}
                      className={`w-3.5 h-3.5 rounded-xs transition-all duration-300 hover:scale-125 ${getSquareColor(day.count)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
