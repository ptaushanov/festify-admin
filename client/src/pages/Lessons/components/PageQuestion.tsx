import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import ChoiceBlock from "./ChoiceBlock";
import TitleBlock from "./TitleBlock";

type Question = {
    title: string;
    answer: number;
    choices: string[];
}

interface QuestionsContentProps {
    questionId: number
    title: string;
    answer: number;
    choices: string[];
    isEditMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    onQuestionChange: (questionId: number, question: Question) => void;
    onCreateQuestion: () => void;
    onDeleteQuestion: (questionId: number) => void;
    onSaveQuestions: () => void;
}

function PageQuestion({
    questionId,
    title,
    answer,
    choices,
    isEditMode,
    setEditMode,
    onQuestionChange,
    onCreateQuestion,
    onDeleteQuestion,
    onSaveQuestions
}: QuestionsContentProps) {

    const handleTitleChange = (newTitle: string) => {
        onQuestionChange(questionId, { title: newTitle, answer, choices })
    }

    const handleAnswerChange = (newAnswer: number) => {
        onQuestionChange(questionId, { title, answer: newAnswer, choices })
    }

    const handleAddChoice = (choiceValue: string) => {
        const newChoices = [...choices, choiceValue]
        onQuestionChange(questionId, { title, answer, choices: newChoices })
    }

    const handleChangeChoice = (choiceIndex: number, choiceValue: string) => {
        const newChoices = [...choices]
        newChoices[choiceIndex] = choiceValue
        onQuestionChange(questionId, { title, answer, choices: newChoices })
    }

    const handleDeleteChoice = (choiceIndex: number) => {
        const newChoices = choices.filter((_, index) => index !== choiceIndex)
        onQuestionChange(questionId, { title, answer, choices: newChoices })
    }

    return (
        <div className="flex flex-col">
            <TitleBlock
                title={title}
                editMode={isEditMode}
                onChange={handleTitleChange}
            />
            <div className="flex flex-col space-y-4 mt-6">
                {choices.map((value, index) => (
                    <ChoiceBlock
                        key={index}
                        questionId={questionId}
                        id={index}
                        value={value}
                        answer={answer}
                        editMode={isEditMode}
                        onChange={handleChangeChoice}
                        onDelete={handleDeleteChoice}
                        onSelect={handleAnswerChange}
                    />
                ))}
            </div>
            <div className="flex flex-1 justify-between pt-4">
                <div className="space-x-2">
                    {isEditMode && (<>
                        <button onClick={() => onDeleteQuestion(questionId)}
                            className="btn hover:btn-error"
                        >
                            Delete
                        </button>
                        <button onClick={onCreateQuestion} className="btn btn-neutral">
                            Add Question
                        </button>
                    </>)}
                </div>

                <div className="flex items-center space-x-2">
                    {isEditMode && (
                        <>
                            <button className="btn btn-circle mr-2"
                                onClick={() => handleAddChoice('')}
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                            <button className="btn btn-neutral" onClick={onSaveQuestions}>
                                Save
                            </button>
                        </>
                    )}
                    <button className="btn"
                        onClick={() => setEditMode(!isEditMode)}>
                        {isEditMode ? "Close" : "Edit"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PageQuestion