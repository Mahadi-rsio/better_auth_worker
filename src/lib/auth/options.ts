import { BetterAuthOptions } from 'better-auth';
import { redis } from './redis.js';
import { bearer, openAPI } from 'better-auth/plugins';
import 'dotenv/config';
import { jwtPlugin } from './jwt.plugin.js';


/**
 In here User delete is disabled
 Currently add redis for session and jwt
 jwt expirationTime is set for 7 days
 cookieCache has 30 minuite expirationTime
**/

export const basePath : string = '/api/0/e/G/fXfsr56GCFVGHBNJMKHYTGFRDESFYUGUB/auth';

export const betterAuthOptions: BetterAuthOptions = {
    appName: 'Auth',

    basePath: basePath,
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

    advanced: {
        useSecureCookies: true,
    },

    emailAndPassword: {
        enabled: true,
    },

    account: {
        encryptOAuthTokens: true,
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
