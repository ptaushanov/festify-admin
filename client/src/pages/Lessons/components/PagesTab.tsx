import { useState } from "react";
import TabbedContent from "../../../components/Tabs/TabbedContent";
import PageContent from "./PageContent";
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

function PagesTab({ pages = {}, holidayName = "" }: PagesTabProps) {
    const [modifiedPages, setModifiedPages] = useState(pages)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const handleContentChange = (pageId: string, id: number, newValue: string) => {
        const newPage = structuredClone(modifiedPages[pageId])
        newPage[id].value = newValue

        setModifiedPages({
            ...modifiedPages,
            [pageId]: newPage
        })
    }

    const handleCreatePage = () => {
        const newPageId = Object.keys(modifiedPages).length

        setModifiedPages({
            ...modifiedPages,
            [newPageId]: []
        })
    }

    const handleDeletePage = (pageId: string) => {
        const { [pageId]: _, ...otherPages } = modifiedPages
        setModifiedPages(otherPages)
    }

    const pageElements = Object.entries(modifiedPages)
        .reverse()
        .map(([pageId, pageContent]) => (
            <PageContent
                holidayName={holidayName}
                key={pageId}
                pageId={pageId}
                content={pageContent}
                isEditMode={isEditing}
                setEditMode={setIsEditing}
                onContentChange={handleContentChange}
                onCreatePage={handleCreatePage}
                onDeletePage={handleDeletePage}
            />
        ))

    const noPagesPresent = Object.keys(modifiedPages).length === 0
    if (noPagesPresent) return (
        <div className="h-60 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-xl font-semibold ">
                No pages present
            </p>
            <p className="text-sm">Click on the button bellow to create one</p>
            <button
                onClick={handleCreatePage}
                className="btn shadow-sm mt-4">
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
    )

    return (
        <div className="py-2 px-6 flex flex-col space-y-2">
            <TabbedContent tabs={pageElements} />
        </div>
    )
}

export default PagesTab