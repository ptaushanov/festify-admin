import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import {
    getRewardById,
    updateRewardById,
    deleteRewardById,
    viewRewardOutputSchema,
    updateRewardInputSchema,
    createReward,
} from '../services/rewardService.js';
import { z } from 'zod';
import { rewardSchema } from '../types/reward.js';

export const rewardRouter = router({
    getRewardById: protectedProcedure
        .input(z.string())
        .output(viewRewardOutputSchema)
        .query(async ({ input: id }) => {
            return await getRewardById(id)
        }),

    createReward: protectedProcedure
        .input(rewardSchema)
        .mutation(async ({ input: reward }) => {
            return await createReward(reward)
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