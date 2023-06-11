import { TRPCError } from "@trpc/server";

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