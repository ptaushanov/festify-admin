import { z } from 'zod';

export const rewardSchema = z.object({
    name: z.string(),
    thumbnail: z.string(),
})

export type Reward = z.infer<typeof rewardSchema>