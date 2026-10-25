import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'frontend', 'dist');
const indexFile = join(distDir, 'index.html');

if (!existsSync(indexFile)) {
  mkdirSync(distDir, { recursive: true });
  writeFileSync(
    indexFile,
    '<!doctype html><html><body><p>Run <code>npm run dev</code> for local UI, or <code>npm run build</code> before deploy.</p></body></html>',
  );
}
