import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import { Season } from "./lessonsQueryService.js";
import { Lesson } from "../types/lesson.js";
import { Reward } from "../types/reward.js";
import { deleteImage, deleteImages } from "../utils/deleteImage.js";
import { deleteTimelineData } from "./timelineService.js";
import { z } from "zod";
import { deleteRewardDoc, getRewardData } from "./rewardService.js";

export const deleteLessonInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string()
});

export type DeleteLessonInput = z.infer<typeof deleteLessonInputSchema>;

export const deleteLesson = async (season: Season, lessonId: string) => {
    const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
    const seasonLessons = seasonDoc.collection("lessons")
    const lessonRef = seasonLessons.doc(lessonId)

    const lessonDoc = await getLessonData(lessonRef)
    const { content, reward } = lessonDoc.data() as Lesson

    const imageURLs = extractImageLinksFromPages(content)
    await deleteImages(imageURLs)
    await deleteRewardData(reward);
    await deleteTimelineData(season, lessonRef);

    await deleteLessonDoc(seasonLessons, lessonId);
    return { message: 'Lesson was deleted successfully' }
}
async function deleteRewardData(reward: unknown) {
    if (!reward) return;
    const rewardRef = reward as FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
    const rewardDoc = await getRewardData(rewardRef);
    const { thumbnail } = rewardDoc.data() as Reward;

    await deleteImage(thumbnail);
    await deleteRewardDoc(rewardRef);
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
    lessonRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) {
    try {
        return await lessonRef.get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed find the lesson",
        });
    }
}
