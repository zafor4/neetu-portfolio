import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wranglerPath = join(root, 'wrangler.toml');

function run(command) {
  return execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function patchDatabaseId(toml, databaseId) {
  return toml.replace(/database_id\s*=\s*"[^"]+"/, `database_id = "${databaseId}"`);
}

console.log('Creating D1 database neetu-portfolio...');
const createOut = run('npx wrangler d1 create neetu-portfolio');
console.log(createOut);

const idMatch = createOut.match(/database_id\s*=\s*"([^"]+)"/) || createOut.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
if (!idMatch) {
  throw new Error('Could not read database_id from wrangler output. Paste it into wrangler.toml manually.');
}

const databaseId = idMatch[1];
writeFileSync(wranglerPath, patchDatabaseId(readFileSync(wranglerPath, 'utf8'), databaseId));
console.log(`Wrote database_id ${databaseId} to wrangler.toml`);

console.log('Creating R2 bucket neetu-portfolio-media...');
try {
  console.log(run('npx wrangler r2 bucket create neetu-portfolio-media'));
} catch (error) {
  console.log(error.stdout || error.message);
  console.log('If the bucket already exists, that is fine.');
}

console.log('\nNext:\n  npm run db:migrate:remote\n  npx wrangler secret put JWT_SECRET\n  npm run deploy\n');
