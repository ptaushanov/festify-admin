import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import admin from 'firebase-admin';
export const viewAdminsOutputSchema = z.array(z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email().optional(),
}));

export type ViewAdminsOutput = z.infer<typeof viewAdminsOutputSchema>;

export async function getAllAdmins() {
    const adminsSnapshot = await getAdminDocs()
    const admins: ViewAdminsOutput = [];

    for (const adminDoc of adminsSnapshot.docs) {
        const { username } = adminDoc.data() as { username: string };
        const { id } = adminDoc;

        const { email } = await getAdminAuthData(id);
        admins.push({ id, username, email });
    }

    return admins;
}

export async function deleteAdmin(adminId: string) {
    const adminDoc = adminDB.collection("admins").doc(adminId);

    try {
        await adminDoc.delete();
        await admin.auth().deleteUser(adminDoc.id);
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete user",
        });
    }

    return { message: "Admin deleted successfully" }
}


async function getAdminAuthData(id: string) {
    try {
        return await admin.auth().getUser(id);
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to find admin",
        });
    }
}

async function getAdminDocs() {
    try {
        return await adminDB.collection("admins").get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to find admins",
        });
    }
}