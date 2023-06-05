import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { Context } from '../contexts/context.js';

const ZodUser = z.object({
    id: z.number().optional(),
    name: z.string().min(3),
    bio: z.string().max(142).optional(),
});

type User = z.infer<typeof ZodUser>;

let _id = 0;
const users: Record<string, User> = {
    0: {
        id: 0,
        name: 'Alice',
        bio: 'I like turtles',
    },
    1: {
        id: 1,
        name: 'Bob',
        bio: 'I like trains',
    },
};

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = t.router({
    getUserById: publicProcedure
        .input(z.number())
        .query((opts) => {
            return users[opts.input];
        }),
    createUser: publicProcedure
        .input(ZodUser)
        .mutation((opts) => {
            const id = _id++
            const user: User = { id, ...opts.input };
            users[id] = user;

            console.info(`Created a new user with id ${user.id}`);
            return user;
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;