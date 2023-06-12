import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { Reward } from "../types/reward.js";
import { createDownloadUrl } from "../utils/createImageDownload.js";
import { deleteImage } from "../utils/deleteImage.js";

export const viewRewardOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
});

export const viewRewardsOutputSchema = z.array(viewRewardOutputSchema);

export const updateRewardInputSchema = z.object({
    id: z.string(),
    reward: z.object({
        name: z.string(),
        thumbnail: z.string(),
    })
});

export type ViewRewardOutput = z.infer<typeof viewRewardOutputSchema>;
export type ViewRewardsOutput = z.infer<typeof viewRewardsOutputSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardInputSchema>;

export async function getRewards() {
    const rewardsSnapshot = await adminDB.collection("rewards").get();
    const rewards = rewardsSnapshot.docs.map(rewardDoc => {
        const reward = rewardDoc.data() as Reward;
        return { id: rewardDoc.id, ...reward };
    })

    return rewards;
}

export async function getRewardById(rewardId: string) {
    const rewardRef = adminDB.collection("rewards").doc(rewardId);
    const rewardDoc = await getRewardData(rewardRef);
    checkRewardExists(rewardDoc);
    return rewardDoc.data() as ViewRewardOutput;
}
export async function createReward({ name, thumbnail }: Reward) {
    const uploadPath = "images/rewards"
    const thumbnailURL = await createDownloadUrl(uploadPath, thumbnail);

    const rewardCollection = adminDB.collection("rewards")
    const reward: Reward = { name, thumbnail: thumbnailURL };
    const rewardDoc = await createRewardDoc(rewardCollection, reward);

    return { message: "Reward created successfully", doc: rewardDoc };
}
export async function updateRewardById(rewardId: string, { name, thumbnail }: Reward) {
    const rewardRef = adminDB.collection("rewards").doc(rewardId);
    const rewardDoc = await getRewardData(rewardRef);
    checkRewardExists(rewardDoc);

    const { thumbnail: oldThumbnail } = rewardDoc.data() as Reward;
    const uploadPath = "images/rewards"

    const thumbnailURL = await createDownloadUrl(uploadPath, thumbnail);
    if (oldThumbnail !== thumbnailURL) { await deleteImage(oldThumbnail) }

    const reward: Reward = { name, thumbnail: thumbnailURL };
    await updateRewardDoc(rewardRef, reward);
    return { message: "Reward updated successfully" };
}

export async function deleteRewardById(rewardId: string) {
    const rewardRef = adminDB.collection("rewards").doc(rewardId);
    const rewardDoc = await getRewardData(rewardRef);
    checkRewardExists(rewardDoc);

    const { thumbnail } = rewardDoc.data() as Reward;
    await deleteImage(thumbnail);
    await deleteRewardDoc(rewardRef);
    return { message: "Reward deleted successfully" };
}

async function createRewardDoc(
    rewardCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    reward: Reward
) {
    try {
        return await rewardCollection.add(reward);
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create reward",
        });
    }
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