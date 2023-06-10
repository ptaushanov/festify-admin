import { PlusIcon } from "@heroicons/react/24/outline";
import ContentBlock from "./ContentBlock";
import React from "react";

interface PageContentProps {
    holidayName: string;
    pageId: string,
    content: {
        type: "text" | "image";
        value: string;
    }[];
    isEditMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    onContentChange: (pageId: string, id: number, newValue: string) => void;
    onCreatePage: () => void;
    onDeletePage: (pageId: string) => void;
}

function PageContent({
    holidayName,
    pageId,
    content,
    isEditMode,
    setEditMode,
    onContentChange,
    onCreatePage,
    onDeletePage
}: PageContentProps) {
    return (
        <div className="flex flex-col space-y-2">
            <h3 className="text-2xl font-bold mb-4">
                {holidayName}
            </h3>
            <div className="flex flex-col space-y-4">
                {content.map(({ type, value }, index) => (
                    <ContentBlock
                        key={index}
                        pageId={pageId}
                        id={index}
                        type={type}
                        value={value}
                        editMode={isEditMode}
                        onContentChange={onContentChange}
                    />
                ))}
            </div>
            <div className="flex flex-1 justify-between pt-4">
                <div className="space-x-2">
                    {isEditMode && (<>
                        <button onClick={() => onDeletePage(pageId)}
                            className="btn hover:btn-error"
                        >
                            Delete
                        </button>
                        <button onClick={onCreatePage} className="btn btn-neutral">
                            Add Page
                        </button>
                    </>)}
                </div>

                <div className="flex items-center space-x-2">
                    {isEditMode && (
                        <>
                            <button className="btn btn-circle mr-2">
                                <PlusIcon className="h-5 w-5" />
                            </button>
                            <button className="btn btn-neutral">Save</button>
                        </>
                    )}
                    <button className="btn"
                        onClick={() => setEditMode(!isEditMode)}>
                        {isEditMode ? "Cancel" : "Edit"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PageContent