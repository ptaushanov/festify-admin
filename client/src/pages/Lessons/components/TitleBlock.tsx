interface TitleBlockProps {
    title: string;
    editMode: boolean;
    onChange: (newTitle: string) => void;
}

function TitleBlock({ title, editMode, onChange }: TitleBlockProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }

    return editMode ? (
        <div className="flex form-control w-full">
            <label className="label">
                <span className="label-text font-semibold">
                    Question
                </span>
            </label>
            <input
                type="text"
                value={title}
                onChange={handleChange}
                className="input input-bordered w-full"
            />
        </div>
    ) : (
        <h1 className="font-semibold text-2xl text-neutral">
            {title}
        </h1>
    )
}

export default TitleBlock