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
        "http://localhost:5173",
        //Your Other origin here or Frontend
        process.env.ORIGIN!,
    ],

    secondaryStorage: {
        get: async (key) => {
            return await redis.get(key);
        },
        set: async (key, value, ttl) => {
            if (ttl) await redis.set(key, value, {
                ex: ttl
            });
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
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            scope: [
                "repo"
            ]
        },
    },
};
