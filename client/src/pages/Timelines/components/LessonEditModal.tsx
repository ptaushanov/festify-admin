import { RefObject, useRef, useState } from 'react'

type Holiday = {
    id: number;
    celebrated_on: string;
    name: string;
    thumbnail: string;
}

interface LessonEditModalProps {
    modalRef: RefObject<HTMLDialogElement>
    holiday: Holiday | null
}

function LessonEditModal({ modalRef, holiday }: LessonEditModalProps) {
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const allowedExtensions = ["jpg", "jpeg", "png"]

    const handleEditLesson = () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        const celebratedOn = formData.get("celebrated_on") as string

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
            <form className="modal-box max-w-2xl" ref={formRef}>
                <div className="flex items-stretch space-x-2 pt-4 px-4">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-bold text-xl">Edit holiday</h3>
                        <div className="mt-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Celebrated on
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    defaultValue={holiday?.celebrated_on}
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
                                    name="name"
                                    className="input input-bordered w-full input-disabled"
                                    defaultValue={holiday?.name}
                                />
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
                    <div className="divider divider-horizontal"></div>
                    <div className="flex flex-1 justify-center">
                        <div className="avatar w-full">
                            <div className="w-full rounded-md">
                                <img src={thumbnail ?? holiday?.thumbnail} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn btn-neutral" type="button" onClick={handleEditLesson}>
                        Save
                    </button>
                    <button className="btn" formMethod="dialog">Close</button>
                </div>
            </form>
        </dialog>
    )
}

export default LessonEditModal