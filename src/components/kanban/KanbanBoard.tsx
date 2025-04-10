import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useKanban } from '@/hooks/projects/kanban/useKanban';
import { useLoaderData, useNavigation } from 'react-router';
import { GetKanbanColumnsResponse, KanbanColumn as Column } from '@/hooks/projects/kanban/kanbanInterfaces';
import { AddKanbanColumnDialog } from './AddKanbanColumnDialog';
import { CardSkeleton } from '../CardSkeleton';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useMemo, useState, useEffect } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { createPortal } from 'react-dom';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const navigation = useNavigation();
  const initialData = useLoaderData<GetKanbanColumnsResponse>();

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [localColumns, setLocalColumns] = useState<Column[]>([]);

  const { getKanbanColumnsResponse, deleteKanbanColumnResponse, createColumnResponse, reorderKanbanColumnsResponse } =
    useKanban(projectId);

  const { data = initialData, isLoading } = getKanbanColumnsResponse;

  // initialize and update localCOlumns whenever data changes from the server
  useEffect(() => {
    if (data?.columns) {
      setLocalColumns(data.columns);
    }
  }, [data]);

  // check if we are loading data from either the router or the query
  const isLoadingData = isLoading || navigation.state === 'loading';

  // store all the column ids in an array for dnd to keep track of the sorted items
  //? useMemo so that this function is only executed if the dependencies change
  const columnIds = useMemo(() => localColumns?.map((col) => col.columnId) || [], [localColumns]);

  const onDragStart = (event: DragStartEvent) => {
    console.log('Drag started', event);
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset active column after drag operation
    setActiveColumn(null);

    // No changes if we drag and drop at the same column position or there's no target
    if (!over || active.id === over.id) {
      return;
    }

    if (event.active.data.current?.type === 'Column') {
      const activeId = active.id as string;
      const overId = over.id as string;

      const oldIndex = columnIds.indexOf(activeId);
      const newIndex = columnIds.indexOf(overId);

      if (oldIndex !== newIndex) {
        // create a new array with the updated order
        const newColumnIds = arrayMove(columnIds, oldIndex, newIndex);

        // create a new array of columns in the exact order defined by newColumnIds
        const updatedColumns = newColumnIds
          //? map over the column ids to find the corresponding column objects
          .map((id) => {
            const column = localColumns.find((col) => col.columnId === id);
            return column!;
          })
          //? update the index prop of each column object to preserve the exact order
          .map((col, index) => ({
            ...col,
            columnIndex: index,
          }));

        // Update local state immediately with properly ordered columns
        setLocalColumns(updatedColumns);

        // Send the update to the server
        reorderKanbanColumnsResponse.mutate({
          projectId,
          columnIds: newColumnIds,
        });
      }
    }
  };

  const handleAddColumn = (columnName: string) => {
    createColumnResponse.mutate(columnName);
  };

  const handleDeleteCol = (columnId: string) => {
    deleteKanbanColumnResponse.mutate(columnId);
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex justify-end px-2">
        <AddKanbanColumnDialog
          trigger={
            <Button className="font-heading cursor-pointer">
              <ListPlus />
              Add Column
            </Button>
          }
          onAddColumn={handleAddColumn}
          isSubmitting={createColumnResponse.isPending}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-230px)] min-h-[500px] px-3">
        {isLoadingData ? (
          <div className="mt-8 px-3">
            <CardSkeleton variant="kanban-column" count={3} horizontal={true} containerClassName="gap-10" />
          </div>
        ) : (
          <div className="flex mt-8 px-2 gap-x-8">
            <SortableContext items={columnIds}>
              {localColumns?.map((col) => (
                <KanbanColumn
                  key={col.columnId}
                  column={col}
                  isDeletePending={deleteKanbanColumnResponse.isPending}
                  onDeleteCol={handleDeleteCol}
                />
              ))}
            </SortableContext>
          </div>
        )}

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* //? When dragging an element, the dragged preview should appear above all other elements on the page, regardless of the stacking context of the parent container. By using createPortal to render the DragOverlay directly into document.body, it ensures that the dragged element always appears on top of everything else */}
      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <KanbanColumn
              key={activeColumn.columnId}
              column={activeColumn}
              isDeletePending={deleteKanbanColumnResponse.isPending}
              onDeleteCol={handleDeleteCol}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
