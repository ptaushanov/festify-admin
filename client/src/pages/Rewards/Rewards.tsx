import { useRef, useState } from "react";
import trpc from "../../services/trpc"
import RewardCard from "./components/RewardCard";
import RewardEditModal from "./components/RewardEditModal";

type Reward = {
    id: string;
    name: string;
    thumbnail: string;
}

export default function Rewards() {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
    const { data, isError } = trpc.reward.getRewards.useQuery()

    const handleRewardEdit = (reward: Reward) => {
        setSelectedReward(reward)
        modalRef.current?.showModal()
    }

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
                {data?.map((reward) => (
                    <RewardCard
                        key={reward.id}
                        reward={reward}
                        onEdit={handleRewardEdit}
                    />
                ))}
            </div>
            <RewardEditModal
                modalRef={modalRef}
                reward={selectedReward}
            />
        </div>
    )
}