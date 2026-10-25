import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { AuthUser, Env } from './env';
import { readBearer, signToken, verifyPassword, verifyToken } from './auth';
import { getGithubStats } from './github';
import {
  deriveGithubUsername,
  mapActivity,
  mapContact,
  mapExperience,
  mapProfile,
  mapProject,
  mapPublication,
  mapSkill,
  newId,
  nowIso,
  stringifyList,
  toIntFlag,
} from './mappers';
import { ensureReady } from './seed';

type AppEnv = {
  Bindings: Env;
  Variables: { user: AuthUser };
};

const api = new Hono<AppEnv>();

api.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

api.use('*', async (c, next) => {
  await ensureReady(c.env.DB);
  await next();
});

const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const token = readBearer(c.req.header('Authorization'));
  if (!token) throw new HTTPException(401, { message: 'Unauthorized' });
  try {
    c.set('user', await verifyToken(token, c.env.JWT_SECRET));
  } catch {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
  await next();
});

api.get('/health', (c) => c.json({ ok: true, runtime: 'cloudflare-workers' }));

api.get('/portfolio', async (c) => {
  const db = c.env.DB;
  const [profile, projects, experiences, skills, contact, publications, activities] = await Promise.all([
    db.prepare('SELECT * FROM profile LIMIT 1').first(),
    db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all(),
    db.prepare('SELECT * FROM experiences ORDER BY sort_order ASC').all(),
    db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all(),
    db.prepare('SELECT * FROM contact LIMIT 1').first(),
    db.prepare('SELECT * FROM publications ORDER BY sort_order ASC').all(),
    db.prepare('SELECT * FROM activities ORDER BY sort_order ASC').all(),
  ]);

  return c.json({
    profile: mapProfile(profile),
    projects: (projects.results || []).map(mapProject),
    experiences: (experiences.results || []).map(mapExperience),
    skills: (skills.results || []).map(mapSkill),
    contact: mapContact(contact),
    publications: (publications.results || []).map(mapPublication),
    activities: (activities.results || []).map(mapActivity),
  });
});

api.get('/github/stats/:username', async (c) => {
  return c.json(await getGithubStats(c.env.DB, c.req.param('username')));
});

api.post('/auth/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  const email = body.email?.trim();
  const password = body.password || '';
  if (!email || !password) throw new HTTPException(400, { message: 'Email and password are required' });

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<{
    id: string;
    email: string;
    password_hash: string;
    role: string;
  }>();

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new HTTPException(401, { message: 'Invalid credentials' });
  }

  const access_token = await signToken({ userId: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET);
  return c.json({ access_token, user: { email: user.email, role: user.role } });
});

api.get('/auth/me', requireAuth, (c) => c.json(c.get('user')));

api.get('/profile', async (c) => {
  return c.json(mapProfile(await c.env.DB.prepare('SELECT * FROM profile LIMIT 1').first()));
});

api.put('/profile', requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const existing = await c.env.DB.prepare('SELECT * FROM profile LIMIT 1').first<Record<string, unknown>>();
  const current = mapProfile(existing) || {};
  const id = String(existing?.id || newId());
  const updated = nowIso();

  await c.env.DB
    .prepare(
      `INSERT INTO profile (
        id, name, title, location, statement, available_for_work, resume_url, avatar_url,
        show_hero, show_projects, show_experience, show_skills, show_github, show_publications,
        show_activities, show_contact, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        title = excluded.title,
        location = excluded.location,
        statement = excluded.statement,
        available_for_work = excluded.available_for_work,
        resume_url = excluded.resume_url,
        avatar_url = excluded.avatar_url,
        show_hero = excluded.show_hero,
        show_projects = excluded.show_projects,
        show_experience = excluded.show_experience,
        show_skills = excluded.show_skills,
        show_github = excluded.show_github,
        show_publications = excluded.show_publications,
        show_activities = excluded.show_activities,
        show_contact = excluded.show_contact,
        updated_at = excluded.updated_at`,
    )
    .bind(
      id,
      body.name ?? current.name ?? 'Humayra Arzooman',
      body.title ?? current.title ?? 'UI/UX Designer & Product Designer',
      body.location ?? current.location ?? 'Dhaka, Bangladesh',
      body.statement ?? current.statement ?? '',
      toIntFlag(body.availableForWork ?? body.available_for_work ?? current.availableForWork, 1),
      body.resumeUrl ?? body.resume_url ?? current.resumeUrl ?? '/resume.pdf',
      body.avatarUrl ?? body.avatar_url ?? current.avatarUrl ?? '/assets/adina.jpeg',
      toIntFlag(body.showHero ?? body.show_hero ?? current.showHero, 1),
      toIntFlag(body.showProjects ?? body.show_projects ?? current.showProjects, 1),
      toIntFlag(body.showExperience ?? body.show_experience ?? current.showExperience, 1),
      toIntFlag(body.showSkills ?? body.show_skills ?? current.showSkills, 1),
      toIntFlag(body.showGithub ?? body.show_github ?? current.showGithub, 1),
      toIntFlag(body.showPublications ?? body.show_publications ?? current.showPublications, 1),
      toIntFlag(body.showActivities ?? body.show_activities ?? current.showActivities, 1),
      toIntFlag(body.showContact ?? body.show_contact ?? current.showContact, 1),
      updated,
    )
    .run();

  return c.json(mapProfile(await c.env.DB.prepare('SELECT * FROM profile WHERE id = ?').bind(id).first()));
});

api.get('/projects', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
  return c.json((rows.results || []).map(mapProject));
});

api.post('/projects', requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = newId();
  const created = nowIso();
  await c.env.DB
    .prepare(
      `INSERT INTO projects (id, title, type, image, description, technologies, github, live, figma, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      String(body.title || 'Untitled'),
      String(body.type || 'website'),
      String(body.image || ''),
      String(body.description || ''),
      stringifyList(body.technologies),
      body.github ?? null,
      body.live ?? null,
      body.figma ?? null,
      Number(body.sortOrder ?? body.sort_order ?? 0),
      created,
      created,
    )
    .run();
  return c.json(mapProject((await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first())!));
});

api.put('/projects/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) throw new HTTPException(404, { message: 'Project not found' });
  const body = await c.req.json<Record<string, unknown>>();
  await c.env.DB
    .prepare(
      `UPDATE projects SET title = ?, type = ?, image = ?, description = ?, technologies = ?, github = ?, live = ?, figma = ?, sort_order = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      body.title ?? existing.title,
      body.type ?? existing.type,
      body.image ?? existing.image,
      body.description ?? existing.description,
      body.technologies !== undefined ? stringifyList(body.technologies) : existing.technologies,
      body.github ?? existing.github,
      body.live ?? existing.live,
      body.figma ?? existing.figma,
      Number(body.sortOrder ?? body.sort_order ?? existing.sort_order ?? 0),
      nowIso(),
      id,
    )
    .run();
  return c.json(mapProject((await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first())!));
});

api.delete('/projects/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

api.get('/experiences', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM experiences ORDER BY sort_order ASC').all();
  return c.json((rows.results || []).map(mapExperience));
});

api.post('/experiences', requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = newId();
  await c.env.DB
    .prepare('INSERT INTO experiences (id, company, role, duration, desc, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, String(body.company || ''), String(body.role || ''), String(body.duration || ''), String(body.desc || ''), Number(body.sortOrder ?? 0), nowIso())
    .run();
  return c.json(mapExperience((await c.env.DB.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first())!));
});

api.put('/experiences/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) throw new HTTPException(404, { message: 'Experience not found' });
  const body = await c.req.json<Record<string, unknown>>();
  await c.env.DB
    .prepare('UPDATE experiences SET company = ?, role = ?, duration = ?, desc = ?, sort_order = ? WHERE id = ?')
    .bind(body.company ?? existing.company, body.role ?? existing.role, body.duration ?? existing.duration, body.desc ?? existing.desc, Number(body.sortOrder ?? existing.sort_order ?? 0), id)
    .run();
  return c.json(mapExperience((await c.env.DB.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first())!));
});

api.delete('/experiences/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM experiences WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

api.get('/skills', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  return c.json((rows.results || []).map(mapSkill));
});

api.post('/skills', requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = newId();
  await c.env.DB
    .prepare('INSERT INTO skills (id, name, category, icon, bg, color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, String(body.name || ''), String(body.category || ''), String(body.icon || 'Code2'), String(body.bg || 'bg-foreground/10'), String(body.color || 'text-foreground'), Number(body.sortOrder ?? 0))
    .run();
  return c.json(mapSkill((await c.env.DB.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first())!));
});

api.put('/skills/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) throw new HTTPException(404, { message: 'Skill not found' });
  const body = await c.req.json<Record<string, unknown>>();
  await c.env.DB
    .prepare('UPDATE skills SET name = ?, category = ?, icon = ?, bg = ?, color = ?, sort_order = ? WHERE id = ?')
    .bind(body.name ?? existing.name, body.category ?? existing.category, body.icon ?? existing.icon, body.bg ?? existing.bg, body.color ?? existing.color, Number(body.sortOrder ?? existing.sort_order ?? 0), id)
    .run();
  return c.json(mapSkill((await c.env.DB.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first())!));
});

api.delete('/skills/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM skills WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

api.get('/publications', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM publications ORDER BY sort_order ASC').all();
  return c.json((rows.results || []).map(mapPublication));
});

api.post('/publications', requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const id = newId();
  const created = nowIso();
  await c.env.DB
    .prepare(
      `INSERT INTO publications (id, title, publisher, year, authors, abstract, doi, pdf_url, link, tags, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      String(body.title || ''),
      String(body.publisher || ''),
      String(body.year || ''),
      String(body.authors || ''),
      String(body.abstract || ''),
      body.doi ?? null,
      body.pdfUrl ?? body.pdf_url ?? null,
      body.link ?? null,
      stringifyList(body.tags),
      Number(body.sortOrder ?? 0),
      created,
      created,
    )
    .run();
  return c.json(mapPublication((await c.env.DB.prepare('SELECT * FROM publications WHERE id = ?').bind(id).first())!));
});

api.put('/publications/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM publications WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) throw new HTTPException(404, { message: 'Publication not found' });
  const body = await c.req.json<Record<string, unknown>>();
  await c.env.DB
    .prepare(
      `UPDATE publications SET title = ?, publisher = ?, year = ?, authors = ?, abstract = ?, doi = ?, pdf_url = ?, link = ?, tags = ?, sort_order = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      body.title ?? existing.title,
      body.publisher ?? existing.publisher,
      body.year ?? existing.year,
      body.authors ?? existing.authors,
      body.abstract ?? existing.abstract,
      body.doi ?? existing.doi,
      body.pdfUrl ?? body.pdf_url ?? existing.pdf_url,
      body.link ?? existing.link,
      body.tags !== undefined ? stringifyList(body.tags) : existing.tags,
      Number(body.sortOrder ?? existing.sort_order ?? 0),
      nowIso(),
      id,
    )
    .run();
  return c.json(mapPublication((await c.env.DB.prepare('SELECT * FROM publications WHERE id = ?').bind(id).first())!));
});

api.delete('/publications/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM publications WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

api.get('/contact', async (c) => {
  return c.json(mapContact(await c.env.DB.prepare('SELECT * FROM contact LIMIT 1').first()));
});

api.put('/contact', requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const existing = await c.env.DB.prepare('SELECT * FROM contact LIMIT 1').first<Record<string, unknown>>();
  const id = String(existing?.id || newId());
  const github = String(body.github ?? existing?.github ?? '');
  const githubUsername = deriveGithubUsername(github) || String(body.githubUsername ?? existing?.github_username ?? '');

  await c.env.DB
    .prepare(
      `INSERT INTO contact (id, location, email, linkedin, github, figma, twitter, github_username, office_image_url, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         location = excluded.location,
         email = excluded.email,
         linkedin = excluded.linkedin,
         github = excluded.github,
         figma = excluded.figma,
         twitter = excluded.twitter,
         github_username = excluded.github_username,
         office_image_url = excluded.office_image_url,
         updated_at = excluded.updated_at`,
    )
    .bind(
      id,
      body.location ?? existing?.location ?? 'DHAKA, BANGLADESH',
      body.email ?? existing?.email ?? '',
      body.linkedin ?? existing?.linkedin ?? '',
      github,
      body.figma ?? existing?.figma ?? '',
      body.twitter ?? existing?.twitter ?? '',
      githubUsername,
      body.officeImageUrl ?? body.office_image_url ?? existing?.office_image_url ?? '',
      nowIso(),
    )
    .run();

  return c.json(mapContact(await c.env.DB.prepare('SELECT * FROM contact WHERE id = ?').bind(id).first()));
});

api.get('/admin/media', requireAuth, async (c) => {
  const listed = await c.env.MEDIA.list({ limit: 1000 });
  return c.json(
    listed.objects.map((obj) => {
      const parts = obj.key.split('/');
      const filename = parts.pop() || obj.key;
      const folder = parts.length ? parts[0] : 'root';
      return {
        key: obj.key,
        folder,
        filename,
        size: obj.size,
        lastModified: obj.uploaded,
        url: `/api/files/${obj.key}`,
      };
    }),
  );
});

api.post('/admin/upload', requireAuth, async (c) => {
  const form = await c.req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) throw new HTTPException(400, { message: 'file is required' });

  const folderRaw = String(form.get('folder') || 'images');
  const folder = folderRaw.replace(/[^a-zA-Z0-9_-]/g, '') || 'images';
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${Date.now()}-${safeName}`;

  await c.env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  return c.json({
    key,
    filename: safeName,
    size: file.size,
    url: `/api/files/${key}`,
  });
});

api.delete('/admin/media/*', requireAuth, async (c) => {
  const key = decodeURIComponent(c.req.path.replace(/^\/api\/admin\/media\//, ''));
  if (!key) throw new HTTPException(400, { message: 'key is required' });
  await c.env.MEDIA.delete(key);
  return c.json({ success: true, key });
});

api.get('/files/*', async (c) => {
  const key = decodeURIComponent(c.req.path.replace(/^\/api\/files\//, ''));
  const object = await c.env.MEDIA.get(key);
  if (!object) throw new HTTPException(404, { message: 'File not found' });

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  if (object.httpEtag) headers.set('ETag', object.httpEtag);

  return new Response(object.body, { headers });
});

api.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  return c.json({ message: err.message || 'Internal Server Error' }, 500);
});

export const app = new Hono<AppEnv>();
app.route('/api', api);
