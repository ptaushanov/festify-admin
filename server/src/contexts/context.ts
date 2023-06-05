import { inferAsyncReturnType } from '@trpc/server';

export function createContext(...args: any[]) {
    return args
}

export type Context = inferAsyncReturnType<typeof createContext>;