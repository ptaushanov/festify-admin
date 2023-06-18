import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import {
    TimelineOutput,
    checkDocExists,
    findTimelineDoc,
} from "./timelineService.js";

type Season = "spring" | "summer" | "autumn" | "winter";

export const viewUsersOutputSchema = z.array(z.object({
    id: z.string(),
    username: z.string(),
    xp: z.number(),
    current_lesson: z.string(),
    avatar: z.string().optional(),
}));

export type ViewUsersOutput = z.infer<typeof viewUsersOutputSchema>;

export async function getAllUsers() {
    const usersSnapshot = await getUserDocs()
    const usersData = await processUsersData(usersSnapshot);
    return usersData;
}

async function processUsersData(
    usersSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) {
    const usersData: ViewUsersOutput = [];
    for (const userDoc of usersSnapshot.docs) {
        const { username, xp, avatar, current_lesson } = userDoc.data();
        const { id } = userDoc;
        const lessonName = await findLessonName(current_lesson);
        usersData.push({
            id, username, xp, avatar,
            current_lesson: lessonName,
        });
    };
    return usersData;
}

async function getUserDocs() {
    try {
        return await adminDB.collection("users").get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get users",
        });
    }
}

async function findLessonName(currentLesson: { index: number, season: Season }) {
    const { index, season } = currentLesson
    const timelineDoc = await findTimelineDoc(season)
    checkDocExists(timelineDoc)
    const { holidays } = timelineDoc.data() as TimelineOutput;

    const lessonName = holidays[index].name;
    return lessonName;
}
