import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import admin from 'firebase-admin';
export const viewAdminsOutputSchema = z.array(z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email().optional(),
}));

export const createAdminInputSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(50),
});

export type ViewAdminsOutput = z.infer<typeof viewAdminsOutputSchema>;
export type CreateAdminInput = z.infer<typeof createAdminInputSchema>;

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

export async function createAdmin(adminData: CreateAdminInput) {
    const { username, email, password } = adminData;

    try {
        const { uid } = await admin.auth()
            .createUser({ email, password });

        await adminDB.collection("admins")
            .doc(uid)
            .set({ username });
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create admin",
        });
    }

    return { message: "Admin created successfully" }
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