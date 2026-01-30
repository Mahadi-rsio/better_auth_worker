import { serve } from '@hono/node-server';
import app from './src/index.js';
import { log } from 'node:console';

serve(
    {
        port: 3000,
        fetch: app.fetch,
    },
    (info) => {
        log('server is running' + info.port);
    },
);
