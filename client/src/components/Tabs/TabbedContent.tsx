import { useState } from 'react'

interface TabsProps {
    tabs: JSX.Element[] | null,
    tabPrefix?: string,
}

function Tabs({ tabs, tabPrefix }: TabsProps) {
    const [selectedTab, setSelectedTab] = useState<number>(0)

    return (
        <div className="tabs tabs-boxed bg-base-100">
            <div className="flex flex-1 justify-end">
                {tabs?.map((_, index) => (
                    <a
                        key={index}
                        className={`tab tab-md ${selectedTab === index ? "tab-active" : ""}`}
                        onClick={() => setSelectedTab(index)}
                    >
                        {tabPrefix} {index + 1}
                    </a>
                ))}
            </div>
            <div className="p-4 w-full h-full">
                {tabs?.[selectedTab]}
            </div>
        </div>
    )
}

export default Tabs