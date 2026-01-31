import { BetterAuthOptions } from 'better-auth';
import { redis } from './redis.js';
import { bearer, openAPI } from 'better-auth/plugins';
import 'dotenv/config';
import { jwtPlugin } from './jwt.plugin.js';

// In here User delete is disabled
// Currently add redis for session only
// we have to make custom adapter for jwt cache for redis
// jwt expirationTime is set for 7 days
// cookieCache has 30 minuite expirationTime
// import openAPI to use

export const betterAuthOptions: BetterAuthOptions = {
    appName: 'Auth',

    basePath: '/api/auth',
    trustedOrigins: [
        //Your Other origin here or Frontend
        process.env.ORIGIN!,
    ],

    secondaryStorage: {
        get: async (key) => {
            return await redis.get(key);
        },
        set: async (key, value, ttl) => {
            if (ttl) await redis.set(key, value, 'EX', ttl);
            else await redis.set(key, value);
        },
        delete: async (key) => {
            await redis.del(key);
        },
    },

    plugins: [
        // openAPI is disabled by default
        openAPI(),
        jwtPlugin,
        bearer(),
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 30 * 60,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
    },
};
