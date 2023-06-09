import { useState } from "react";

interface GeneralTabProps {
    holidayName?: string;
    xpReward?: number;
    lastForSeason?: boolean;
}

function GeneralTab({
    holidayName = '',
    lastForSeason = false,
    xpReward = 0
}: GeneralTabProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)

    return (
        <div className="py-2 px-4 flex flex-col space-y-2">
            <div className="flex space-x-4">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">
                            Holiday name
                        </span>
                    </label>
                    <input
                        type="text"
                        name="holiday_name"
                        className="input input-bordered"
                        disabled={!isEditing}
                        defaultValue={holidayName}
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold">
                            Xp reward
                        </span>
                    </label>
                    <input
                        type="number"
                        name="holiday_name"
                        className="input input-bordered"
                        disabled={!isEditing}
                        defaultValue={xpReward}
                    />
                </div>
            </div>
            <div className="flex">
                <div className="form-control self-start">
                    <label className="label cursor-pointer flex items-center space-x-4">
                        <span className="label-text font-semibold">
                            Last for the season
                        </span>
                        <input
                            type="checkbox"
                            className="toggle"
                            disabled={!isEditing}
                            defaultChecked={lastForSeason}
                        />
                    </label>
                </div>
                <div className="flex flex-1 justify-end">
                    {isEditing && (
                        <button className="btn btn-neutral mr-2">Save</button>
                    )}
                    <button className="btn" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GeneralTab