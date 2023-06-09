import { router } from '../trpc.js';
import {
    getLessonsBySeason,
    viewLessonsInputSchema,
    viewLessonsOutputSchema
} from '../services/lessonsService.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
export const lessonRouter = router({
    getLessonsBySeason: protectedProcedure
        .input(viewLessonsInputSchema)
        .output(viewLessonsOutputSchema)
        .query(async ({ input: { season } }) => {
            return await getLessonsBySeason(season)
        })
});