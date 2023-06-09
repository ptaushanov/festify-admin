import { z } from 'zod';
import { router } from '../trpc.js';
import protectedProcedure from '../procedures/protectedProcedure.js';
import { adminDB } from '../firebase-admin.js';
import { TRPCError } from '@trpc/server';
import { clientStorage } from '../firebase-client.js';
import { deleteObject, ref, uploadString, getDownloadURL } from "firebase/storage"
import { randomUUID } from 'crypto';

const timelineInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
});

const timelineOutputSchema = z.object({
    holidays: z.array(
        z.object({
            celebrated_on: z.string(),
            name: z.string(),
            thumbnail: z.string(),
            lessonRef: z.any().optional(),
        })
    )
})

const holidayInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    index: z.number(),
    holiday: z.object({
        celebrated_on: z.string().optional(),
        thumbnail: z.string().optional()
    })
});

type TimelineOutput = z.infer<typeof timelineOutputSchema>;

export const timelineRouter = router({
    getSeasonTimeline: protectedProcedure
        .input(timelineInputSchema)
        .output(timelineOutputSchema)
        .query(async ({ input: { season } }) => {
            const timelineDoc = await adminDB.collection('seasons_timeline')
                .doc(season)
                .get()

            if (!timelineDoc.exists) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Timeline not found',
                });
            }

            return timelineDoc.data() as TimelineOutput
        }),

    updateHoliday: protectedProcedure
        .input(holidayInputSchema)
        .mutation(async ({ input: { season, index, holiday } }) => {
            let timelineDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;

            try {
                timelineDoc = await adminDB.collection('seasons_timeline')
                    .doc(season)
                    .get()
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to get timeline',
                });
            }

            if (!timelineDoc.exists) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Timeline not found',
                });
            }

            // TODO: replace the thumbnail and update holiday
            const selectedHoliday = timelineDoc.data()?.holidays[index]
            if (!selectedHoliday) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Holiday not found',
                });
            }

            const { thumbnail: oldThumbnail }: { thumbnail: string | null }
                = selectedHoliday

            // Delete old thumbnail if it exists
            console.log(oldThumbnail)
            if (oldThumbnail) {
                try {
                    const thumbnailRef = ref(clientStorage, oldThumbnail)
                    await deleteObject(thumbnailRef)
                } catch (error) {
                    if (error instanceof Error && "code" in error) {
                        if (error.code !== 'storage/object-not-found') {
                            throw new TRPCError({
                                code: 'INTERNAL_SERVER_ERROR',
                                message: 'Failed to delete old thumbnail',
                            });
                        }
                    }
                }
            }

            const uploadPath = `images/lessons/${season}/${randomUUID()}}`
            const uploadRef = ref(clientStorage, uploadPath)

            if (!holiday.thumbnail) throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Thumbnail is required',
            });

            const uploadTask = await uploadString(uploadRef, holiday.thumbnail, 'data_url')
            const downloadURL = await getDownloadURL(uploadTask.ref)

            const updatedHoliday = {
                ...selectedHoliday,
                thumbnail: downloadURL,
            }

            if (holiday.celebrated_on)
                updatedHoliday.celebrated_on = holiday.celebrated_on

            const updatedHolidays = timelineDoc.data()?.holidays
                .map((holiday: any, id: number) => {
                    if (id === index) return updatedHoliday
                    return holiday
                })

            try {
                await timelineDoc.ref.update({ holidays: updatedHolidays })
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update holiday',
                });
            }

            return { message: 'Holiday updated successfully' }
        })
});