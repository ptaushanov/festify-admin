interface ContentBlockProps {
    id: number;
    type: "text" | "image";
    value: string;
    editMode: boolean;
    onContentChange: (id: number, newValue: string) => void;
}

function ContentBlock({ id, type, value, onContentChange, editMode }: ContentBlockProps) {
    const allowedExtensions = ["jpg", "jpeg", "png"]

    const handleContentChange =
        (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const newValue = event.target.value
            onContentChange(id, newValue)
        }

    return (
        <div>
            {type === "text" ? (
                editMode ? (
                    <div className="bg-neutral-100 rounded-md py-2 px-4">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Text Block
                            </span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full h-36"
                            value={value}
                            onChange={handleContentChange}
                        />
                    </div>
                ) : (
                    <p className="text-justify">{value}</p>
                )
            ) : (
                <div className="bg-base-100 flex justify-center">
                    {editMode ? (
                        <div className="form-control w-full bg-neutral-100 rounded-md py-2 px-4">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Image (max 5MB)
                                </span>
                                <span className="label-text-alt">
                                    {allowedExtensions.join(", ")}
                                </span>
                            </label>
                            <input
                                type="file"
                                name="thumbnail"
                                accept={allowedExtensions.join(", ")}
                                onChange={handleContentChange}
                                className="file-input file-input-bordered w-full"
                            />
                        </div>
                    ) : (
                        <img src={value} className="rounded-md w-full h-64 object-cover" />
                    )}
                </div>
            )}
        </div>
    )
}

export default ContentBlock