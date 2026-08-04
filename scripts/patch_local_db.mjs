import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
console.log('Patching local SQLite DB at:', dbPath);

try {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'STUDENT',
      learningMode TEXT NOT NULL DEFAULT 'online',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec(`ALTER TABLE "User" ADD COLUMN "learningMode" TEXT NOT NULL DEFAULT 'online';`);
    console.log('✅ Added learningMode column to local dev.db');
  } catch (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('ℹ️ Column learningMode already exists in local dev.db');
    } else {
      console.log('Note:', err.message);
    }
  }

  db.close();
  console.log('✅ Local SQLite DB patch completed.');
} catch (e) {
  console.error('Error patching local DB:', e);
}
