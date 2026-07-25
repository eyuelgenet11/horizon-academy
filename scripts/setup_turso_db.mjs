import { createClient } from '@libsql/client';

const url = 'libsql://horizon-eyuel.aws-ap-northeast-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ5NjY3NjYsImlkIjoiMDE5Zjk4NDYtOGIwMS03MWFlLWE1NTEtMzJmMDI5ODU1M2Q2Iiwia2lkIjoiRmgtVlg5TGctRHhzX0ZjOC1EdktsNVRrN1M4amNweFdIc3hQWTdfT0pVRSIsInJpZCI6IjY4YjIxYWIzLTY0OGEtNDQwOC1iN2ViLTk3NTk1Y2JhODg4NyJ9.DNixvRz7kVaTIQm_Oa7KAnWPkCJjY998Bgf0gPYlt3tObOwcgQPkEvmPWbbGrd95wozz73CXPby69CdRYTi0AQ';

const client = createClient({ url, authToken });

const ddl = [
  `CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "Course" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    imageUrl TEXT,
    price REAL NOT NULL DEFAULT 0,
    isPublished BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "Lesson" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    videoUrl TEXT,
    audioUrl TEXT,
    pdfUrl TEXT,
    content TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    courseId TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courseId) REFERENCES "Course"(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS "Enrollment" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES "Course"(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId)
  );`,
  `CREATE TABLE IF NOT EXISTS "Progress" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    lessonId TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    completedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (lessonId) REFERENCES "Lesson"(id) ON DELETE CASCADE,
    UNIQUE(userId, lessonId)
  );`,
  `CREATE TABLE IF NOT EXISTS "Transaction" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ETB',
    status TEXT NOT NULL DEFAULT 'PENDING',
    paymentMethod TEXT,
    reference TEXT UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id),
    FOREIGN KEY (courseId) REFERENCES "Course"(id)
  );`,
  `CREATE TABLE IF NOT EXISTS "Certificate" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    certificateUrl TEXT,
    issuedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id),
    FOREIGN KEY (courseId) REFERENCES "Course"(id),
    UNIQUE(userId, courseId)
  );`,
  `CREATE TABLE IF NOT EXISTS "BlogPost" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    imageUrl TEXT,
    isPublished BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "ContactInquiry" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNREAD',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`
];

async function setup() {
  console.log('Pushing database schema to Turso...');
  for (const sql of ddl) {
    await client.execute(sql);
  }
  console.log('✅ Schema successfully pushed to Turso database!');
}

setup().catch((err) => {
  console.error('❌ Failed to push schema to Turso:', err);
  process.exit(1);
});
