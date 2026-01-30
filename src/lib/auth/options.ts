import { BetterAuthOptions } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { redis } from './redis.js';
import { bearer } from 'better-auth/plugins'
import 'dotenv/config'

// In here User delete is disabled
// Currently add redis for session only
// we have to make custom adapter for jwt cache for redis
// jwt expirationTime is set for 7 days 
// cookieCache has 30 minuite expirationTime
// import openAPI to use

export const betterAuthOptions: BetterAuthOptions = {
    appName: 'Auth',

    basePath: '/api/auth',

    /*@Todo -- Add here your origin @EX */
    /*@Todo -- Like your Frontend app url */
    /*@Todo -- http://localhost:5173 */
    trustedOrigins: [
        //Your Other origin here or Frontend
        process.env.ORIGIN!
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
        jwt({
            jwt :{
                expirationTime : 60 * 60 * 24 * 7,
            },
        }),
        
        // openAPI is disabled by default
        //openAPI(),
        
        bearer()
        
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge : 30 * 60,           
        },
    },

    advanced : {
        useSecureCookies : true,
        
    },
    

    emailAndPassword: {
        enabled: true,
        
    },

    account : {
        encryptOAuthTokens : true,        
    },

    socialProviders : {
        google : {
            clientId : process.env.GOOGLE_CLIENT_ID!,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET!,
        },
        github : {
            clientId : process.env.GITHUB_CLIENT_ID!,
            clientSecret : process.env.GITHUB_CLIENT_SECRET!,
        },
        discord : {
            clientId : process.env.DISCORD_CLIENT_ID!,
            clientSecret : process.env.DISCORD_CLIENT_SECRET!,
        },
    },







};
