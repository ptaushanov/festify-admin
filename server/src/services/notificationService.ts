import expo from '../expo.js';
import { z } from 'zod';
import { adminDB } from '../firebase-admin.js';
import {
    Expo,
    ExpoPushMessage,
    ExpoPushTicket,
    ExpoPushSuccessTicket,
    ExpoPushReceipt
} from 'expo-server-sdk';
import { TRPCError } from '@trpc/server';

export const notificationInputSchema = z.object({
    title: z.string(),
    body: z.string().min(1).max(255)
});

export type NotificationInput = z.infer<typeof notificationInputSchema>;

export const sendNotification = async ({ title, body }: NotificationInput) => {
    const usersSnapshot = await adminDB.collection('users').get();
    const expoPushTokens: string[] = extractNotificationTokens(usersSnapshot);
    const messages: ExpoPushMessage[] = createExpoPushMessages(expoPushTokens, title, body);

    const chunks: ExpoPushMessage[][] = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = await chunkTickets(chunks);

    const receiptIds: string[] = [];
    for (const ticket of tickets) {
        if (!("id" in ticket)) continue;
        const successTicket = ticket as ExpoPushSuccessTicket;
        receiptIds.push(successTicket.id);
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    await checkReceipts(receiptIdChunks);

    return { message: "Notifications sent successfully" };
}

async function checkReceipts(receiptIdChunks: string[][]) {
    for (const chunk of receiptIdChunks) {
        try {
            const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            checkReceiptStatuses(receipts);
        } catch (error) {
            console.error(error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error sending notifications',
            });
        }
    }
}

function checkReceiptStatuses(receipts: { [id: string]: ExpoPushReceipt }) {
    for (const receiptId in receipts) {
        const { status, details } = receipts[receiptId];
        if (status === 'error') {
            if (details && details.error) {
                console.error(`The error code is ${details.error}`);
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error sending notifications',
            });
        }
    }
}

async function chunkTickets(chunks: ExpoPushMessage[][]) {
    const tickets: ExpoPushTicket[] = [];
    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error sending notifications',
            });
        }
    }
    return tickets;
}

function createExpoPushMessages(expoPushTokens: string[], title: string, body: string) {
    const messages: ExpoPushMessage[] = [];
    for (const pushToken of expoPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({ to: pushToken, sound: 'default', body, title });
    }
    return messages;
}

function extractNotificationTokens(
    usersSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
): string[] {
    return usersSnapshot.docs.reduce<string[]>((tokens, userDoc) => {
        if (!userDoc.exists) return tokens;

        const token = userDoc.data().notification_token;
        if (token) tokens.push(token);

        return tokens;
    }, []);
}