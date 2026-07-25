import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis;

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || '';
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_KEY;

  // 1. Check if Turso cloud credentials/URL are present
  const isTurso = 
    Boolean(authToken) || 
    dbUrl.startsWith('libsql://') || 
    dbUrl.startsWith('https://') || 
    dbUrl.includes('turso.io');

  if (isTurso) {
    const tursoUrl = (dbUrl.startsWith('libsql://') || dbUrl.startsWith('https://'))
      ? dbUrl
      : 'libsql://horizon-eyuel.aws-ap-northeast-1.turso.io';

    const libsql = createClient({
      url: tursoUrl,
      authToken: authToken,
    });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  // 2. Serverless / Production Fallback (safe copy to writable tmp directory)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), '.next', 'cache');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch (_) {}
    }

    const tmpDbPath = path.join(tmpDir, 'dev.db');
    const sourceDbPath = path.join(process.cwd(), 'dev.db');

    if (!fs.existsSync(tmpDbPath)) {
      try {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } else {
          fs.writeFileSync(tmpDbPath, '');
        }
      } catch (err) {
        console.error('[PRISMA_TMP_DB_ERR]', err);
      }
    }
    const adapter = new PrismaBetterSqlite3({ url: `file:${tmpDbPath}` });
    return new PrismaClient({ adapter });
  }

  // 3. Local Development Fallback using absolute path
  const localDbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${localDbPath}` });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
