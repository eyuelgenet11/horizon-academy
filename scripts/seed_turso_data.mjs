import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const url = 'libsql://horizon-eyuel.aws-ap-northeast-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ5NjY3NjYsImlkIjoiMDE5Zjk4NDYtOGIwMS03MWFlLWE1NTEtMzJmMDI5ODU1M2Q2Iiwia2lkIjoiRmgtVlg5TGctRHhzX0ZjOC1EdktsNVRrN1M4amNweFdIc3hQWTdfT0pVRSIsInJpZCI6IjY4YjIxYWIzLTY0OGEtNDQwOC1iN2ViLTk3NTk1Y2JhODg4NyJ9.DNixvRz7kVaTIQm_Oa7KAnWPkCJjY998Bgf0gPYlt3tObOwcgQPkEvmPWbbGrd95wozz73CXPby69CdRYTi0AQ';

const turso = createClient({ url, authToken });
const dbPath = path.join(process.cwd(), 'dev.db');

if (!fs.existsSync(dbPath)) {
  console.log('No local dev.db file found to seed from.');
  process.exit(0);
}

const sqlite = new Database(dbPath);

async function seed() {
  console.log('Copying local dev.db data to Turso database...');

  const tables = ['User', 'Course', 'Lesson', 'BlogPost', 'Enrollment', 'Progress', 'Transaction', 'Certificate', 'ContactInquiry'];

  for (const table of tables) {
    try {
      const rows = sqlite.prepare(`SELECT * FROM "${table}"`).all();
      if (rows.length === 0) continue;

      console.log(`Seeding ${rows.length} rows into ${table}...`);
      for (const row of rows) {
        const keys = Object.keys(row);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT OR REPLACE INTO "${table}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${placeholders})`;
        const args = Object.values(row);
        await turso.execute({ sql, args });
      }
    } catch (err) {
      console.warn(`Skipping table ${table}: ${err.message}`);
    }
  }

  console.log('✅ Successfully synchronized local dev.db data to Turso!');
}

seed().catch(console.error);
