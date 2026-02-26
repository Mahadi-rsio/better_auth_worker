import { redis } from './redis.js';
import type { Jwk } from 'better-auth/plugins';
import { jwt } from 'better-auth/plugins';
import { randomUUID } from 'crypto';

const JWKS_KEY = 'betterauth:jwks';

export const jwtPlugin = jwt({
    adapter: {
        /**
         * Get all stored JWKs
         * Upstash Redis often auto-parses JSON in lists, so we handle both 
         * string and object types to prevent JSON.parse errors.
         */
        getJwks: async () => {
            const data = await redis.lrange(JWKS_KEY, 0, -1);
            if (!data || !data.length) return [];

            return data.map((item) => {
                // If item is already an object, use it. If it's a string, parse it.
                const parsed = typeof item === 'string' ? JSON.parse(item) : item;

                // Better Auth expects Date objects for these fields
                if (parsed.createdAt) {
                    parsed.createdAt = new Date(parsed.createdAt);
                }
                if (parsed.expiresAt) {
                    parsed.expiresAt = new Date(parsed.expiresAt);
                }

                return parsed as Jwk;
            });
        },

        /**
         * Create a new JWK entry
         */
        createJwk: async (data: Omit<Jwk, 'id'>, _ctx) => {
            const jwk: Jwk = {
                id: randomUUID(),
                publicKey: data.publicKey,
                privateKey: data.privateKey,
                createdAt: data.createdAt ?? new Date(),
                expiresAt: data.expiresAt,
                alg: data.alg ?? 'EdDSA',
                crv: data.crv ?? 'Ed25519',
            };

            // We stringify here to ensure a consistent format in the Redis list
            await redis.lpush(JWKS_KEY, JSON.stringify(jwk));

            // Keep only the last 5 keys to prevent the list from growing indefinitely
            await redis.ltrim(JWKS_KEY, 0, 4);

            return jwk;
        },
    },

    jwt: {
        // Defined in your options as 7 days
        expirationTime: '7d',
    },
});

