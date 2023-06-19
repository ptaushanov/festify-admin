import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { getAllUsers, viewUsersOutputSchema, wipeUserData } from '../services/userService.js';
import { z } from 'zod';

export const userRouter = router({
    getAllUsers: protectedProcedure
        .output(viewUsersOutputSchema)
        .query(async () => {
            return await getAllUsers();
        }),

    wipeUserData: protectedProcedure
        .input(z.string())
        .mutation(async ({ input: userId }) => {
            return await wipeUserData(userId);
        })
});