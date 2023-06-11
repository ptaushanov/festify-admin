import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import {
    getRewardById,
    updateRewardById,
    deleteRewardById,
    viewRewardOutputSchema,
    updateRewardInputSchema,
} from '../services/rewardService.js';
import { z } from 'zod';

export const rewardRouter = router({
    getRewardById: protectedProcedure
        .input(z.string())
        .output(viewRewardOutputSchema)
        .query(async ({ input: id }) => {
            return await getRewardById(id)
        }),

    updateRewardById: protectedProcedure
        .input(updateRewardInputSchema)
        .mutation(async ({ input: { id, reward } }) => {
            return await updateRewardById(id, reward)
        }),

    deleteRewardById: protectedProcedure
        .input(z.string())
        .mutation(async ({ input: id }) => {
            return await deleteRewardById(id)
        })
});