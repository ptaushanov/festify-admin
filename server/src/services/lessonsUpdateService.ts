import { Season } from "./lessonsQueryService.js";
import { adminDB } from "../firebase-admin.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const updateGeneralInfoInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string(),
    generalInfo: z.object({
        holiday_name: z.string(),
        xp_reward: z.number(),
        last_for_season: z.boolean()
    })
});

export type UpdateGeneralInput = z.infer<typeof updateGeneralInfoInputSchema>;

export const updateLessonGeneralInfo =
    async (season: Season, lessonId: string, generalInfo: UpdateGeneralInput['generalInfo']) => {
        const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
        const seasonLessons = seasonDoc.collection("lessons")
        const lessonRef = seasonLessons.doc(lessonId);

        try {
            await lessonRef.update(generalInfo);
        } catch (error) {
            new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Error updating lesson's general info"
            })
        }

        return { message: 'Lesson was updated successfully' }
    }