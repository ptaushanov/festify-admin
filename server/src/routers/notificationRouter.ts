import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { notificationInputSchema, sendNotification } from '../services/notificationService.js';

export const notificationRouter = router({
    sendNotification: protectedProcedure
        .input(notificationInputSchema)
        .mutation(async ({ input: notification }) => {
            return await sendNotification(notification)
        })
});