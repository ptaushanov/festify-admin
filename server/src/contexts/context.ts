import { inferAsyncReturnType } from '@trpc/server';
import { IncomingMessage, ServerResponse } from 'http';

interface ContextArgs {
    req: IncomingMessage;
    res: ServerResponse;
}

interface ContextData extends ContextArgs {
    uid: string | null;
}

export function createContext({ req, res }: ContextArgs): ContextData {
    const uid = null
    return { req, res, uid }
}

export type Context = inferAsyncReturnType<typeof createContext>;