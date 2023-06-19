import { z } from "zod";
import { adminDB } from "../firebase-admin.js";
import { TRPCError } from "@trpc/server";
import {
    TimelineOutput,
    checkDocExists as checkTimelineDocExists,
    findTimelineDoc,
} from "./timelineService.js";
import { deleteImage } from "../utils/deleteImage.js";
import admin from "firebase-admin";

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

export async function wipeUserData(userId: string) {
    const userDoc = await getUserDoc(userId);
    checkUserDocExists(userDoc);
    const { avatar } = userDoc.data() as { avatar?: string }

    if (avatar) await deleteImage(avatar);
    await updateWithWipedData(userDoc);

    return { message: "User data wiped successfully" }
}

async function updateWithWipedData(
    userDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) {
    try {
        await userDoc.ref.update({
            unlocked_seasons: ["spring"],
            unlocked_lessons: { spring: [0], summer: [0], autumn: [0], winter: [0] },
            completed_lesson: { spring: [], summer: [], autumn: [], winter: [] },
            current_lesson: { index: 0, season: "spring" },
            collected_rewards: [],
            last_reward_claim: 0,
            xp: 0,
            avatar: admin.firestore.FieldValue.delete(),
        });
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to wipe user data",
        });
    }
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
            message: "Failed to find users",
        });
    }
}

export function checkUserDocExists(
    userDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) {
    if (!userDoc.exists) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
        });
    }
}

async function getUserDoc(userId: string) {
    try {
        return await adminDB.collection("users")
            .doc(userId)
            .get();
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to find user",
        });
    }
}

async function findLessonName(currentLesson: { index: number, season: Season }) {
    const { index, season } = currentLesson
    const timelineDoc = await findTimelineDoc(season)
    checkTimelineDocExists(timelineDoc)
    const { holidays } = timelineDoc.data() as TimelineOutput;

    const lessonName = holidays[index].name;
    return lessonName;
}
