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

import protectedProcedure from '../procedures/protectedProcedure.js';
import {
    updateGeneralInfoInputSchema,
    updateLessonGeneralInfo,
} from '../services/lessonsUpdateService.js';

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

    deleteLessonById: protectedProcedure
        .input(deleteLessonInputSchema)
        .mutation(async ({ input: { season, lessonId } }) => {
            return await deleteLesson(season, lessonId)
        })
});