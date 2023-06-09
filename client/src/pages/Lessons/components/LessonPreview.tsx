import Tabs from '../../../components/Tabs/Tabs';
import trpc from '../../../services/trpc';
import GeneralTab from './GeneralTab';

interface LessonPreviewProps {
    season: "spring" | "summer" | "autumn" | "winter"
    lessonId: string;
}

function LessonPreview({ season, lessonId }: LessonPreviewProps) {
    const { data, isLoading, isError } = trpc.lesson.getLessonById
        .useQuery({ season, lessonId })

    const {
        holiday_name,
        xp_reward,
        last_for_season,
        content,
        questions,
        reward,
    } = data || {}

    const tabs: { tabName: string; tabContent: JSX.Element | null; }[] = [
        {
            tabName: "General",
            tabContent: <GeneralTab
                holidayName={holiday_name}
                xpReward={xp_reward}
                lastForSeason={last_for_season}
            />
        },
        {
            tabName: "Pages",
            tabContent: null
        },
        {
            tabName: "Questions",
            tabContent: null
        },
        {
            tabName: "Reward",
            tabContent: null
        },
        {
            tabName: "Timeline preview",
            tabContent: null
        }
    ]

    return (
        <div>
            <Tabs tabs={tabs} loading={isLoading} error={isError} />
        </div>
    )
}

export default LessonPreview