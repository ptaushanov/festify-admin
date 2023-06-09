import { useState } from 'react'
import Loading from '../Loading/Loading'

type Tab = {
    tabName: string,
    tabContent: JSX.Element | null
}

interface TabsProps {
    tabs: Tab[],
    loading?: boolean
    error?: boolean
}

function Tabs({ tabs, loading, error }: TabsProps) {
    const [selectedTab, setSelectedTab] = useState<number>(0)

    return (
        <div className="tabs justify-center">
            {tabs.map(({ tabName }, index) => (
                <a
                    key={index}
                    className={`tab tab-lg tab-lifted ${selectedTab === index ? "tab-active" : ""}`}
                    onClick={() => setSelectedTab(index)}
                >
                    {tabName}
                </a>
            ))}
            <div className="card p-4 rounded-md shadow-sm bg-base-100 w-full min-h-16">
                {
                    error ? (
                        <div className="flex justify-center items-center h-24">
                            <p className="text-lg text-center text-neutral-400">
                                Error loading data
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loading />
                        </div>
                    ) : tabs[selectedTab].tabContent
                }
            </div>
        </div>
    )
}

export default Tabs