import { defineConfig, env } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // This URL is used for Migrations and Introspection
    url: env('DATABASE_URL'), 
  },
});