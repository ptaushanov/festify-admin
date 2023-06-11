import { TrashIcon } from "@heroicons/react/24/outline";

interface ChoiceBlockProps {
    questionId: number;
    id: number;
    value: string;
    answer: number;
    editMode: boolean;
    onDelete: (choiceIndex: number) => void;
    onChange: (choiceIndex: number, choiceValue: string) => void;
    onSelect: (choiceIndex: number) => void;
}

function ChoiceBlock({
    questionId,
    id,
    value,
    answer,
    editMode,
    onDelete,
    onChange,
    onSelect
}: ChoiceBlockProps
) {
    const handleDelete = () => onDelete(id)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, event.target.value)
    }

    const handleSelect = () => onSelect(id)

    return editMode ? (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-semibold">
                    Choice {id + 1}
                </span>
            </label>
            <div className="flex join border border-base-300 ">
                <div className="bg-base-300 px-4 join-item flex items-center justify-center">
                    <input
                        type="radio"
                        name={`answer-${questionId}`}
                        onChange={handleSelect}
                        className="radio"
                        defaultChecked={answer === id}
                    />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    className="input input-bordered w-full join-item"
                />
                <button
                    onClick={handleDelete}
                    className="btn bg-base-300 hover:btn-error join-item h-auto"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    ) : (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                name={`answer-${questionId}`}
                className="checkbox checked:checkbox-success"
                checked={answer === id}
            />
            <p className="text-justify">{value}</p>
        </div>
    )
}

export default ChoiceBlock