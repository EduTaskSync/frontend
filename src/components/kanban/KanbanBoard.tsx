import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useKanbanColumns } from '@/hooks/projects/kanban/useKanban';
import { useLoaderData, useNavigation } from 'react-router';
import {
  GetKanbanColumnsResponse,
  KanbanColumn as Column,
  UpdatedColumnData,
} from '@/hooks/projects/kanban/kanbanInterfaces';
import { KanbanColumnDetailsDialog } from './KanbanColumnDetailsDialog';
import { CardSkeleton } from '../CardSkeleton';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
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

  const {
    getKanbanColumnsResponse,
    deleteKanbanColumnResponse,
    createColumnResponse,
    reorderKanbanColumnsResponse,
    updateKanbanColumnResponse,
  } = useKanbanColumns(projectId);

  const { data = initialData, isLoading } = getKanbanColumnsResponse;

  // initialize and update localCOlumns whenever data changes from the server
  useEffect(() => {
    if (data?.columns) {
      //! sort columns by their index before setting in local state
      const sortedColumns = [...data.columns.sort((a, b) => a.columnIndex - b.columnIndex)];
      setLocalColumns(sortedColumns);
    }
  }, [data]);

  console.log(
    `Server sent these columns: ${data.columns.map((c) => `${c.columnName} col index prop: (${c.columnIndex})`)}`
  );

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
    console.log('drag ended', event);

    // Debug logging
    console.log('Before reorder:');
    console.log('columnIds:', columnIds);
    console.log(
      'localColumns:',
      localColumns.map((c) => `${c.columnName} col index prop(${c.columnIndex})`)
    );
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

        console.log('After arrayMove:');
        //? loop thru all local columns adn update their column indexes
        const updatedColumns = newColumnIds.map((colId, index) => {
          const column = localColumns.find((col) => col.columnId === colId);
          return {
            ...column!,
            columnIndex: index,
          };
        });
        console.log(
          'Updated columns:',
          updatedColumns.map((c) => `${c.columnName} col index prop: (${c.columnIndex})`)
        );

        // update local state immediately with properly ordered columns
        setLocalColumns(updatedColumns);

        // send the update to the server
        reorderKanbanColumnsResponse.mutate({
          projectId,
          columnIds: newColumnIds,
        });
      }
    }
  };

  // sensor configuration
  const sensors = useSensors(
    useSensor(
      //? this sensor targets mouse clicks, touch and pointer events
      PointerSensor,
      {
        activationConstraint: {
          //? prevent accidental drags: user must move the pointer at least 8 pixels before a drag operation begins
          distance: 8,
        },
      }
    )
  );

  const handleEditColumn = (colData: UpdatedColumnData | string) => {
    if (typeof colData === 'string') {
      createColumnResponse.mutate(colData);
    } else {
      updateKanbanColumnResponse.mutate(colData);
    }
  };

  const handleDeleteCol = (columnId: string) => {
    deleteKanbanColumnResponse.mutate(columnId);
  };

  return (
    //? closest center collision detection: measures distance from center point of the dragged item and the center of each potential drop target. Target with the shortest distance is selected as drop target.
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} collisionDetection={closestCenter}>
      <div className="flex justify-end px-2">
        <KanbanColumnDetailsDialog
          trigger={
            <Button className="font-heading cursor-pointer">
              <ListPlus />
              Add Column
            </Button>
          }
          submitHandler={handleEditColumn}
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
            {/* //? optimizes the drag and drop algorithm for horiontally scrolled lists */}
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
              {localColumns?.map((col) => (
                <KanbanColumn
                  key={col.columnId}
                  column={col}
                  isDeletePending={deleteKanbanColumnResponse.isPending}
                  onDeleteCol={handleDeleteCol}
                  isEditPending={updateKanbanColumnResponse.isPending}
                  onEditCol={handleEditColumn}
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
              onDeleteCol={handleDeleteCol}
              isDeletePending={deleteKanbanColumnResponse.isPending}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
