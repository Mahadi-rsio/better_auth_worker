import { BetterAuthOptions } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { redis } from './redis.js';
import { openAPI , bearer } from 'better-auth/plugins'

// In here User delete is disabled
// Currently add redis for session only
// we have to make custom adapter for jwt cache for redis
// jwt expirationTime is set for 7 days 
// cookieCache has 30 minuite expirationTime

export const betterAuthOptions: BetterAuthOptions = {
    appName: 'Auth',

    basePath: '/api/auth',

    /*@Todo -- Add here your origin @EX */
    /*@Todo -- Like your Frontend app url */
    /*@Todo -- http://localhost:5173 */
    trustedOrigins: [
        'http://localhost:5173'
        //Your Other origin here or Frontend
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
        openAPI(),
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
    }
};
