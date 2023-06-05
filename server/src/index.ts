import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './routers/appRouter.js';
import { createContext } from './contexts/context.js';
import cors from 'cors';

const port: number = 5000;

const server = createHTTPServer({
    middleware: cors(),
    router: appRouter,
    createContext
});

server.listen(port);
console.log(`Listening on port ${port}`);