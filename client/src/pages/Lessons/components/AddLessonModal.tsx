import { RefObject, useRef, useState } from 'react'
import trpc from '../../../services/trpc';

interface AddLessonModalProps {
    modalRef: RefObject<HTMLDialogElement>
    season: "spring" | "summer" | "autumn" | "winter";
}

function AddLessonModal({ modalRef, season }: AddLessonModalProps) {
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const allowedExtensions = ["jpg", "jpeg", "png"]

    // const lessonMutation = trpc.timeline.updateHoliday.useMutation()
    // const trpcContext = trpc.useContext()

    const handleResetForm = () => {
        formRef.current?.reset()
        setThumbnail(null)
    }


    const handleAddLesson = () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        const celebratedOn = formData.get("celebrated_on") as string
        const holidayName = formData.get("holiday_name") as string
        const xpReward = formData.get("xp_reward") as string
        const lastForSeason = !!formData.get("last_for_season")

        console.log(celebratedOn, holidayName, xpReward, lastForSeason)
    }

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const thumbnail = event.target.files?.[0]
        if (!thumbnail) return

        const fileReader = new FileReader()
        fileReader.readAsDataURL(thumbnail)
        fileReader.addEventListener('load', () => {
            const result = fileReader.result
            if (typeof result === 'string' && result.startsWith('data:image')) {
                setThumbnail(result)
            }
        });
    }

    return (
        <dialog className="modal" ref={modalRef}>
            <form className="modal-box max-w-4xl w-auto" ref={formRef}>
                <div className="flex items-stretch space-x-2 pt-4 px-4">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-bold text-xl">
                            Create a new lesson
                        </h3>
                        <div className="mt-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Celebrated on
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="celebrated_on"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Holiday name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="holiday_name"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Xp reward
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name='xp_reward'
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label cursor-pointer flex items-center">
                                    <span className="label-text font-semibold">
                                        Last for the season
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="last_for_season"
                                        className="toggle"
                                    />
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Thumbnail
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
                        </div>
                    </div>
                    {thumbnail && <>
                        <div className="divider divider-horizontal"></div>
                        <div className="flex flex-1 justify-center">
                            <div className="avatar w-full">
                                <div className="w-full rounded-md">
                                    <img src={thumbnail} />
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
                <div className="modal-action">
                    <button className="btn btn-neutral" type="button" onClick={handleAddLesson}>
                        Create
                    </button>
                    <button className="btn" formMethod="dialog" onClick={handleResetForm}>
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    )
}

export default AddLessonModal
