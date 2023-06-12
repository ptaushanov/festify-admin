import admin from "firebase-admin";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const emailOutputSchema = z.array(z.string())
export type EmailOutput = z.infer<typeof emailOutputSchema>;

export async function searchEmails(searchTerm: string): Promise<EmailOutput> {
    try {
        const emailRecords = await admin.auth().listUsers(1000);
        return emailRecords.users.reduce<string[]>((emails, user) => {
            const validEmail = user.email && user.email.includes(searchTerm)
            if (validEmail) { emails.push(user.email) }
            return emails
        }, [])
    }
    catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Error finding emails"
        })
    }
}