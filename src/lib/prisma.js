import path from 'path';

const DEFAULT_TURSO_URL = 'libsql://horizon-eyuel.aws-ap-northeast-1.turso.io';
const DEFAULT_TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ5NjY3NjYsImlkIjoiMDE5Zjk4NDYtOGIwMS03MWFlLWE1NTEtMzJmMDI5ODU1M2Q2Iiwia2lkIjoiRmgtVlg5TGctRHhzX0ZjOC1EdktsNVRrN1M4amNweFdIc3hQWTdfT0pVRSIsInJpZCI6IjY4YjIxYWIzLTY4OGEtNDQwOC1iN2ViLTk3NTk1Y2JhODg4NyJ9.DNixvRz7kVaTIQm_Oa7KAnWPkCJjY998Bgf0gPYlt3tObOwcgQPkEvmPWbbGrd95wozz73CXPby69CdRYTi0AQ';

// GUARANTEE process.env.DATABASE_URL IS ALWAYS A VALID URL BEFORE PRISMA CLIENT INITIALIZATION
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'undefined') {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    process.env.DATABASE_URL = DEFAULT_TURSO_URL;
  } else {
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'dev.db')}`;
  }
}

if (!process.env.TURSO_AUTH_TOKEN && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
  process.env.TURSO_AUTH_TOKEN = DEFAULT_TURSO_TOKEN;
}

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis;

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || '';
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_KEY || '';

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

    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tokenToUse,
    });
    return new PrismaClient({ adapter });
  }

  const localDbPath = path.join(process.cwd(), 'dev.db');
  process.env.DATABASE_URL = `file:${localDbPath}`;
  const adapter = new PrismaBetterSqlite3({ url: `file:${localDbPath}` });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
