import { Season } from "./lessonsQueryService.js";
import { adminDB } from "../firebase-admin.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Lesson } from "../types/lesson.js";
import { createDownloadUrl } from "../utils/createImageDownload.js";
import { deleteImage } from "../utils/deleteImage.js";

export const updateGeneralInfoInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string(),
    generalInfo: z.object({
        holiday_name: z.string(),
        xp_reward: z.number(),
        last_for_season: z.boolean()
    })
});

export const updateContentInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string(),
    content: z.record(z.string(), z.array(
        z.object({
            type: z.enum(["text", "image"]),
            value: z.string(),
            oldValue: z.string().optional(),
        }),
    ))
});

export const updateQuestionsInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string(),
    questions: z.array(z.object({
        title: z.string(),
        answer: z.number(),
        choices: z.array(z.string()),
    }))
});

export type UpdateGeneralInput = z.infer<typeof updateGeneralInfoInputSchema>;
export type UpdateContentInput = z.infer<typeof updateContentInputSchema>;
export type UpdateQuestionsInput = z.infer<typeof updateQuestionsInputSchema>;

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

export const updateLessonContent =
    async (season: Season, lessonId: string, content: UpdateContentInput['content']) => {
        const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
        const seasonLessons = seasonDoc.collection("lessons")
        const lessonRef = seasonLessons.doc(lessonId);

        const uploadPath = `images/lessons/${season}`;
        const contentWithImageUrls = await processContentBlocks(content, uploadPath)

        try {
            await lessonRef.update({ content: contentWithImageUrls });
        } catch (error) {
            new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Error updating lesson's content"
            })
        }
    }

export const updateLessonQuestions =
    async (season: Season, lessonId: string, questions: UpdateQuestionsInput['questions']) => {
        const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
        const seasonLessons = seasonDoc.collection("lessons")
        const lessonRef = seasonLessons.doc(lessonId);

        try {
            await lessonRef.update({ questions });
        } catch (error) {
            new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Error updating lesson's questions"
            })
        }
    }

async function processContentBlocks(
    content: UpdateContentInput['content'],
    imageUploadPath: string
) {
    const resultingContent: Lesson['content'] = {}

    for await (const [pageId, pageContent] of Object.entries(content)) {
        const formattedPageId = `page${pageId}`
        resultingContent[formattedPageId] = []
        for await (const contentBlock of pageContent) {
            const { value, type, oldValue } = contentBlock
            let newValue = value

            if (type === "image") {
                if (oldValue) { await deleteImage(oldValue) }
                newValue = await createDownloadUrl(imageUploadPath, value);
            }

            resultingContent[formattedPageId].push({ type, value: newValue })
        }
    }

    return resultingContent
}
