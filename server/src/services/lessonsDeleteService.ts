import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import { Season } from "./lessonsQueryService.js";
import { Lesson } from "../types/lesson.js";
import { Reward } from "../types/reward.js";
import { deleteImage, deleteImages } from "../utils/deleteImage.js";
import {
    TimelineOutput,
    checkDocExists,
    findTimelineDoc
} from "./timelineService.js";
import { z } from "zod";

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
    const rewardDoc = await getRewardDoc(rewardRef);
    const { thumbnail } = rewardDoc.data() as Reward;

    await deleteImage(thumbnail);
    await deleteReward(rewardRef);
}

async function deleteReward(
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

async function getRewardDoc(
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

async function deleteTimelineData(
    season: string,
    lessonRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) {
    const timelineDoc = await findTimelineDoc(season);
    checkDocExists(timelineDoc);

    const { holidays } = timelineDoc.data() as TimelineOutput;
    const holidayIndex = holidays.findIndex((holiday) => {
        const holidayLessonRef = holiday.lessonRef as FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
        return holidayLessonRef.id === lessonRef.id
    });

    if (holidayIndex === -1) return;
    const { thumbnail } = holidays[holidayIndex];
    await deleteImage(thumbnail);

    const updatedHolidays = [...holidays];
    updatedHolidays.splice(holidayIndex, 1);
    await updateHolidays(timelineDoc, updatedHolidays);
}

async function updateHolidays(
    timelineDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
    updatedHolidays: TimelineOutput["holidays"]
) {
    await timelineDoc.ref.update({ holidays: updatedHolidays });
}
