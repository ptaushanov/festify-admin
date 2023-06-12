import { Season } from "./lessonsQueryService.js";
import { adminDB } from "../firebase-admin.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Lesson } from "../types/lesson.js";
import { createDownloadUrl } from "../utils/createImageDownload.js";
import { deleteImage } from "../utils/deleteImage.js";
import { Reward } from "../types/reward.js";
import { createReward, deleteRewardById } from "./rewardService.js";
import admin from 'firebase-admin';
import {
    TimelineOutput,
    checkDocExists,
    findTimelineDoc,
    updateHolidaysData,
    updateHolidaysInTimeline
} from "./timelineService.js";

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

export const createRewardInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string(),
    reward: z.object({
        name: z.string(),
        thumbnail: z.string(),
    })
});

export const deleteRewardInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    lessonId: z.string(),
    rewardId: z.string()
});

export type UpdateGeneralInput = z.infer<typeof updateGeneralInfoInputSchema>;
export type UpdateContentInput = z.infer<typeof updateContentInputSchema>;
export type UpdateQuestionsInput = z.infer<typeof updateQuestionsInputSchema>;
export type CreateRewardInput = z.infer<typeof createRewardInputSchema>;
export type DeleteRewardInput = z.infer<typeof deleteRewardInputSchema>;

export const updateLessonGeneralInfo =
    async (season: Season, lessonId: string, generalInfo: UpdateGeneralInput['generalInfo']) => {
        const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
        const seasonLessons = seasonDoc.collection("lessons")
        const lessonRef = seasonLessons.doc(lessonId);

        await updateLessonDoc(lessonRef, generalInfo);
        await updateHolidaysDoc(season, lessonRef, generalInfo.holiday_name);

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

export const createLessonReward =
    async (season: Season, lessonId: string, reward: Reward) => {
        const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
        const seasonLessons = seasonDoc.collection("lessons")
        const lessonRef = seasonLessons.doc(lessonId);

        const { doc: rewardDoc } = await createReward(reward)

        try {
            await lessonRef.update({ reward: rewardDoc });
        } catch (error) {
            new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Error updating lesson's questions"
            })
        }
    }

export const deleteLessonReward =
    async (season: Season, lessonId: string, rewardId: string) => {
        const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season)
        const seasonLessons = seasonDoc.collection("lessons")
        const lessonRef = seasonLessons.doc(lessonId);

        await deleteRewardById(rewardId)

        try {
            await lessonRef.update({ reward: admin.firestore.FieldValue.delete() });
        } catch (error) {
            new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Error updating lesson's questions"
            })
        }
    }

async function updateLessonDoc(
    lessonRef: admin.firestore.DocumentReference<admin.firestore.DocumentData>,
    generalInfo: UpdateGeneralInput['generalInfo']) {
    try {
        await lessonRef.update(generalInfo);
    } catch (error) {
        new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Error updating lesson's general info"
        });
    }
}

async function updateHolidaysDoc(
    season: Season,
    lessonRef: admin.firestore.DocumentReference<admin.firestore.DocumentData>,
    holiday_name: string
) {
    const timelineDoc = await findTimelineDoc(season)
    checkDocExists(timelineDoc)
    const { holidays } = timelineDoc.data() as TimelineOutput
    const holidayIndex = holidays.findIndex(holiday => {
        const { lessonRef: { id } } = holiday as { lessonRef: { id: string } }
        return id === lessonRef.id
    })

    if (holidayIndex === -1) throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Holiday ${holiday_name} does not exist`
    })

    const newHoliday = { ...holidays[holidayIndex] }
    newHoliday.name = holiday_name

    const updatedHolidays = updateHolidaysData(holidays, holidayIndex, newHoliday)
    await updateHolidaysInTimeline(timelineDoc, updatedHolidays)
}

async function processContentBlocks(
    content: UpdateContentInput['content'],
    imageUploadPath: string
) {
    const resultingContent: Lesson['content'] = {}

    for await (const [pageId, pageContent] of Object.entries(content)) {
        const formattedPageId = pageId.includes("page") ? pageId : `page${pageId}`
        resultingContent[formattedPageId] = []
        for await (const contentBlock of pageContent) {
            const { value, type, oldValue } = contentBlock
            const newValue = await updateIfImageValue(type, imageUploadPath, value, oldValue);
            resultingContent[formattedPageId].push({ type, value: newValue })
        }
    }
    return resultingContent
}

async function updateIfImageValue(
    type: string,
    imageUploadPath: string,
    value: string,
    oldValue: string | undefined
) {
    let newValue = value;
    if (type === "image") {
        newValue = await createDownloadUrl(imageUploadPath, value);
        if (oldValue && oldValue !== newValue) {
            await deleteImage(oldValue);
        }
    }
    return newValue;
}
