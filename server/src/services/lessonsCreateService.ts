import admin from "firebase-admin";
import { createDownloadUrl } from "./timelineService.js";
import { Season } from "./lessonsQueryService.js";
import { adminDB } from "../firebase-admin.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const createLessonInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lesson: z.object({
        celebrated_on: z.string(),
        thumbnail: z.string(),
        holiday_name: z.string(),
        xp_reward: z.number(),
        last_for_season: z.boolean()
    })
});

export type CreateLessonInput = z.infer<typeof createLessonInputSchema>;

export const createLesson = async (season: Season, lesson: CreateLessonInput['lesson']) => {
    const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
    const seasonLessons = seasonDoc.collection("lessons")
    const lessonDoc = await addNewLesson(seasonLessons, lesson)

    const { celebrated_on, thumbnail, holiday_name } = lesson;
    const newHoliday = {
        celebrated_on,
        name: holiday_name,
        thumbnail: await createDownloadUrl(season, thumbnail),
        lessonRef: lessonDoc
    };

    await updateHolidays(season, newHoliday);
    return { message: 'Lesson was created successfully' }
}

async function updateHolidays(
    season: Season,
    newHoliday: { celebrated_on: string; thumbnail: string; }
) {
    const timelineDoc = adminDB.collection('seasons_timeline').doc(season)
    try {
        await timelineDoc.update({
            holidays: admin.firestore.FieldValue.arrayUnion(newHoliday),
        });
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update holidays in timeline",
        });
    }
}

async function addNewLesson(
    seasonLessons: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    lesson: CreateLessonInput['lesson']
) {
    try {
        const { holiday_name, xp_reward, last_for_season } = lesson
        return await seasonLessons.add({
            holiday_name,
            content: {},
            questions: [],
            xp_reward,
            last_for_season
        });
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create lesson",
        });
    }
}
