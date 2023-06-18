import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { getAllUsers, viewUsersOutputSchema } from '../services/userService.js';

export const userRouter = router({
    getAllUsers: protectedProcedure
        .output(viewUsersOutputSchema)
        .query(async () => {
            return await getAllUsers();
        })
});