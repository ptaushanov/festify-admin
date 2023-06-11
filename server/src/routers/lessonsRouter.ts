import { router } from '../trpc.js';
import {
    getLessonById,
    getLessonByIdInputSchema,
    getLessonByIdOutputSchema,
    getLessonsBySeason,
    viewLessonsInputSchema,
    viewLessonsOutputSchema
} from '../services/lessonsQueryService.js';

import {
    createLesson,
    createLessonInputSchema
} from '../services/lessonsCreateService.js';

import {
    deleteLesson,
    deleteLessonInputSchema
} from '../services/lessonsDeleteService.js';

import {
    createLessonReward,
    createRewardInputSchema,
    deleteLessonReward,
    deleteRewardInputSchema,
    updateContentInputSchema,
    updateGeneralInfoInputSchema,
    updateLessonContent,
    updateLessonGeneralInfo,
    updateLessonQuestions,
    updateQuestionsInputSchema,
} from '../services/lessonsUpdateService.js';

import protectedProcedure from '../procedures/protectedProcedure.js';
export const lessonRouter = router({
    getLessonsBySeason: protectedProcedure
        .input(viewLessonsInputSchema)
        .output(viewLessonsOutputSchema)
        .query(async ({ input: { season } }) => {
            return await getLessonsBySeason(season)
        }),

    getLessonById: protectedProcedure
        .input(getLessonByIdInputSchema)
        .output(getLessonByIdOutputSchema)
        .query(async ({ input: { season, lessonId } }) => {
            return await getLessonById(season, lessonId)
        }),

    createLesson: protectedProcedure
        .input(createLessonInputSchema)
        .mutation(async ({ input: { season, lesson } }) => {
            return await createLesson(season, lesson)
        }),

    updateLessonGeneralInfo: protectedProcedure
        .input(updateGeneralInfoInputSchema)
        .mutation(async ({ input: { season, lessonId, generalInfo } }) => {
            return await updateLessonGeneralInfo(season, lessonId, generalInfo)
        }),

    updateLessonContent: protectedProcedure
        .input(updateContentInputSchema)
        .mutation(async ({ input: { season, lessonId, content } }) => {
            return await updateLessonContent(season, lessonId, content)
        }),

    updateLessonQuestions: protectedProcedure
        .input(updateQuestionsInputSchema)
        .mutation(async ({ input: { season, lessonId, questions } }) => {
            return await updateLessonQuestions(season, lessonId, questions)
        }),

    createLessonReward: protectedProcedure
        .input(createRewardInputSchema)
        .mutation(async ({ input: { season, lessonId, reward } }) => {
            return await createLessonReward(season, lessonId, reward)
        }),

    deleteLessonReward: protectedProcedure
        .input(deleteRewardInputSchema)
        .mutation(async ({ input: { season, lessonId, rewardId } }) => {
            return await deleteLessonReward(season, lessonId, rewardId)
        }),

    deleteLessonById: protectedProcedure
        .input(deleteLessonInputSchema)
        .mutation(async ({ input: { season, lessonId } }) => {
            return await deleteLesson(season, lessonId)
        })
});