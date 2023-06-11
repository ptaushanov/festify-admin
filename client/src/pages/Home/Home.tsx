import { AcademicCapIcon, UsersIcon } from "@heroicons/react/24/outline";
import trpc from "../../services/trpc";

export default function Home() {
    const { data, isError } = trpc.home.getStatistics.useQuery();
    const { totalLessons, totalUsers } = data || {};

    if (isError) return (
        <div className="flex flex-1 justify-center items-center h-24">
            <p className="text-lg text-center text-neutral-400">
                Error loading statistics
            </p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold">
                Home
            </h1>
            <h2 className="text-xl font-bold mt-10 text-neutral-600">
                Statistics
            </h2>
            <div className="stats shadow p-4 mt-4">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <AcademicCapIcon className="h-8 w-8" />
                    </div>
                    <div className="stat-title">Total lessons</div>
                    <div className="stat-value text-primary">
                        {totalLessons || 0}
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <UsersIcon className="h-8 w-8" />
                    </div>
                    <div className="stat-title">Total users</div>
                    <div className="stat-value text-secondary">
                        {totalUsers || 0}
                    </div>
                </div>
            </div>
        </div>
    );
}
