import { PlusIcon } from "@heroicons/react/24/outline";
import ContentBlock from "./ContentBlock";
import React, { useRef } from "react";
import ContentModal from "./ContentModal";

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
    onCreateContentBlock: (pageId: string, type: "image" | "text") => void;
    onDeleteContentBlock: (pageId: string, id: number) => void;
    onCreatePage: () => void;
    onDeletePage: (pageId: string) => void;
    onSavePages: () => void;
}

function PageContent({
    holidayName,
    pageId,
    content,
    isEditMode,
    setEditMode,
    onContentChange,
    onCreateContentBlock,
    onDeleteContentBlock,
    onCreatePage,
    onDeletePage,
    onSavePages
}: PageContentProps) {
    const modalRef = useRef<HTMLDialogElement>(null)

    const handleCreateContentBlock = (type: "image" | "text") => {
        onCreateContentBlock(pageId, type)
        modalRef.current?.close()
    }

    const handleOpenModal = () => {
        modalRef.current?.showModal()
    }

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
                        onDelete={onDeleteContentBlock}
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
                            <button onClick={handleOpenModal}
                                className="btn btn-circle mr-2">
                                <PlusIcon className="h-5 w-5" />
                            </button>
                            <button className="btn btn-neutral" onClick={onSavePages}>
                                Save
                            </button>
                        </>
                    )}
                    <button className="btn"
                        onClick={() => setEditMode(!isEditMode)}>
                        {isEditMode ? "Close" : "Edit"}
                    </button>
                </div>
            </div>
            <ContentModal
                modalRef={modalRef}
                onCreateContentBlock={handleCreateContentBlock}
            />
        </div>
    )
}

export default PageContent