import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { KanbanColumn as Column, UpdatedColumnData } from '@/hooks/projects/kanban/kanbanInterfaces';
import { DeleteKanbanColumnDialog } from './DeleteKanbanColumnDialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumnDetailsDialog } from './KanbanColumnDetailsDialog';

interface KanbanColumnProps {
  column: Column;
  onDeleteCol: (columnId: string) => void;
  isDeletePending: boolean;
  onEditCol?: (updatedColumn: UpdatedColumnData) => void;
  isEditPending?: boolean;
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
      // Brighter purple for better readability
      return {
        headerClass: 'bg-violet-500/15 border-b-violet-500/25 text-violet-500',
        borderClass: 'border-t-violet-500/30',
        gradientClass: 'from-violet-500/5 to-transparent',
        accent: 'violet', // Changed from 'purple' to 'violet' for better contrast
      };
  }
};

enum DefaultColumns {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export const KanbanColumn = ({ column, onDeleteCol, isDeletePending, isEditPending, onEditCol }: KanbanColumnProps) => {
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
          : 'from-violet-400 via-fuchsia-300 to-purple-400'; // Brighter gradient for default columns

  // show a placeholder layout to mimic the column's shadow while dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`w-[400px] p-[2px] rounded-xl bg-gradient-to-br ${borderGradient} shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_15px_5px_rgba(56,189,248,0.15)] opacity-50`}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-[400px] p-[2px] rounded-xl bg-gradient-to-br ${borderGradient} shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_15px_5px_rgba(56,189,248,0.15)]`}
    >
      <Card className="flex flex-col h-[700px] w-full rounded-[calc(0.75rem-1px)] border-0 shadow-sm overflow-hidden bg-card/95 backdrop-blur-sm ">
        <CardHeader className={cn(headerClass, 'mx-3 mt-3 p-3 border rounded-xl backdrop-blur-sm')}>
          {/* Three-column layout for the header */}
          <div className="flex items-center justify-between w-full min-h-[40px]">
            {/* Left: Edit button (if not default column) or empty placeholder */}
            <div className="flex-shrink-0 w-10">
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
                      className=" cursor-pointer h-9 w-9 rounded-full hover:bg-foreground/10"
                      title="Edit column name"
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  }
                />
              ) : (
                <div className="h-9 w-9" aria-hidden="true"></div>
              )}
            </div>

            {/* Center: Column name */}
            <CardTitle
              {...attributes}
              {...listeners}
              className="cursor-grabbing font-heading text-lg truncate text-center flex-1"
            >
              {column.columnName}
            </CardTitle>

            {/* Right: Delete button (if not default column) or empty placeholder */}
            <div className="flex-shrink-0 w-10 flex justify-end">
              {!isDefaultColumn ? (
                <DeleteKanbanColumnDialog
                  isSubmitting={isDeletePending ?? false}
                  column={column}
                  onDeleteColumn={onDeleteCol}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className=" cursor-pointer h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5 text-destructive " />
                      <span className="sr-only">Delete column</span>
                    </Button>
                  }
                />
              ) : (
                <div className="h-9 w-9" aria-hidden="true"></div>
              )}
            </div>
          </div>

          {/* Task count badge - centered and more readable */}
          <div className="flex justify-center w-full mt-2">
            <Badge
              variant="outline"
              className={cn(
                'font-heading text-sm px-3 py-1 bg-background/80 backdrop-blur-sm',
                `border-${accent}-500/40 text-${accent}-600 dark:text-${accent}-400 shadow-sm`
              )}
            >
              4 Tasks
            </Badge>
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
