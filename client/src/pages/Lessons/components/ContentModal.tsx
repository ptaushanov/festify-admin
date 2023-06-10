import { RefObject, useRef } from 'react'

interface ContentModalProps {
    modalRef: RefObject<HTMLDialogElement>
    onCreateContentBlock: (type: "image" | "text") => void
}

function ContentModal({ modalRef, onCreateContentBlock }: ContentModalProps) {
    const selectRef = useRef<HTMLSelectElement>(null)

    const handleCreateContentBlock = () => {
        const contentType = selectRef.current?.value as "image" | "text"
        onCreateContentBlock(contentType)
        modalRef.current?.close()
    }

    return (
        <dialog className="modal" ref={modalRef}>
            <form className="modal-box max-w-lg">
                <div className="flex items-stretch space-x-2 pt-4 px-4">
                    <div className="flex flex-col flex-1">
                        <h3 className="font-bold text-xl">
                            Content block
                        </h3>
                        <div className="mt-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Content type
                                    </span>
                                </label>
                                <select
                                    ref={selectRef}
                                    className="select select-bordered w-full"
                                >
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <button
                        className="btn btn-neutral"
                        type="button"
                        onClick={handleCreateContentBlock}
                    >
                        Create
                    </button>
                    <button className="btn" formMethod="dialog">Close</button>
                </div>
            </form>
        </dialog>
    )
}

export default ContentModal