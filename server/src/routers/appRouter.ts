import { router } from '../trpc.js';
import { homeRouter } from './homeRouter.js';
import { lessonRouter } from './lessonsRouter.js';
import { timelineRouter } from './timelineRouter.js';

export const appRouter = router({
    home: homeRouter,
    timeline: timelineRouter,
    lesson: lessonRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;