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
                        className={`tab tab-md w-8 h-8
                            ${selectedTab === index ? "bg-neutral-700 text-base-100 font-semibold" : ""}
                         `}
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