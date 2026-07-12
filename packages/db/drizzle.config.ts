import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema.ts',
  out: './migrations',
  driver: 'better-sqlite3',
});
