import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminDB } from "../firebase-admin";

export const viewRewardOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
});

export const updateRewardInputSchema = z.object({
    id: z.string(),
    reward: z.object({
        name: z.string(),
        thumbnail: z.string(),
    })
});


export type ViewRewardOutput = z.infer<typeof viewRewardOutputSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardInputSchema>;

export async function getRewardById(rewardId: string) {
    const rewardRef = adminDB.collection("rewards").doc(rewardId);
    const rewardDoc = await getRewardData(rewardRef);
    checkRewardExists(rewardDoc);
    return rewardDoc.data() as ViewRewardOutput;
}

export async function updateRewardById(rewardId: string, reward: UpdateRewardInput['reward']) {
    const rewardRef = adminDB.collection("rewards").doc(rewardId);
    const rewardDoc = await getRewardData(rewardRef);
    checkRewardExists(rewardDoc);
    await updateRewardDoc(rewardRef, reward);
    return { message: "Reward updated successfully" };
}

export async function deleteRewardById(rewardId: string) {
    const rewardRef = adminDB.collection("rewards").doc(rewardId);
    const rewardDoc = await getRewardData(rewardRef);
    checkRewardExists(rewardDoc);
    await deleteRewardDoc(rewardRef);
    return { message: "Reward deleted successfully" };
}

export async function getRewardData(
    rewardRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) {
    try {
        return await rewardRef.get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed find the reward for the lesson",
        });
    }
}

export async function deleteRewardDoc(
    rewardRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) {
    try {
        await rewardRef.delete();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed delete the reward for the lesson",
        });
    }
}

export async function updateRewardDoc(
    rewardRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    reward: UpdateRewardInput['reward']
) {
    try {
        await rewardRef.update(reward)
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed delete the reward for the lesson",
        });
    }
}

export function checkRewardExists(
    rewardDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) {
    if (!rewardDoc) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reward not found",
        });
    }
}