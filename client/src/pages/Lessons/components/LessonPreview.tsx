import Tabs from '../../../components/Tabs/Tabs';

interface LessonPreviewProps {
    season: "spring" | "summer" | "autumn" | "winter"
    lessonId: string;
}

function LessonPreview({ season, lessonId }: LessonPreviewProps) {
    const tabs: { tabName: string; tabContent: JSX.Element | null; }[] = [
        {
            tabName: "General",
            tabContent: null
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
            <Tabs tabs={tabs} />
        </div>
    )
}

export default LessonPreview