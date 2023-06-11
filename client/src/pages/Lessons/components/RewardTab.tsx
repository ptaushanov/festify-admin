import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import trpc from "../../../services/trpc";

type Reward = {
    name: string;
    thumbnail: string;
}

interface QuestionsTabProps {
    season: "spring" | "summer" | "autumn" | "winter";
    lessonId: string;
    reward?: Reward;
}

function RewardTab({ season, lessonId, reward }: QuestionsTabProps
) {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [modifiedReward, setModifiedReward] = useState<Reward | null>(reward ?? null)
    const allowedExtensions = ["jpg", "jpeg", "png"]

    const handleAddReward = () => {
        setModifiedReward({ name: "", thumbnail: "" })
        setIsEditMode(true)
    }

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const thumbnail = event.target.files?.[0]
        if (!modifiedReward || !thumbnail) return

        const fileReader = new FileReader()
        fileReader.readAsDataURL(thumbnail)
        fileReader.addEventListener('load', () => {
            const result = fileReader.result
            if (typeof result === 'string' && result.startsWith('data:image')) {
                setModifiedReward({ ...modifiedReward, thumbnail: result })
            }
        });
    }

    if (!modifiedReward) return (
        <div className="h-60 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-xl font-semibold ">
                No additional reward in this lesson
            </p>
            <p className="text-sm">Click on the button bellow to add one</p>
            <button
                onClick={handleAddReward}
                className="btn shadow-sm mt-4">
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
    )

    const { thumbnail, name } = modifiedReward

    return (
        <div className="p-6 flex flex-col space-y-4">
            {isEditMode ? (
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
                            defaultValue={name}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => null}
                            className="btn hover:btn-error"
                        >
                            Delete
                        </button>
                        <div className="flex space-x-2">
                            <button className="btn btn-neutral">
                                Save
                            </button>
                            <button className="btn"
                                onClick={() => setIsEditMode(false)}>
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
                            <button className="btn" onClick={() => setIsEditMode(true)}>
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