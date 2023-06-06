import trpc from "../../services/trpc"

export default function Home() {
    const { data, error } = trpc.getUserById.useQuery(1)

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1>{data?.name}</h1>
            <p>{data?.bio}</p>
            <p className="text-error">
                {error?.message}
            </p>
        </div>
    )
}