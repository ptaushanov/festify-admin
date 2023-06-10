import { useState } from "react";
import TabbedContent from "../../../components/Tabs/TabbedContent";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageContent from "./PageContent";

type ContentBlock = {
    type: "text" | "image";
    value: string;
}

type VersionedContentBlock = ContentBlock & {
    oldValue?: string;
}

interface PagesTabProps {
    holidayName?: string;
    pages?: {
        [x: string]: VersionedContentBlock[]
    };
}

function PagesTab({ pages = {}, holidayName = "" }: PagesTabProps) {
    const [modifiedPages, setModifiedPages] = useState(pages)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const handleContentChange = (pageId: string, id: number, newValue: string, oldValue?: string) => {
        const newPage = structuredClone(modifiedPages[pageId])
        newPage[id].value = newValue
        if (oldValue) { newPage[id].oldValue = oldValue }

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

    const handleCreateContentBlock = (pageId: string, type: "image" | "text") => {
        const newPage = [...modifiedPages[pageId], { type, value: "" }]
        setModifiedPages({
            ...modifiedPages,
            [pageId]: newPage
        })
    }

    const handleDeleteContentBlock = (pageId: string, id: number) => {
        const newPage = [...modifiedPages[pageId]]
        newPage.splice(id, 1)
        setModifiedPages({ ...modifiedPages, [pageId]: newPage })
    }

    const handleSavePages = () => {
        console.log(modifiedPages)
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
                onCreateContentBlock={handleCreateContentBlock}
                onDeleteContentBlock={handleDeleteContentBlock}
                onCreatePage={handleCreatePage}
                onDeletePage={handleDeletePage}
                onSavePages={handleSavePages}
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