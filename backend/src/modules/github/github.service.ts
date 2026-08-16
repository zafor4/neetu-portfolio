import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  async getStats(username: string) {
    const cleanUsername = username.trim();
    let followers = 0;
    let publicRepos = 0;
    let avatarUrl = '';
    let totalContributions = 0;
    let weeks: Array<Array<{ count: number; date?: string; level?: number }>> = [];

    // 1. Fetch GitHub User Profile Page for metadata (bypasses REST API rate limits)
    try {
      const profileRes = await fetch(`https://github.com/${cleanUsername}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
      if (profileRes.ok) {
        const html = await profileRes.text();
        const followerMatch = html.match(/class="text-bold color-fg-default">([\d,]+)<\/span>\s*followers/i);
        if (followerMatch && followerMatch[1]) {
          followers = parseInt(followerMatch[1].replace(/,/g, ''), 10);
        }

        const repoMatch = html.match(/Repositories\s*<span[^>]*class="Counter[^"]*">([\d,]+)<\/span>/i);
        if (repoMatch && repoMatch[1]) {
          publicRepos = parseInt(repoMatch[1].replace(/,/g, ''), 10);
        }

        const avatarMatch = html.match(/class="avatar avatar-user[^"]*"\s+src="([^"]+)"/i);
        if (avatarMatch && avatarMatch[1]) {
          avatarUrl = avatarMatch[1];
        }
      }
    } catch (err) {
      this.logger.warn(`Failed to fetch GitHub profile HTML for ${cleanUsername}: ${err.message}`);
    }

    // Fallback to REST API if HTML metadata parsing was incomplete
    if (!avatarUrl || (followers === 0 && publicRepos === 0)) {
      try {
        const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (NestJS Portfolio API)' },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (followers === 0) followers = userData.followers || 0;
          if (publicRepos === 0) publicRepos = userData.public_repos || 0;
          if (!avatarUrl) avatarUrl = userData.avatar_url || '';
        }
      } catch (err) {
        this.logger.warn(`REST API fallback warning for ${cleanUsername}: ${err.message}`);
      }
    }

    // 2. Fetch & Parse GitHub Contributions HTML
    try {
      const contribRes = await fetch(`https://github.com/users/${cleanUsername}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });

      if (contribRes.ok) {
        const html = await contribRes.text();

        // Parse total contributions count from header (e.g. "898 contributions in the last year")
        const h2Match = html.match(/([\d,]+)\s+contributions\s+in/i);
        if (h2Match && h2Match[1]) {
          totalContributions = parseInt(h2Match[1].replace(/,/g, ''), 10);
        }

        // Parse daily squares (date, level, count)
        const dayMatches = [...html.matchAll(/data-date="([^"]+)".*?data-level="(\d+)"/g)];
        const tooltipMatches = [...html.matchAll(/(?:No|(\d+))\s+contribution[s]?\s+on\s+([A-Za-z]+\s+\d+)/g)];

        const days = dayMatches.map((match, idx) => {
          const date = match[1];
          const level = parseInt(match[2], 10);
          const tooltip = tooltipMatches[idx];
          const count = tooltip && tooltip[1] ? parseInt(tooltip[1], 10) : (level > 0 ? level * 2 : 0);
          return { date, level, count };
        });

        if (totalContributions === 0 && days.length > 0) {
          totalContributions = days.reduce((sum, d) => sum + d.count, 0);
        }

        // Group into 7-day weeks
        const formattedWeeks = [];
        for (let i = 0; i < days.length; i += 7) {
          formattedWeeks.push(days.slice(i, i + 7));
        }
        weeks = formattedWeeks;
      }
    } catch (err) {
      this.logger.warn(`Failed to fetch GitHub contributions page for ${cleanUsername}: ${err.message}`);
    }

    // Fallback if parsing returned empty weeks
    if (weeks.length === 0) {
      const fallbackWeeks = [];
      for (let w = 0; w < 40; w++) {
        const days = [];
        for (let d = 0; d < 7; d++) {
          days.push({ count: 0, level: 0 });
        }
        fallbackWeeks.push(days);
      }
      weeks = fallbackWeeks;
    }

    return {
      username: cleanUsername,
      followers,
      publicRepos,
      totalContributions,
      avatarUrl,
      weeks,
    };
  }
}
