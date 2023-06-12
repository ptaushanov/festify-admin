interface RewardCardProps {
    id: string;
    name: string;
    thumbnail: string;
    onEdit: (rewardId: string) => void;
}

function RewardCard({ id, name, thumbnail, onEdit }: RewardCardProps) {
    return (
        <div className="card w-60 h-[18rem] bg-base-100 shadow-md self-center">
            <figure>
                <img src={thumbnail} />
            </figure>
            <div className="card-body flex">
                <h2 className="card-title text-xl">
                    {name}
                </h2>
                <div className="card-actions justify-end">
                    <button className="btn" onClick={() => onEdit(id)}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RewardCard