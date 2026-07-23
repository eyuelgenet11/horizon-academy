import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis;

function getDbUrl() {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dev.db')) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / serverless environment, copy dev.db to writable /tmp directory
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = '/tmp/dev.db';
    const sourceDbPath = path.join(process.cwd(), 'dev.db');

    if (!fs.existsSync(tmpDbPath)) {
      try {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } else {
          fs.writeFileSync(tmpDbPath, '');
        }
      } catch (err) {
        console.error('Failed to copy SQLite database to /tmp:', err);
      }
    }
    return `file:${tmpDbPath}`;
  }

  return process.env.DATABASE_URL || 'file:./dev.db';
}

const adapter = new PrismaBetterSqlite3({
  url: getDbUrl(),
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
