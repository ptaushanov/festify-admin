import { Season } from "./lessonsQueryService.js";
import { adminDB } from "../firebase-admin.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Lesson } from "../types/lesson.js";
import { deleteImage, deleteImages } from "../utils/deleteImage.js";
import { Reward } from "../types/reward.js";

export const deleteLessonInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string()
});

export type DeleteLessonInput = z.infer<typeof deleteLessonInputSchema>;

export const deleteLesson = async (season: Season, lessonId: string) => {
    const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
    const seasonLessons = seasonDoc.collection("lessons")
    const lessonDoc = await getLessonData(seasonLessons, lessonId)
    const { content, reward } = lessonDoc.data() as Lesson

    const imageURLs = extractImageLinksFromPages(content)
    await deleteImages(imageURLs)
    await deleteRewardData(reward);

    await deleteLessonDoc(seasonLessons, lessonId);
    return { message: 'Lesson was deleted successfully' }
}
async function deleteRewardData(reward: unknown) {
    if (!reward) return;
    const rewardRef = reward as FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
    const rewardDoc = await getRewardDoc(rewardRef);
    const { thumbnail } = rewardDoc.data() as Reward;

    await deleteImage(thumbnail);
    await deleteReward(rewardRef);
}

async function deleteReward(rewardRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) {
    try {
        await rewardRef.delete();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed delete the reward for the lesson",
        });
    }
}

async function getRewardDoc(rewardRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) {
    try {
        return await rewardRef.get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed find the reward for the lesson",
        });
    }
}

function extractImageLinksFromPages(
    content: Record<string, { value: string; type: "text" | "image"; }[]>
) {
    return Object.values(content)
        .reduce<string[]>((acc, page) => {
            const imageContent: string[] = page
                .filter((item) => item.type === 'image')
                .map((image) => image.value);
            return [...acc, ...imageContent];
        }, []);
}

async function deleteLessonDoc(
    seasonLessons: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    lessonId: string
) {
    await seasonLessons.doc(lessonId).delete();
}

async function getLessonData(
    seasonLessons: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    lessonId: string
) {
    try {
        return await seasonLessons.doc(lessonId).get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed find the lesson",
        });
    }
}
