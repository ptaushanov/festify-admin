import { useState } from 'react'

type Tab = {
    tabName: string,
    tabContent: JSX.Element | null
}

interface TabsProps {
    tabs: Tab[]
}

function Tabs({ tabs }: TabsProps) {
    const [selectedTab, setSelectedTab] = useState<number>(0)

    return (
        <div className="tabs justify-center">
            {tabs.map(({ tabName }, index) => (
                <a
                    key={index}
                    className={`tab tab-md tab-lifted ${selectedTab === index ? "tab-active" : ""}`}
                    onClick={() => setSelectedTab(index)}
                >
                    {tabName}
                </a>
            ))}
            <div className="card p-4 rounded-md shadow-sm bg-base-100 w-full min-h-16">
                {tabs[selectedTab].tabContent}
            </div>
        </div>
    )
}

export default Tabs