import trpc from "../../services/trpc"
import RewardCard from "./components/RewardCard";

export default function Rewards() {
    const { data, isError } = trpc.reward.getRewards.useQuery()

    if (isError) return (
        <div className="flex flex-1 justify-center items-center h-24">
            <p className="text-lg text-center text-neutral-400">
                Error loading rewards
            </p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold">
                Rewards
            </h1>
            <div className="flex flex-wrap mt-10 gap-6">
                {data?.map(({ id, name, thumbnail }) => (
                    <RewardCard
                        key={id}
                        id={id}
                        name={name}
                        thumbnail={thumbnail}
                        onEdit={(rewardId) => null}
                    />
                ))}
            </div>
        </div>
    )
}