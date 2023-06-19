import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { z } from 'zod';
import {
    viewAdminsOutputSchema,
    getAllAdmins,
    deleteAdmin,
    createAdminInputSchema,
    createAdmin
} from '../services/adminService.js';

export const adminRouter = router({
    getAllAdmins: protectedProcedure
        .output(viewAdminsOutputSchema)
        .query(async () => {
            return await getAllAdmins();
        }),

    deleteAdmin: protectedProcedure
        .input(z.string())
        .mutation(async ({ input: adminId }) => {
            return await deleteAdmin(adminId);
        }),

    createAdmin: protectedProcedure
        .input(createAdminInputSchema)
        .mutation(async ({ input: adminData }) => {
            return await createAdmin(adminData);
        })
});