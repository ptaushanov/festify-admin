import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { emailOutputSchema, searchEmails } from '../services/emailService.js';
import { z } from 'zod';

export const emailRouter = router({
    searchEmails: protectedProcedure
        .input(z.string())
        .output(emailOutputSchema)
        .query(async ({ input: searchTerm }) => {
            return await searchEmails(searchTerm)
        })
});