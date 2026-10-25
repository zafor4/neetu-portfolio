# Portfolio + CMS on Cloudflare

React public site and admin CMS, hosted entirely on Cloudflare: **Workers + D1 + R2**. No VPS, no Postgres, no MinIO.

The old NestJS / Docker stack in `backend/` is unused.

---

## Local development

```bash
npm install
npm install --prefix frontend
copy .dev.vars.example .dev.vars   # Windows
npm run dev
```

- UI: http://localhost:5173
- API: http://127.0.0.1:8787/api/health
- Admin: http://localhost:5173/admin/login

First API request creates tables and seeds content if the local D1 database is empty. CMS edits persist across restarts.

---

## Deploy to Cloudflare (one time)

1. Create a free Cloudflare account and run `npm run cf:login`
2. Create D1 + R2 and write the database id into `wrangler.toml`:

```bash
npm run cf:bootstrap
```

Or do it by hand:

```bash
npx wrangler d1 create neetu-portfolio
npx wrangler r2 bucket create neetu-portfolio-media
```

Paste the printed `database_id` into `wrangler.toml`.

3. Apply schema and set the JWT secret:

```bash
npm run db:migrate:remote
npx wrangler secret put JWT_SECRET
```

4. Deploy the frontend + API as one Worker:

```bash
npm run deploy
```

The site will be on `https://neetu-portfolio.<your-subdomain>.workers.dev`.

### Custom domain

In Cloudflare Dashboard → Workers & Pages → `neetu-portfolio` → Settings → Domains → add your domain. DNS stays on Cloudflare. HTTPS is included.

### GitHub auto-deploy

Repo secrets:

- `CLOUDFLARE_API_TOKEN` (Workers + D1 + R2 edit)
- `CLOUDFLARE_ACCOUNT_ID`

Push to `main` runs `.github/workflows/deploy.yml`.

---

## Admin

Seeded only when the `users` table is empty:

- Email: `admin@arzooman.com`
- Password: `admin123`

Change these in the database after first login. Do not keep the default password on a public domain.

---

## What maps to what

| Old VPS piece | Cloudflare |
|---|---|
| Vite / nginx frontend | Worker static assets |
| NestJS `/api` | Hono Worker |
| PostgreSQL | D1 (SQLite) |
| MinIO | R2, served at `/api/files/...` |

CMS writes stay in D1. They are not wiped on deploy or restart.

---

## Free-plan notes

A personal portfolio fits the free tier. Workers Free allows 100k requests/day and **10 ms CPU per request**. Login uses light PBKDF2; GitHub heatmaps are cached for 6 hours. If admin login or GitHub stats start failing, Workers Paid is $5/month.
