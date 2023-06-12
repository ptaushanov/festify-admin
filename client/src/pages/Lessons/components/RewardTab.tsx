import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import trpc from "../../../services/trpc";

type Reward = {
    id: string;
    name: string;
    thumbnail: string;
}

interface RewardTabProps {
    season: "spring" | "summer" | "autumn" | "winter";
    lessonId: string;
    reward?: Reward;
}

function RewardTab({ season, lessonId, reward }: RewardTabProps
) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [thumbnail, setThumbnail] = useState<string>(reward?.thumbnail ?? '')
    const [name, setName] = useState<string>(reward?.name ?? '')

    const allowedExtensions = ["jpg", "jpeg", "png"]

    const lessonRewardDeleteMutation = trpc.lesson.deleteLessonReward.useMutation()
    const rewardUpdateMutation = trpc.reward.updateRewardById.useMutation()
    const lessonRewardCreateMutation = trpc.lesson.createLessonReward.useMutation()
    const trpcContext = trpc.useContext()

    const handleAddReward = () => {
        const newReward = { name, thumbnail }
        const mutationPayload = { season, lessonId, reward: newReward }

        lessonRewardCreateMutation.mutate(mutationPayload, {
            onSuccess: () => {
                trpcContext.lesson.getLessonById.invalidate({ season, lessonId })
                setIsEditing(false)
            }
        })
    }

    const handleEditReward = () => {
        if (!reward) return

        const newReward = { name, thumbnail }
        rewardUpdateMutation.mutate({ id: reward.id, reward: newReward }, {
            onSuccess: () => {
                trpcContext.lesson.getLessonById.invalidate({ season, lessonId })
                setIsEditing(false)
            }
        })
    }

    const handleDeleteReward = () => {
        if (!reward) return

        const mutationPayload = { season, lessonId, rewardId: reward.id }
        lessonRewardDeleteMutation.mutate(mutationPayload, {
            onSuccess: () => {
                trpcContext.lesson.getLessonById.invalidate({ season, lessonId })
                setIsEditing(false)
            }
        })
    }

    const handleSaveReward = () => {
        if (reward) handleEditReward()
        else handleAddReward()
    }

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newThumbnail = event.target.files?.[0]
        if (!newThumbnail) return

        const fileReader = new FileReader()
        fileReader.readAsDataURL(newThumbnail)
        fileReader.addEventListener('load', () => {
            const result = fileReader.result
            if (typeof result === 'string' && result.startsWith('data:image')) {
                setThumbnail(result)
            }
        });
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value
        setName(newName)
    }

    if (!reward && !isEditing) return (
        <div className="h-60 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-xl font-semibold ">
                No additional reward in this lesson
            </p>
            <p className="text-sm">Click on the button bellow to add one</p>
            <button
                onClick={() => setIsEditing(true)}
                className="btn shadow-sm mt-4">
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
    )

    return (
        <div className="p-6 flex flex-col space-y-4">
            {isEditing ? (
                <div className="flex flex-col space-y-4">
                    <div className="form-control bg-neutral-100 rounded-md py-2 px-4 w-full">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Thumbnail (max 5MB)
                            </span>
                            <span className="label-text-alt">
                                {allowedExtensions.join(", ")}
                            </span>
                        </label>
                        <input
                            type="file"
                            name="thumbnail"
                            accept={allowedExtensions.join(", ")}
                            onChange={handleThumbnailChange}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Reward name
                            </span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button onClick={handleDeleteReward}
                            className="btn hover:btn-error"
                        >
                            Delete
                        </button>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveReward}
                                className="btn btn-neutral"
                            >
                                Save
                            </button>
                            <button className="btn"
                                onClick={() => setIsEditing(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>) : (
                <div className="card card-side w-96 bg-base-100 shadow-md self-center">
                    <figure>
                        <img src={thumbnail ?? undefined} />
                    </figure>
                    <div className="card-body flex">
                        <h2 className="card-title text-2xl">
                            {name}
                        </h2>
                        <div className="card-actions justify-end">
                            <button className="btn" onClick={() => setIsEditing(true)}>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>)
            }
        </div>
    )
}

export default RewardTab