import "dotenv/config";
import { defineConfig } from "prisma/config";

const rawUrl = process.env["DATABASE_URL"] || "";
// Prisma CLI build generator expects standard SQLite URL format
const url = (rawUrl.startsWith("libsql://") || rawUrl.startsWith("https://"))
  ? "file:./dev.db"
  : (rawUrl || "file:./dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
