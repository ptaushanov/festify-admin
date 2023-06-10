import { ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useNavigate, useParams } from "react-router-dom"
import LessonPreview from "./components/LessonPreview"
import trpc from "../../services/trpc"
type Season = "spring" | "summer" | "autumn" | "winter"

function Preview() {
    const navigate = useNavigate()
    const { season, id } = useParams()
    const hasNeededParams = season && id
    const isSeasonValid = !!season &&
        ["spring", "summer", "autumn", "winter"].includes(season)

    const deleteMutation = trpc.lesson.deleteLessonById.useMutation()
    const trpcContext = trpc.useContext()

    const handleDeleteLesson = () => {
        if (!isSeasonValid || !id) return
        const castedSeason = season as Season

        deleteMutation.mutate({
            season: castedSeason,
            lessonId: id
        }, {
            onSuccess: () => {
                trpcContext.lesson.getLessonsBySeason
                    .invalidate({ season: castedSeason })
                trpcContext.timeline.getSeasonTimeline
                    .invalidate({ season: castedSeason })
                navigate(-1)
            }
        })
    }

    return (
        <div className="flex flex-col">
            <div className="-mt-4">
                <a
                    onClick={() => navigate(-1)}
                    className="flex-none btn normal-case text-sm"
                >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    <span>Go Back</span>
                </a>
            </div>
            <div className="flex items-center justify-between mt-2">
                <h1 className="text-3xl font-bold">
                    Lesson Preview
                </h1>
                {hasNeededParams && isSeasonValid ?
                    <button
                        onClick={handleDeleteLesson}
                        className="btn bg-base-100 border-base-300 hover:btn-error rounded"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button> : <div />
                }
            </div>
            {hasNeededParams && isSeasonValid ?
                <LessonPreview lessonId={id} season={season as Season} /> :
                <div className="bg-base-300 px-6 py-10 rounded-sm mt-8">
                    <p className="text-lg text-neutral-500 text-center">
                        Missing or invalid parameters
                    </p>
                </div>
            }

        </div>
    )
}

export default Preview