import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { emailAddressesOutputSchema, emailInputSchema, searchEmailAddresses, sendEmail } from '../services/emailService.js';
import { z } from 'zod';

export const emailRouter = router({
    searchEmailAddresses: protectedProcedure
        .input(z.string())
        .output(emailAddressesOutputSchema)
        .query(async ({ input: searchTerm }) => {
            return await searchEmailAddresses(searchTerm)
        }),

    sendEmail: protectedProcedure
        .input(emailInputSchema)
        .mutation(async ({ input: emailInput }) => {
            return await sendEmail(emailInput)
        })
});