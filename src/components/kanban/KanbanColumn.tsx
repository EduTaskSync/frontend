import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Pencil, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  KanbanColumn as Column,
  ColumnTasksResponse,
  NewTaskData,
  UpdatedColumnData,
  UpdatedTaskData,
} from '@/hooks/projects/kanban/kanbanInterfaces';
import { DeleteKanbanColumnDialog } from './DeleteKanbanColumnDialog';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumnDetailsDialog } from './KanbanColumnDetailsDialog';
import { useKanbanTasks } from '@/hooks/projects/kanban/useKanban';
import { useParams } from 'react-router';
import { CustomError } from '@/utils/ErrorClasses';
import { TaskCard } from './TaskCard';
import { KanbanTaskDetailsDialog } from './KanbanTaskDetailsDialog';
import { DefaultColumns, getColumnStyle } from '@/lib/utils';
import { CardSkeleton } from '../CardSkeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';

interface KanbanColumnProps {
  column: Column;
  onDeleteCol: (columnId: string) => void;
  isDeletePending: boolean;
  onEditCol?: (updatedColumn: UpdatedColumnData) => void;
  isEditPending?: boolean;
}

export const KanbanColumn = ({ column, onDeleteCol, isDeletePending, isEditPending, onEditCol }: KanbanColumnProps) => {
  const { projectId } = useParams();
  const { createKanbanTaskResponse, deleteKanbanTaskResponse, getKanbanTasksResponse, updateKanbanTaskResponse } =
    useKanbanTasks(projectId!, column.columnId);

  const { data, isLoading, isError, error } = getKanbanTasksResponse as {
    data: ColumnTasksResponse;
    isLoading: boolean;
    isError: boolean;
    error: CustomError;
  };

  //! optimistic update using local state

  const { headerClass, accent } = getColumnStyle(column.columnName);
  const isDefaultColumn = Object.values(DefaultColumns).includes(column.columnName as DefaultColumns);

  //? attributes: An object containing accessibility attributes that should be applied to the draggable element to ensure proper accessibility support
  //? listeners: Event listeners that should be spread onto the draggable element to enable drag-and-drop interactions.
  //? transition: Controls how the item animates back to its place after dropping.
  //? transform: An object that can change how far the item has moved while being dragged
  const { setNodeRef, listeners, transform, transition, attributes, isDragging } = useSortable({
    // unique id for each column
    id: column.columnId,
    // optinal additional data
    data: {
      type: 'Column',
      column,
    },
  });
  const style = {
    transition,
    // converts the transform object into a usable CSS string like translate3d(100px, 0, 0).
    transform: CSS.Transform.toString(transform),
  };

  //? define task ids for dnd kit
  const taskIds = useMemo(() => {
    return data.tasks.map((task) => task.taskId);
  }, [data.tasks]);

  // dynamically generate the border gradient class based on column type
  const borderGradient =
    accent === 'blue'
      ? 'from-blue-400 via-cyan-300 to-blue-500'
      : accent === 'amber'
        ? 'from-amber-400 via-orange-300 to-amber-500'
        : accent === 'emerald'
          ? 'from-emerald-400 via-green-300 to-emerald-500'
          : 'from-violet-400 via-fuchsia-300 to-purple-400'; // Brighter gradient for default columns

  const submitTaskDetails = (data: NewTaskData | UpdatedTaskData) => {
    if ('taskId' in data) {
      updateKanbanTaskResponse.mutate(data);
    } else {
      createKanbanTaskResponse.mutate(data);
    }
  };

  const onDeleteTask = (taskId: string) => {
    deleteKanbanTaskResponse.mutate(taskId);
  };

  return (
    <div
      ref={setNodeRef}
      style={style} // This style includes the transition from useSortable
      className={cn(
        `w-[420px] p-[2px] rounded-xl bg-gradient-to-br ${borderGradient} shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] hover:shadow-[0_0px_15px_5px_rgba(56,189,248,0.15)]`,
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
    >
      <Card className="flex flex-col h-[800px] w-full rounded-[calc(0.75rem-1px)] border-0 shadow-sm overflow-hidden bg-card/95 backdrop-blur-sm ">
        <CardHeader className={cn(headerClass, 'mx-3 mt-3 p-2 pb-1 border rounded-xl backdrop-blur-sm')}>
          {/* Combined row: Compact layout with all elements */}
          <div className="flex items-center gap-2 w-full">
            {/* Left: Edit button (if not default column) */}
            {!isDefaultColumn ? (
              <KanbanColumnDetailsDialog
                prefillColData={{ columnId: column.columnId, columnName: column.columnName }}
                isSubmitting={isEditPending ?? false}
                submitHandler={(data) => {
                  if (typeof data === 'string') {
                    console.warn('Unexpected string data in edit operation');
                    return;
                  }
                  onEditCol?.(data);
                }}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-8 w-8 rounded-full hover:bg-foreground/10"
                    title="Edit column name"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
            ) : (
              <div className="flex-shrink-0 w-8" aria-hidden="true"></div>
            )}

            {/* Center: Column name and badge */}
            <div className="flex-1 flex flex-col items-center">
              <CardTitle
                {...attributes}
                {...listeners}
                className={cn(
                  'font-heading text-base truncate w-full text-center mb-1',
                  isDragging ? 'cursor-grabbing' : 'hover:cursor-grab'
                )}
              >
                {column.columnName}
              </CardTitle>

              <Badge
                variant="outline"
                className={cn(
                  'font-heading text-xs px-2 py-0 h-5 bg-background/80 backdrop-blur-sm',
                  `border-${accent}-500/40 text-${accent}-600 dark:text-${accent}-400 shadow-sm`
                )}
              >
                {data?.tasks?.length || 0} Tasks
              </Badge>
            </div>

            {/* Right: Delete button (if not default column) */}
            {!isDefaultColumn ? (
              <DeleteKanbanColumnDialog
                isSubmitting={isDeletePending ?? false}
                column={column}
                onDeleteColumn={onDeleteCol}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    title="Delete column"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
              />
            ) : (
              <div className="flex-shrink-0 w-8" aria-hidden="true"></div>
            )}
          </div>
        </CardHeader>

        {/* Add Task Button - Only shown for "To Do" column */}
        {column.columnName === DefaultColumns.Todo && (
          <div className="flex items-center justify-center w-full px-3 py-2">
            <KanbanTaskDetailsDialog
              isSubmitting={createKanbanTaskResponse.isPending}
              onSubmitHandler={submitTaskDetails}
              columnId={column.columnId}
              trigger={
                <Button variant="outline" size="sm" className="cursor-pointer font-heading font-bold w-full">
                  Add Task
                </Button>
              }
            />
          </div>
        )}

        {/* CardContent - replace overflow-y-auto with ScrollArea */}
        <CardContent className="flex-1 p-3 pt-2 space-y-3 overflow-hidden">
          {/* Task List */}
          <div className="h-full">
            {isLoading ? (
              <div className="space-y-2">
                <CardSkeleton variant="task" count={3} containerClassName="grid grid-cols-1 gap-2" />
              </div>
            ) : isError ? (
              // Error state remains the same
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex flex-col items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {error instanceof CustomError ? error.title : 'Failed to load tasks'}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    {error instanceof Error ? error.message : 'Please try again later'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 border-destructive/20 hover:bg-destructive/10 gap-1.5"
                    onClick={() => getKanbanTasksResponse.refetch()}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Try Again
                  </Button>
                </div>
              </div>
            ) : data?.tasks?.length > 0 ? (
              // Apply right padding to ScrollArea to prevent content touching edge if scrollbar *was* there
              <ScrollArea className="h-full px-5">
                <SortableContext items={taskIds}>
                  <div className="space-y-2 pb-2">
                    {' '}
                    {/* Removed px-1, padding handled by ScrollArea */}
                    {data.tasks.map((task) => (
                      <TaskCard
                        key={task.taskId}
                        onDeleteTask={onDeleteTask}
                        task={task}
                        accent={accent}
                        isDeletePending={deleteKanbanTaskResponse.isPending}
                        isEditPending={updateKanbanTaskResponse.isPending}
                        onEditTask={submitTaskDetails}
                      />
                    ))}
                  </div>
                </SortableContext>
              </ScrollArea>
            ) : (
              // No tasks (empty state)
              <div
                className={cn(
                  'rounded-lg border border-dashed p-4 flex flex-col items-center justify-center h-32 transition-all duration-200',
                  `hover:border-${accent}-400/40 border-border/70 bg-${accent}-500/5`
                )}
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">No tasks in this column yet</p>
                  <p className="text-xs text-muted-foreground/80">Create a task using the button above</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
