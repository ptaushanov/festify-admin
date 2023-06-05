import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col flex-1 px-10 py-5">
            <div>
                <a
                    onClick={() => navigate(-1)}
                    className="flex-none btn btn-ghost normal-case text-md"
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    <span>Go Back</span>
                </a>
            </div>
            <div className="flex flex-col flex-1 justify-center items-center">
                <h1 className="text-6xl">
                    404 Not Found
                </h1>
                <h2 className="text-xl py-2">
                    Oops! You've ventured into uncharted territory!
                </h2>
                <p className="text-base-content w-1/2 text-center mt-5">
                    We apologize for the detour you've encountered.
                    It seems the page you were looking for has taken a spontaneous vacation and
                    left us with a case of the infamous 404 error.
                </p>
                <a
                    onClick={() => navigate(-1)}
                    className="flex-none btn btn-ghost normal-case text-md mt-5"
                >
                    <span>Go Back</span>
                </a>
            </div>
        </div>

    )
}