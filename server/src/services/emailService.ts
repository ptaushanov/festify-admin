import admin from "firebase-admin";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import resend from "../resend.js";

export const emailAddressesOutputSchema = z.array(z.string())
export const emailInputSchema = z.object({
    to: z.string().email().or(z.enum(['all'])),
    subject: z.string(),
    body: z.string(),
})
export type EmailAddressesOutput = z.infer<typeof emailAddressesOutputSchema>;
export type EmailInput = z.infer<typeof emailInputSchema>;

export async function searchEmailAddresses(searchTerm: string) {
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

export async function getAllEmailAddresses() {
    try {
        const emailRecords = await admin.auth().listUsers(1000);
        return emailRecords.users.reduce<string[]>((emails, user) => {
            if (user.email) { emails.push(user.email) }
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

export async function sendEmail({ to, body, subject }: EmailInput) {
    let emailTo: string[] = [to]
    if (to === 'all') emailTo = await getAllEmailAddresses()

    try {
        resend.emails.send({
            to: emailTo,
            from: "festify@resend.dev",
            subject,
            text: body,
        })
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Error sending email"
        })
    }

    return { message: "Email sent successfully" }
}   