import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { getStatistics, homeStatisticsOutputSchema } from '../services/homeService.js';

export const homeRouter = router({
    getStatistics: protectedProcedure
        .output(homeStatisticsOutputSchema)
        .query(getStatistics)
});