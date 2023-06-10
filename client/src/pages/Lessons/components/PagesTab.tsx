import { useState } from "react";
import TabbedContent from "../../../components/Tabs/TabbedContent";
import ContentBlock from "./ContentBlock";
import { PlusIcon } from "@heroicons/react/24/outline";

interface PagesTabProps {
    holidayName?: string;
    pages?: {
        [x: string]: {
            type: "text" | "image";
            value: string;
        }[]
    };
}

function PagesTab({ pages, holidayName = "" }: PagesTabProps) {
    const [modifiedPages, setModifiedPages] = useState(pages)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    if (!modifiedPages) return null

    const handleContentChange = (id: number, newValue: string) => {
        console.log(`[${id}]: ${newValue}`)
    }

    const pageElements = Object.entries(modifiedPages).map(([pageId, pageContent]) => {
        return (
            <div key={pageId} className="flex flex-col space-y-2">
                <h3 className="text-2xl font-bold mb-4">
                    {holidayName}
                </h3>
                <div className="flex flex-col space-y-4">
                    {pageContent.map(({ type, value }, index) => (
                        <ContentBlock
                            key={index}
                            id={index}
                            type={type}
                            value={value}
                            editMode={isEditing}
                            onContentChange={handleContentChange}
                        />
                    ))}
                </div>
                <div className="flex flex-1 justify-between pt-4">
                    <div className="space-x-2">
                        {isEditing && (<>
                            <button className="btn hover:btn-error">
                                Delete
                            </button>
                            <button className="btn btn-neutral">
                                Add Page
                            </button>
                        </>)}
                    </div>

                    <div className="flex items-center space-x-2">
                        {isEditing && (
                            <>
                                <button className="btn btn-circle mr-2">
                                    <PlusIcon className="h-5 w-5" />
                                </button>
                                <button className="btn btn-neutral">Save</button>
                            </>
                        )}
                        <button className="btn"
                            onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="py-2 px-6 flex flex-col space-y-2">
            <TabbedContent tabs={pageElements} />
        </div>
    )
}

export default PagesTab