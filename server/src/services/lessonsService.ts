import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";

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

export type ViewLessonsInput = z.infer<typeof viewLessonsInputSchema>;
export type ViewLessonsOutput = z.infer<typeof viewLessonsOutputSchema>;
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