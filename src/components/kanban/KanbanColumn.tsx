import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ClipboardPlus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { KanbanColumn as Column } from '@/hooks/projects/kanban/kanbanInterfaces';
import { DeleteKanbanColumnDialog } from './DeleteKanbanColumnDialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanColumnProps {
  column: Column;
  onDeleteCol: (columnId: string) => void;
  isDeletePending: boolean;
}

const getColumnStyle = (colType: string) => {
  switch (colType) {
    case 'To Do':
      return {
        headerClass: 'bg-blue-500/10 border-b-blue-500/20 text-blue-500',
        borderClass: 'border-t-blue-500/30',
        gradientClass: 'from-blue-500/5 to-transparent',
        accent: 'blue',
      };
    case 'In Progress':
      return {
        headerClass: 'bg-amber-500/10 border-b-amber-500/20 text-amber-500',
        borderClass: 'border-t-amber-500/30',
        gradientClass: 'from-amber-500/5 to-transparent',
        accent: 'amber',
      };
    case 'Done':
      return {
        headerClass: 'bg-emerald-500/10 border-b-emerald-500/20 text-emerald-500',
        borderClass: 'border-t-emerald-500/30',
        gradientClass: 'from-emerald-500/5 to-transparent',
        accent: 'emerald',
      };
    default:
      return {
        headerClass: 'bg-primary/10 border-b-primary/20 text-primary',
        borderClass: 'border-t-primary/30',
        gradientClass: 'from-primary/5 to-transparent',
        accent: 'purple',
      };
  }
};

enum DefaultColumns {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export const KanbanColumn = ({ column, onDeleteCol, isDeletePending }: KanbanColumnProps) => {
  const { borderClass, gradientClass, headerClass, accent } = getColumnStyle(column.columnName);
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

  // dynamically generate the border gradient class based on column type
  const borderGradient =
    accent === 'blue'
      ? 'from-blue-400 via-cyan-300 to-blue-500'
      : accent === 'amber'
        ? 'from-amber-400 via-orange-300 to-amber-500'
        : accent === 'emerald'
          ? 'from-emerald-400 via-green-300 to-emerald-500'
          : 'from-purple-400 via-pink-300 to-indigo-400';

  // show a placeholder layout to mimic the column's shadow while dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`w-[350px] p-[2px] rounded-xl bg-gradient-to-br ${borderGradient} shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_15px_5px_rgba(56,189,248,0.15)] opacity-50`}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-[350px] p-[2px] rounded-xl bg-gradient-to-br ${borderGradient} shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_15px_5px_rgba(56,189,248,0.15)]`}
    >
      <Card className="flex flex-col h-[700px] w-full rounded-[calc(0.75rem-1px)] border-0 shadow-sm overflow-hidden bg-card/95 backdrop-blur-sm ">
        <CardHeader
          className={cn(
            headerClass,
            '  mx-3 mt-3 p-3 border rounded-xl flex flex-row items-center justify-between backdrop-blur-sm'
          )}
        >
          {/* Left side: Task count badge */}
          <Badge
            variant="outline"
            className={`font-heading text-xs px-2.5 py-0.5 bg-background/40 backdrop-blur-sm border-${accent}-500/30 text-${accent}-400`}
          >
            4 Tasks
          </Badge>

          {/* Center: Column name */}
          <CardTitle
            {...attributes}
            {...listeners}
            className=" cursor-grabbing font-heading text-lg truncate text-center"
          >
            {column.columnName}
          </CardTitle>

          {/* Right side: Add task button or Delete column button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-foreground/10"
              title="Add Task"
            >
              <ClipboardPlus className="h-4 w-4" />
              <span className="sr-only">Add Task</span>
            </Button>

            {!isDefaultColumn && (
              <DeleteKanbanColumnDialog
                isSubmitting={isDeletePending}
                column={column}
                onDeleteColumn={onDeleteCol}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive ml-1"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete column</span>
                  </Button>
                }
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-2">
            {/* You can add task cards here later */}
            <div className="rounded-lg border border-dashed border-border/70 p-4 flex items-center justify-center h-24 text-muted-foreground text-sm text-center">
              No tasks yet. Click "+" to create one.
            </div>
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            borderClass,
            gradientClass,
            'p-2 flex items-center justify-center border-t bg-gradient-to-b backdrop-blur-sm'
          )}
        >
          <div className="text-xs text-center text-muted-foreground font-medium">Drag tasks here</div>
        </CardFooter>
      </Card>
    </div>
  );
};
