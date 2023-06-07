import { router } from '../trpc.js';
import { timelineRouter } from './timelineRouter.js';

export const appRouter = router({
    timeline: timelineRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;