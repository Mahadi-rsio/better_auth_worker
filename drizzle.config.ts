/**
 * Drizzle Kit configuration file
 *
 * Docs: https://orm.drizzle.team/docs/drizzle-config-file
 */


import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'

export default defineConfig({
    out: './drizzle',
    schema: './src/db/auth-schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        //host : 'localhost',
        //port : 5432,
        //user : 'u0_a26',
        //database : 'mydb',
        url : process.env.DB! 
    },
});
