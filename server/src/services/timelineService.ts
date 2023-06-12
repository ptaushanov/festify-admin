import { z } from 'zod';
import { adminDB } from '../firebase-admin.js';
import { TRPCError } from '@trpc/server';
import { deleteImage } from '../utils/deleteImage.js';
import { createDownloadUrl } from '../utils/createImageDownload.js';

export const timelineInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
});

export const timelineOutputSchema = z.object({
    holidays: z.array(
        z.object({
            celebrated_on: z.string(),
            name: z.string(),
            thumbnail: z.string(),
            lessonRef: z.unknown().optional(),
        })
    )
})

export const holidayInputSchema = z.object({
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
    index: z.number(),
    holiday: z.object({
        celebrated_on: z.string().optional(),
        thumbnail: z.string().optional()
    })
});

export type TimelineOutput = z.infer<typeof timelineOutputSchema>;
export type Season = z.infer<typeof timelineInputSchema>['season'];
export type HolidayInput = z.infer<typeof holidayInputSchema>['holiday'];

export const getSeasonTimeline = async (season: Season) => {
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
}

export const updateHoliday = async (season: Season, index: number, holiday: HolidayInput) => {
    const timelineDoc = await findTimelineDoc(season);
    checkDocExists(timelineDoc);
    const { holidays } = timelineDoc.data() as TimelineOutput

    const { celebrated_on, thumbnail } = holiday
    const oldHoliday = holidays[index]
    const oldThumbnailURL = oldHoliday.thumbnail

    // If a new thumbnail is provided, delete the old one
    let downloadURL = oldThumbnailURL
    if (thumbnail && oldThumbnailURL) {
        await deleteImage(oldThumbnailURL);
        const uploadPath = `images/lessons/${season}`;
        downloadURL = await createDownloadUrl(uploadPath, thumbnail);
    }

    // Update the holiday data inside the timeline
    const updatedHoliday = updateHolidayData(oldHoliday, downloadURL, celebrated_on);
    const updatedHolidays = updateHolidaysData(holidays, index, updatedHoliday)

    await updateHolidaysInTimeline(timelineDoc, updatedHolidays);
    return { message: 'Holiday updated successfully' }
}

export async function updateHolidaysInTimeline(
    timelineDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
    updatedHolidays: TimelineOutput["holidays"]
) {
    try {
        await timelineDoc.ref.update({ holidays: updatedHolidays });
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update holiday',
        });
    }
}

export function updateHolidaysData(
    holidays: TimelineOutput["holidays"],
    index: number,
    updatedHoliday: TimelineOutput["holidays"][number]) {
    return holidays
        .map((holiday: any, id: number) => {
            if (id === index)
                return updatedHoliday;
            return holiday;
        });
}

function updateHolidayData(
    oldHoliday: TimelineOutput["holidays"][number],
    downloadURL: string,
    celebrated_on: string | undefined
) {
    const updatedHoliday = {
        ...oldHoliday,
        thumbnail: downloadURL,
    };

    if (celebrated_on) { updatedHoliday.celebrated_on = celebrated_on; }
    return updatedHoliday;
}

export async function findTimelineDoc(season: string) {
    let timelineDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
    try {
        timelineDoc = await adminDB.collection('seasons_timeline')
            .doc(season)
            .get();
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get timeline',
        });
    }
    return timelineDoc;
}

export function checkDocExists(
    timelineDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) {
    if (!timelineDoc.exists) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Timeline not found',
        });
    }
}

export async function deleteTimelineData(
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