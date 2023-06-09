import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';

import {
    timelineInputSchema,
    timelineOutputSchema,
    getSeasonTimeline,
    holidayInputSchema,
    updateHoliday
} from '../services/timelineService.js';


export const timelineRouter = router({
    getSeasonTimeline: protectedProcedure
        .input(timelineInputSchema)
        .output(timelineOutputSchema)
        .query(async ({ input: { season } }) => {
            return await getSeasonTimeline(season)
        }),

    updateHoliday: protectedProcedure
        .input(holidayInputSchema)
        .mutation(async ({ input: { season, index, holiday } }) => {
            return await updateHoliday(season, index, holiday)
        })
});