import SortableItem from './SortableItem';
import React from 'react';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    UniqueIdentifier,
    DragEndEvent,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface SortableListProps<T, K extends UniqueIdentifier> {
    items: T[];
    onSort: (items: T[]) => void;
    keyExtractor: (item: T) => K;
    renderItem: (item: T, index: number) => React.ReactNode;
}

function SortableList<T, K extends UniqueIdentifier>({
    items,
    onSort,
    keyExtractor,
    renderItem
}: SortableListProps<T, K>) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 100 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) =>
                keyExtractor(item) === active.id);
            const newIndex = over ? items.findIndex((item) =>
                keyExtractor(item) === over.id) : -1;

            const updatedItems = arrayMove(items, oldIndex, newIndex);
            onSort(updatedItems);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((item) => keyExtractor(item))}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item, index) => (
                    <SortableItem
                        key={keyExtractor(item)}
                        id={keyExtractor(item)}
                    >
                        {renderItem(item, index)}
                    </SortableItem>
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default SortableList;
