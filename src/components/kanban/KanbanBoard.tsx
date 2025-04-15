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
import { cn } from '@/lib/utils';
import { getColumnStyle } from '@/lib/utils';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const navigation = useNavigation();
  const initialData = useLoaderData<GetKanbanColumnsResponse>();
  const { moveTaskBetweenColumnsResponse } = useKanbanTaskMove();
  const {
    getKanbanColumnsResponse,
    deleteKanbanColumnResponse,
    createColumnResponse,
    reorderKanbanColumnsResponse,
    updateKanbanColumnResponse,
  } = useKanbanColumns(projectId);

  const { data = initialData, isLoading } = getKanbanColumnsResponse;

  //? local state for column drag and drop
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [localColumns, setLocalColumns] = useState<Column[]>([]);

  //? local state for taks drag and drop
  const [tasks, setTasks] = useState<Task[] | null>([]);

  // initialize and update localColumns whenever data changes from the server
  useEffect(() => {
    if (data?.columns) {
      // sort columns by their index
      const sortedColumns = [...data.columns].sort((a, b) => a.columnIndex - b.columnIndex);
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
    } else if (event.active.data.current?.type === 'Task') {
      // Initialize tasks array with the active task
      setTasks([event.active.data.current.task]);
    }
  };

  //! purely for rendering the drop preview between columns for task dnd
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveATask) {
      return;
    }

    // Task over Task - Show preview when dragging task over another task
    if (isActiveATask && isOverATask) {
      const draggedTask = active.data.current?.task;
      const targetTask = over.data.current?.task;

      // Only proceed if tasks are in different columns or positions
      if (draggedTask.columnId !== targetTask.columnId) {
        setTasks((prev) => {
          if (!prev) return [draggedTask]; // Initialize if null

          // Create a deep copy of the tasks and update the dragged task's column
          const updatedTasks = prev.map((t) =>
            t.taskId === draggedTask.taskId ? { ...t, columnId: targetTask.columnId } : t
          );

          return updatedTasks;
        });
      }
    }

    // Task over Column - Show preview when dragging task directly over a column
    else if (isActiveATask && isOverAColumn) {
      const draggedTask = active.data.current?.task;
      const targetColumn = over.data.current?.column;

      // Only change state if dragging to a different column
      if (draggedTask.columnId !== targetColumn.columnId) {
        setTasks((prev) => {
          if (!prev) return [draggedTask]; // Initialize if null

          // Create a deep copy of the tasks and update the dragged task's column
          const updatedTasks = prev.map((t) =>
            t.taskId === draggedTask.taskId ? { ...t, columnId: targetColumn.columnId } : t
          );

          return updatedTasks;
        });
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveColumn(null);
    setTasks(null);

    if (!over || !active.data.current || !over.data.current) return;

    // Handle column reordering
    if (active.data.current?.type === 'Column' && over.data.current.type === 'Column') {
      const activeId = active.id as string;
      const overId = over.id as string;

      const oldIndex = columnIds.indexOf(activeId);
      const newIndex = columnIds.indexOf(overId);

      if (oldIndex !== newIndex) {
        // dnd function that swaps the columns for us
        const newColumnIds = arrayMove(columnIds, oldIndex, newIndex);
        const updatedColumns = newColumnIds.map((colId, index) => {
          const column = localColumns.find((col) => col.columnId === colId);
          return { ...column!, columnIndex: index };
        });
        setLocalColumns(updatedColumns);
        reorderKanbanColumnsResponse.mutate({ projectId, newColumns: updatedColumns });
      }
    }

    // Handle task movement
    if (active.data.current?.type === 'Task') {
      const task = active.data.current.task;

      // Moving to a column
      if (over.data.current?.type === 'Column') {
        const targetColumn = over.data.current.column;
        if (task.columnId !== targetColumn.columnId) {
          moveTaskBetweenColumnsResponse.mutate({
            taskId: task.taskId,
            targetColumnId: targetColumn.columnId,
            taskIndex: 0,
            projectId,
            sourceColumnId: task.columnId,
          });
        }
      }
      // Moving to another task's position
      else if (over.data.current?.type === 'Task') {
        const targetTask = over.data.current.task;
        if (
          task.taskId !== targetTask.taskId &&
          !(task.columnId === targetTask.columnId && Math.abs(task.taskIndex - targetTask.taskIndex) <= 1)
        ) {
          moveTaskBetweenColumnsResponse.mutate({
            taskId: task.taskId,
            targetColumnId: targetTask.columnId,
            taskIndex: targetTask.taskIndex + 1,
            projectId,
            sourceColumnId: task.columnId,
          });
        }
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
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
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
            <div className="opacity-90 w-[420px] p-[2px] rounded-xl">
              <div
                className={cn(
                  'w-[420px] p-[2px] rounded-xl',
                  `bg-gradient-to-br ${(() => {
                    const { accent } = getColumnStyle(activeColumn.columnName);
                    return accent === 'blue'
                      ? 'from-blue-400/50 via-cyan-300/50 to-blue-500/50'
                      : accent === 'amber'
                        ? 'from-amber-400/50 via-orange-300/50 to-amber-500/50'
                        : accent === 'emerald'
                          ? 'from-emerald-400/50 via-green-300/50 to-emerald-500/50'
                          : 'from-violet-400/50 via-fuchsia-300/50 to-purple-500/50';
                  })()}`
                )}
              >
                <div className="flex flex-col h-[800px] w-full rounded-[calc(0.75rem-1px)] border-0 shadow-sm bg-card/95 backdrop-blur-sm">
                  {/* Empty placeholder with matching dimensions */}
                </div>
              </div>
            </div>
          )}
          {tasks && (
            <div className="opacity-90 m-4 w-full h-full rounded-xl max-w-[400px] border shadow-sm bg-card/95">
              <div className="p-4" />
            </div>
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
