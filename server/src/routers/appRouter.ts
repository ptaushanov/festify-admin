import { router } from '../trpc.js';
import { emailRouter } from './emailRouter.js';
import { homeRouter } from './homeRouter.js';
import { lessonRouter } from './lessonsRouter.js';
import { notificationRouter } from './notificationRouter.js';
import { rewardRouter } from './rewardRouter.js';
import { timelineRouter } from './timelineRouter.js';

export const appRouter = router({
    home: homeRouter,
    timeline: timelineRouter,
    lesson: lessonRouter,
    reward: rewardRouter,
    email: emailRouter,
    notification: notificationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;