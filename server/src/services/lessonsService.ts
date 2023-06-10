import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import admin from "firebase-admin";
import { createDownloadUrl } from "./timelineService.js";

export const viewLessonsInputSchema = z.object({
    season: z.enum(["spring", "summer", "autumn", "winter"]),
});

export const viewLessonsOutputSchema = z.object({
    lessons: z.array(z.object({
        id: z.string(),
        holiday_name: z.string(),
        xp_reward: z.number(),
        page_count: z.number(),
        question_count: z.number(),
        has_reward: z.boolean(),
    }))
});

export const getLessonByIdInputSchema = z.object({
    season: z.enum(["spring", "summer", "autumn", "winter"]),
    lessonId: z.string(),
});

export const getLessonByIdOutputSchema = z.object({
    id: z.string(),
    holiday_name: z.string(),
    content: z.record(z.string(), z.array(
        z.object({
            type: z.enum(["text", "image"]),
            value: z.string(),
        }),
    )),
    questions: z.array(z.object({
        answer: z.number(),
        choices: z.array(z.string()),
    })),
    reward: z.unknown().optional(),
    xp_reward: z.number(),
    last_for_season: z.boolean().default(false),
});

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

export type ViewLessonsInput = z.infer<typeof viewLessonsInputSchema>;
export type ViewLessonsOutput = z.infer<typeof viewLessonsOutputSchema>;
export type LessonByIdInput = z.infer<typeof getLessonByIdInputSchema>;
export type LessonByIdOutput = z.infer<typeof getLessonByIdOutputSchema>;
export type CreateLessonInput = z.infer<typeof createLessonInputSchema>;
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export const getLessonsBySeason = async (season: Season) => {
    const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
    const seasonLessons = seasonDoc.collection("lessons")
    const seasonLessonsSnapshot = await seasonLessons.get()
    const lessons = seasonLessonsSnapshot.docs.map((lessonDoc) => {
        const id = lessonDoc.id
        const lessonData = lessonDoc.data()
        const { holiday_name, xp_reward, content, questions, reward } = lessonData
        const isContentObject = typeof content === 'object'

        return {
            id,
            holiday_name,
            xp_reward,
            page_count: isContentObject ? Object.keys(content).length : 0,
            question_count: questions?.length ?? 0,
            has_reward: reward !== undefined,
        }
    })

    return { lessons }

}
export const getLessonById = async (season: Season, lessonId: string) => {
    const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
    const seasonLessons = seasonDoc.collection("lessons")

    const lessonDoc = await getLessonDocById(seasonLessons, lessonId);
    const lessonData = lessonDoc.data()
    const id = lessonDoc.id

    return { id, ...lessonData } as LessonByIdOutput
}

async function getLessonDocById(
    seasonLessons: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    lessonId: string
) {
    const lessonDoc = await seasonLessons.doc(lessonId).get();
    if (!lessonDoc.exists) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Lesson not found",
        });
    }
    return lessonDoc;
}

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
