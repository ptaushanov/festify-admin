import { z } from 'zod';
import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { db } from '../firebase-admin.js';
import { TRPCError } from '@trpc/server';

const timelineInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
});

const timelineOutputSchema = z.object({
    holidays: z.array(
        z.object({
            celebrated_on: z.string(),
            name: z.string(),
            thumbnail: z.string(),
            lessonRef: z.any().optional(),
        })
    )
})

type TimelineOutput = z.infer<typeof timelineOutputSchema>;

export const timelineRouter = router({
    getSeasonTimeline: protectedProcedure
        .input(timelineInputSchema)
        .output(timelineOutputSchema)
        .query(async ({ input: { season } }) => {
            const timelineDoc = await db.collection('seasons_timeline')
                .doc(season)
                .get()

            if (!timelineDoc.exists) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Timeline not found',
                });
            }

            return timelineDoc.data() as TimelineOutput
        })
});