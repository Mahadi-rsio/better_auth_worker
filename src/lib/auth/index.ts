import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { betterAuthOptions } from './options.js';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';
import { Pool} from '@neondatabase/serverless'

const pool = new Pool({
    connectionString: process.env.POSTGRE_DB_URL!,
});

const db = drizzle(pool);

export const auth = betterAuth({
    ...betterAuthOptions,

    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
});
