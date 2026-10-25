CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  statement TEXT NOT NULL,
  available_for_work INTEGER NOT NULL DEFAULT 1,
  resume_url TEXT NOT NULL DEFAULT '/resume.pdf',
  avatar_url TEXT NOT NULL DEFAULT '/assets/adina.jpeg',
  show_hero INTEGER NOT NULL DEFAULT 1,
  show_projects INTEGER NOT NULL DEFAULT 1,
  show_experience INTEGER NOT NULL DEFAULT 1,
  show_skills INTEGER NOT NULL DEFAULT 1,
  show_github INTEGER NOT NULL DEFAULT 1,
  show_publications INTEGER NOT NULL DEFAULT 1,
  show_activities INTEGER NOT NULL DEFAULT 1,
  show_contact INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'website',
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  technologies TEXT NOT NULL DEFAULT '[]',
  github TEXT,
  live TEXT,
  figma TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '',
  desc TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Code2',
  bg TEXT NOT NULL DEFAULT 'bg-foreground/10',
  color TEXT NOT NULL DEFAULT 'text-foreground',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  authors TEXT NOT NULL DEFAULT '',
  abstract TEXT NOT NULL DEFAULT '',
  doi TEXT,
  pdf_url TEXT,
  link TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  figma TEXT,
  twitter TEXT,
  github_username TEXT,
  office_image_url TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS github_cache (
  username TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  fetched_at TEXT NOT NULL
);
