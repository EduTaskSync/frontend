import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useKanbanColumns, useKanbanTaskMove } from '@/hooks/projects/kanban/useKanban';
import { useLoaderData, useNavigation } from 'react-router';
import {
  GetKanbanColumnsResponse,
  KanbanColumn as Column,
  UpdatedColumnData,
  Task,
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
  DragOverEvent,
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

  //? local state for column drag and drop
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [localColumns, setLocalColumns] = useState<Column[]>([]);
  const { moveTaskBetweenColumnsResponse } = useKanbanTaskMove();

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

  // check if we are loading data from either the router or the query
  const isLoadingData = isLoading || navigation.state === 'loading';

  // store all the column ids in an array for dnd to keep track of the sorted items
  //? useMemo so that this function is only executed if the dependencies change
  const columnIds = useMemo(() => localColumns?.map((col) => col.columnId) || [], [localColumns]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveColumn(event.active.data.current.task);
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

        //? loop thru all local columns adn update their column indexes
        const updatedColumns = newColumnIds.map((colId, index) => {
          const column = localColumns.find((col) => col.columnId === colId);
          return {
            ...column!,
            columnIndex: index,
          };
        });

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

  const onDragOver = (event: DragOverEvent) => {
    //? case: dropping a task between columns
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // //? drag and drop a task between two columns
    const isActiveATask = active?.data?.current?.id === 'Task';
    const isOverAColumn = over?.data?.current?.id === 'Column';
    const isOverATask = over?.data?.current?.id === 'Task';

    if (isActiveATask) {
      const task: Task = active.data.current?.task;

      if (isOverAColumn) {
        //! dropping over a column: task gets added to the start
        const targetColumn: Column = over?.data.current?.column;

        if (task.columndId === targetColumn.columnId) {
          return;
        }

        moveTaskBetweenColumnsResponse.mutate({
          taskId: task.taskId,
          targetColumnId: targetColumn.columnId,
          taskIndex: 0,
          projectId,
          sourceColumnId: task.columndId,
        });
      } else if (isOverATask) {
        const targetTask: Task = over.data.current?.task;
        // do nothing: task dropped back to previous column / task dropped to previous position
        if (
          task.taskId === targetTask.taskId ||
          (task.columndId === targetTask.columndId && Math.abs(task.taskIndex - targetTask.taskIndex) <= 1)
        ) {
          return;
        }

        moveTaskBetweenColumnsResponse.mutate({
          taskId: task.taskId,
          targetColumnId: targetTask.columndId,
          taskIndex: targetTask.taskIndex + 1,
          projectId,
          sourceColumnId: task.columndId,
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
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
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

      <ScrollArea className="h-full m-4 pb-4">
        {isLoadingData ? (
          <div className="mt-8 px-3 mb-6">
            {' '}
            {/* Increased bottom margin */}
            <CardSkeleton variant="kanban-column" count={3} horizontal={true} containerClassName="gap-10" />
          </div>
        ) : (
          <div className="flex mt-8 px-2 gap-x-8 mb-6">
            {' '}
            {/* Increased bottom margin */}
            {/* //? optimizes the drag and drop algorithm for horizontally scrolled lists */}
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
        <ScrollBar orientation="horizontal" className="mt-2" /> {/* Added top margin to the scrollbar */}
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
