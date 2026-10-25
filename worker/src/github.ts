const CACHE_MS = 6 * 60 * 60 * 1000;

type WeekDay = { count: number; date?: string; level?: number };

export type GithubStats = {
  username: string;
  followers: number;
  publicRepos: number;
  totalContributions: number;
  avatarUrl: string;
  weeks: WeekDay[][];
};

function emptyWeeks(): WeekDay[][] {
  return Array.from({ length: 40 }, () => Array.from({ length: 7 }, () => ({ count: 0, level: 0 })));
}

async function readCache(db: D1Database, username: string): Promise<GithubStats | null> {
  const row = await db.prepare('SELECT payload, fetched_at FROM github_cache WHERE username = ?').bind(username).first<{ payload: string; fetched_at: string }>();
  if (!row) return null;
  if (Date.now() - new Date(row.fetched_at).getTime() > CACHE_MS) return null;
  try {
    return JSON.parse(row.payload) as GithubStats;
  } catch {
    return null;
  }
}

async function writeCache(db: D1Database, username: string, stats: GithubStats): Promise<void> {
  await db
    .prepare(
      `INSERT INTO github_cache (username, payload, fetched_at)
       VALUES (?, ?, ?)
       ON CONFLICT(username) DO UPDATE SET payload = excluded.payload, fetched_at = excluded.fetched_at`,
    )
    .bind(username, JSON.stringify(stats), new Date().toISOString())
    .run();
}

export async function getGithubStats(db: D1Database, username: string): Promise<GithubStats> {
  const clean = username.trim();
  const cached = await readCache(db, clean);
  if (cached) return cached;

  const stats: GithubStats = {
    username: clean,
    followers: 0,
    publicRepos: 0,
    totalContributions: 0,
    avatarUrl: '',
    weeks: emptyWeeks(),
  };

  try {
    const userRes = await fetch(`https://api.github.com/users/${clean}`, {
      headers: { 'User-Agent': 'neetu-portfolio-worker', Accept: 'application/vnd.github+json' },
    });
    if (userRes.ok) {
      const user = await userRes.json<{ followers?: number; public_repos?: number; avatar_url?: string }>();
      stats.followers = user.followers || 0;
      stats.publicRepos = user.public_repos || 0;
      stats.avatarUrl = user.avatar_url || '';
    }
  } catch {
    // keep defaults
  }

  try {
    const contribRes = await fetch(`https://github.com/users/${clean}/contributions`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; neetu-portfolio)' },
    });
    if (contribRes.ok) {
      const html = await contribRes.text();
      const totalMatch = html.match(/([\d,]+)\s+contributions\s+in/i);
      if (totalMatch?.[1]) {
        stats.totalContributions = parseInt(totalMatch[1].replace(/,/g, ''), 10);
      }

      const dayMatches = [...html.matchAll(/data-date="([^"]+)"[^>]*data-level="(\d+)"/g)];
      if (dayMatches.length) {
        const days = dayMatches.map((match) => {
          const level = parseInt(match[2], 10);
          return { date: match[1], level, count: level > 0 ? level * 2 : 0 };
        });
        if (!stats.totalContributions) {
          stats.totalContributions = days.reduce((sum, day) => sum + day.count, 0);
        }
        const weeks: WeekDay[][] = [];
        for (let i = 0; i < days.length; i += 7) {
          weeks.push(days.slice(i, i + 7));
        }
        if (weeks.length) stats.weeks = weeks;
      }
    }
  } catch {
    // heatmap is optional on the free CPU budget
  }

  await writeCache(db, clean, stats);
  return stats;
}
