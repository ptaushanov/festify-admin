import { z } from "zod";

export const lessonSchema = z.object({
    holiday_name: z.string(),
    content: z.record(z.string(), z.array(
        z.object({
            type: z.enum(["text", "image"]),
            value: z.string(),
        }),
    )),
    questions: z.array(z.object({
        answer: z.number(),
        choices: z.array(z.string()),
    })),
    reward: z.unknown().optional(),
    xp_reward: z.number(),
    last_for_season: z.boolean().default(false),
});

export type Lesson = z.infer<typeof lessonSchema>;