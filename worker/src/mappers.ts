type Row = Record<string, unknown>;

export function nowIso(): string {
  return new Date().toISOString();
}

export function newId(): string {
  return crypto.randomUUID();
}

export function toBool(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

export function toIntFlag(value: unknown, fallback = 1): number {
  if (value === undefined || value === null) return fallback;
  return value === true || value === 1 || value === '1' ? 1 : 0;
}

export function parseList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function stringifyList(value: unknown): string {
  return JSON.stringify(parseList(value));
}

export function mapProfile(row: Row | null) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    location: row.location,
    statement: row.statement,
    availableForWork: toBool(row.available_for_work),
    resumeUrl: row.resume_url,
    avatarUrl: row.avatar_url,
    showHero: toBool(row.show_hero),
    showProjects: toBool(row.show_projects),
    showExperience: toBool(row.show_experience),
    showSkills: toBool(row.show_skills),
    showGithub: toBool(row.show_github),
    showPublications: toBool(row.show_publications),
    showActivities: toBool(row.show_activities),
    showContact: toBool(row.show_contact),
    updatedAt: row.updated_at,
  };
}

export function mapProject(row: Row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    image: row.image,
    description: row.description,
    technologies: parseList(row.technologies),
    github: row.github,
    live: row.live,
    figma: row.figma,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapExperience(row: Row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    duration: row.duration,
    desc: row.desc,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export function mapSkill(row: Row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    icon: row.icon,
    bg: row.bg,
    color: row.color,
    sortOrder: row.sort_order,
  };
}

export function mapPublication(row: Row) {
  return {
    id: row.id,
    title: row.title,
    publisher: row.publisher,
    year: row.year,
    authors: row.authors,
    abstract: row.abstract,
    doi: row.doi,
    pdfUrl: row.pdf_url,
    link: row.link,
    tags: parseList(row.tags),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapActivity(row: Row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    organization: row.organization,
    date: row.date,
    description: row.description,
    image: row.image,
    link: row.link,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapContact(row: Row | null) {
  if (!row) return null;
  return {
    id: row.id,
    location: row.location,
    email: row.email,
    linkedin: row.linkedin,
    github: row.github,
    figma: row.figma,
    twitter: row.twitter,
    githubUsername: row.github_username,
    officeImageUrl: row.office_image_url,
    updatedAt: row.updated_at,
  };
}

export function deriveGithubUsername(githubUrl: unknown): string | null {
  if (typeof githubUrl !== 'string' || !githubUrl.trim()) return null;
  const clean = githubUrl.trim().replace(/\/+$/, '');
  const parts = clean.split('/');
  const username = parts[parts.length - 1];
  if (!username || username === 'github.com') return null;
  return username;
}
