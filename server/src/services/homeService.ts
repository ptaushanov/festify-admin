import admin from "firebase-admin";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminDB } from "../firebase-admin.js";

export const homeStatisticsOutputSchema = z.object({
    totalUsers: z.number(),
    totalLessons: z.number()
});

export type HomeStatisticsOutput = z.infer<typeof homeStatisticsOutputSchema>;

export const getStatistics = async (): Promise<HomeStatisticsOutput> => {
    const totalUsers = await getUsersCount()
    const seasons = ['spring', 'summer', 'autumn', 'winter']
    const totalLessons = await getLessonsCount(seasons)

    return { totalUsers, totalLessons }
}
async function getLessonsCount(seasons: string[]): Promise<number> {
    try {
        const lessonsPerSeason: number[] = await Promise.all(seasons.map(async (season) => {
            const seasonDoc = adminDB.collection(`/seasons_holidays`).doc(season);
            const lessonDocs = await seasonDoc.collection("lessons").listDocuments();
            return lessonDocs.length;
        }));
        return lessonsPerSeason.reduce((acc, curr) => acc + curr, 0);
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Error getting lessons count"
        })
    }
}

async function getUsersCount() {
    try {
        const users = await admin.auth().listUsers();
        return users.users.length;
    }
    catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Error getting users count"
        })
    }
}

