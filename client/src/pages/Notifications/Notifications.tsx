import { useState } from "react"
import trpc from "../../services/trpc"
import { toast } from "react-hot-toast"

export default function Notifications() {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const notificationMutation = trpc.notification.sendNotification.useMutation()

    const handleSendNotification = () => {
        notificationMutation.mutate({ title, body }, {
            onSuccess: ({ message }) => {
                setTitle("")
                setBody("")
                toast.success(message)
            }
        })
    }

    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold">
                Notifications
            </h1>
            <div className="flex flex-col mt-10 space-y-2 bg-base-300 p-6 rounded-md">
                <input
                    type="text"
                    placeholder="Subject"
                    className="input input-bordered w-full"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div className="mt-6 flex-1 bg-base-300 p-6 rounded-md">
                <textarea
                    className="textarea textarea-bordered w-full h-full"
                    placeholder="Body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                ></textarea>
            </div>
            <button
                onClick={handleSendNotification}
                className="btn mt-4 bg-neutral text-neutral-content self-end"
            >
                Send
            </button>
        </div>
    )
}