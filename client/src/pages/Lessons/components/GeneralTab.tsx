import { useState } from "react";
import trpc from '../../../services/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

interface GeneralTabProps {
    season: "spring" | "summer" | "autumn" | "winter";
    lessonId: string;
    holidayName?: string;
    xpReward?: number;
    lastForSeason?: boolean;
}

const updateLessonInfoSchema = z.object({
    holiday_name: z.string()
        .nonempty(),
    xp_reward: z.number()
        .int()
        .min(0)
        .max(1000),
    last_for_season: z.boolean()
});

type LessonUpdateType = z.infer<typeof updateLessonInfoSchema>;

function GeneralTab({
    season,
    lessonId,
    holidayName = '',
    lastForSeason = false,
    xpReward = 0
}: GeneralTabProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const lessonMutation = trpc.lesson.updateLessonGeneralInfo.useMutation()
    const trpcContext = trpc.useContext()

    const {
        register, reset, handleSubmit,
        formState: { errors }
    } = useForm<LessonUpdateType>({
        resolver: zodResolver(updateLessonInfoSchema),
    });

    const onSubmit = async (generalInfo: LessonUpdateType) => {
        lessonMutation.mutate({ season, lessonId, generalInfo }, {
            onSuccess: () => {
                trpcContext.lesson.getLessonById.invalidate({ season })
                setIsEditing(false)
            }
        })
    };

    const handleReset = () => {
        reset()
        setIsEditing(!isEditing)
    }

    return (
        <form className="py-2 px-4 flex flex-col space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex space-x-4">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">
                            Holiday name
                        </span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered"
                        disabled={!isEditing}
                        defaultValue={holidayName}
                        {...register("holiday_name")}
                    />
                    <label className={`label ${!errors.holiday_name ? 'hidden' : ''}`}>
                        <span className="label-text-alt text-error font-semibold">
                            {errors.holiday_name?.message}
                        </span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">
                            Xp reward
                        </span>
                    </label>
                    <input
                        type="number"
                        className="input input-bordered"
                        disabled={!isEditing}
                        defaultValue={xpReward}
                        {...register("xp_reward", { valueAsNumber: true })}
                    />
                    <label className={`label ${!errors.xp_reward ? 'hidden' : ''}`}>
                        <span className="label-text-alt text-error font-semibold">
                            {errors.xp_reward?.message}
                        </span>
                    </label>
                </div>
            </div>
            <div className="flex">
                <div className="form-control self-start">
                    <label className="label cursor-pointer flex items-center space-x-4">
                        <span className="label-text font-semibold">
                            Last for the season
                        </span>
                        <input
                            type="checkbox"
                            className="toggle"
                            disabled={!isEditing}
                            defaultChecked={lastForSeason}
                            {...register("last_for_season")}
                        />
                    </label>
                </div>
                <div className="flex flex-1 justify-end">
                    {isEditing && (
                        <button type="submit" className="btn btn-neutral mr-2">
                            Save
                        </button>
                    )}
                    <button type="button" className="btn" onClick={handleReset}>
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default GeneralTab