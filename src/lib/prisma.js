import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis;

const DEFAULT_TURSO_URL = 'libsql://horizon-eyuel.aws-ap-northeast-1.turso.io';
const DEFAULT_TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ5NjY3NjYsImlkIjoiMDE5Zjk4NDYtOGIwMS03MWFlLWE1NTEtMzJmMDI5ODU1M2Q2Iiwia2lkIjoiRmgtVlg5TGctRHhzX0ZjOC1EdktsNVRrN1M4amNweFdIc3hQWTdfT0pVRSIsInJpZCI6IjY4YjIxYWIzLTY0OGEtNDQwOC1iN2ViLTk3NTk1Y2JhODg4NyJ9.DNixvRz7kVaTIQm_Oa7KAnWPkCJjY998Bgf0gPYlt3tObOwcgQPkEvmPWbbGrd95wozz73CXPby69CdRYTi0AQ';

function createPrismaClient() {
  let dbUrl = process.env.DATABASE_URL || '';
  let authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_KEY || '';

  // 1. If running in Production or Vercel, ensure process.env.DATABASE_URL is set so Prisma Engine never receives 'undefined'
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    if (!dbUrl) dbUrl = DEFAULT_TURSO_URL;
    if (!authToken) authToken = DEFAULT_TURSO_TOKEN;
    process.env.DATABASE_URL = dbUrl;
  }

  // 2. Check if Turso cloud credentials or URL are present
  const isTurso = 
    Boolean(authToken) || 
    dbUrl.startsWith('libsql://') || 
    dbUrl.startsWith('https://') || 
    dbUrl.includes('turso.io');

  if (isTurso) {
    const tursoUrl = (dbUrl.startsWith('libsql://') || dbUrl.startsWith('https://'))
      ? dbUrl
      : DEFAULT_TURSO_URL;

    const tokenToUse = authToken || DEFAULT_TURSO_TOKEN;

    const libsql = createClient({
      url: tursoUrl,
      authToken: tokenToUse,
    });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  // 3. Fallback for local development using SQLite file:./dev.db
  const localDbPath = path.join(process.cwd(), 'dev.db');
  process.env.DATABASE_URL = `file:${localDbPath}`;
  const adapter = new PrismaBetterSqlite3({ url: `file:${localDbPath}` });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
