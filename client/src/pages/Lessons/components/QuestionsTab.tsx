import { useState } from "react";
import TabbedContent from "../../../components/Tabs/TabbedContent";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageQuestion from "./PageQuestion";
import trpc from "../../../services/trpc";

type Question = {
    title: string;
    answer: number;
    choices: string[];
}

interface QuestionsTabProps {
    season: "spring" | "summer" | "autumn" | "winter";
    lessonId: string;
    questions?: Question[];
}

function QuestionsTab({
    season,
    lessonId,
    questions = [],
}: QuestionsTabProps
) {
    const [modifiedQuestions, setModifiedQuestions] = useState(questions)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const lessonContentMutation = trpc.lesson.updateLessonQuestions.useMutation()
    const trpcContext = trpc.useContext()

    const handleQuestionChange = (questionId: number, changedQuestion: Question) => {
        const newQuestions = [...modifiedQuestions]
        newQuestions[questionId] = changedQuestion
        setModifiedQuestions(newQuestions)
    }

    const handleCreateQuestion = () => {
        const newQuestion: Question = { title: "", answer: 0, choices: [] }
        const newQuestions = [...modifiedQuestions, newQuestion]
        setModifiedQuestions(newQuestions)
    }

    const handleDeleteQuestion = (questionId: number) => {
        const newQuestions = modifiedQuestions.filter((_, index) => index !== questionId)
        setModifiedQuestions(newQuestions)
    }

    const handleSaveQuestion = () => {
        lessonContentMutation.mutate(
            { season, lessonId, questions: modifiedQuestions }, {
            onSuccess: () => {
                trpcContext.lesson.getLessonById.invalidate({ season, lessonId })
                setIsEditing(false)
            }
        })
    }

    const pageElements = modifiedQuestions.map(({ answer, choices, title }, index) => (
        <PageQuestion
            key={index}
            questionId={index}
            title={title}
            answer={answer}
            choices={choices}
            isEditMode={isEditing}
            setEditMode={setIsEditing}
            onQuestionChange={handleQuestionChange}
            onCreateQuestion={handleCreateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onSaveQuestions={handleSaveQuestion}
        />
    ))

    const noQuestionsPresent = modifiedQuestions.length === 0
    if (noQuestionsPresent) return (
        <div className="h-60 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-xl font-semibold ">
                No questions present
            </p>
            <p className="text-sm">Click on the button bellow to create one</p>
            <button
                onClick={handleCreateQuestion}
                className="btn shadow-sm mt-4">
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
    )

    return (
        <div className="py-2 px-6 flex flex-col space-y-2">
            <TabbedContent tabs={pageElements} />
        </div>
    )
}

export default QuestionsTab