import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarClock, Clock, Trash2, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewTaskData, Task, UpdatedTaskData } from '@/hooks/projects/kanban/kanbanInterfaces';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accent } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DeleteKanbanTaskDialog } from './DeleteKanbanTaskDialog';
import { KanbanTaskDetailsDialog } from './KanbanTaskDetailsDialog';
import { useParams } from 'react-router';

interface TaskCardProps {
  task: Task;
  accent?: Accent;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (data: NewTaskData | UpdatedTaskData) => void;
  isDeletePending?: boolean;
  isEditPending?: boolean;
}

export const TaskCard = ({
  task,
  accent = Accent.Violet,
  onDeleteTask,
  onEditTask,
  isDeletePending = false,
  isEditPending = false,
}: TaskCardProps) => {
  // use non-null assertion to tell TypeScript projectId is never undefined
  const { projectId } = useParams<{ projectId: string }>();
  const assertedProjectId = projectId as string; // Type assertion

  // set up drag and drop functionality
  const { setNodeRef, listeners, transform, transition, attributes, isDragging } = useSortable({
    // unique id for each task
    id: task.taskId,
    // optinal additional data
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Format dates for display
  const formattedCreationDate = new Date(task.taskCreationTime);
  const formattedDeadline = new Date(task.taskDeadline);
  const isPastDeadline = new Date() > formattedDeadline;

  // Determine accent color for border gradients
  const borderGradient =
    accent === Accent.Blue
      ? 'from-blue-400/40 to-cyan-300/40'
      : accent === Accent.Amber
        ? 'from-amber-400/40 to-orange-300/40'
        : accent === Accent.Emerald
          ? 'from-emerald-400/40 to-green-300/40'
          : 'from-violet-400/40 to-purple-300/40';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-[1px] rounded-xl bg-gradient-to-br transition-all duration-200 cursor-grab active:cursor-grabbing group relative',
        borderGradient,
        isDragging ? 'shadow-lg ring-2 ring-primary/20 z-10' : 'hover:shadow-md hover:-translate-y-[2px]',
        isPastDeadline ? 'from-destructive/30 to-destructive/20' : ''
      )}
      {...attributes}
      {...listeners}
    >
      <Card className="rounded-[calc(0.75rem-1px)] border-0 shadow-sm overflow-hidden bg-card/95 backdrop-blur-sm">
        {/* Action buttons - appear on hover */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 z-10">
          {/* Edit button */}
          <KanbanTaskDetailsDialog
            columnId={task.columndId}
            prefillData={{
              taskId: task.taskId,
              taskName: task.taskName,
              taskDeadline: task.taskDeadline,
              projectId: assertedProjectId,
              columnId: task.columndId,
            }}
            isSubmitting={isEditPending}
            onSubmitHandler={onEditTask}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className=" cursor-pointer h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary shadow-sm"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />

          {/* Delete button */}
          <DeleteKanbanTaskDialog
            task={task}
            onDeleteTask={onDeleteTask}
            isSubmitting={isDeletePending}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className=" cursor-pointer h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
          />
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Task title with enhanced styling */}
          <h3 className="font-heading text-base font-medium leading-tight group-hover:text-primary transition-colors">
            {task.taskName}
          </h3>

          {/* Divider */}
          <div className="h-px w-full bg-border/50 my-1"></div>

          {/* Task metadata in a clean, organized layout */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Left: Date information */}
            <div className="flex flex-col gap-1.5">
              {/* Created at */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                <Clock className="h-3 w-3" />
                <span>Created on {format(formattedCreationDate, 'MMM d')}</span>
              </div>

              {/* Deadline with responsive badge */}
              <Badge
                variant={isPastDeadline ? 'destructive' : 'outline'}
                className={cn('py-0 h-5 text-[10px] font-normal', !isPastDeadline && 'border-primary/30 text-primary')}
              >
                <CalendarClock className="h-3 w-3 mr-1" />
                Due {format(formattedDeadline, 'MMM d')}
              </Badge>
            </div>

            {/* Right: Assignees */}
            {task.taskAssignees && task.taskAssignees.length > 0 && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {task.taskAssignees.length === 1 ? 'Assignee' : 'Assignees'}
                </span>

                <AvatarGroup limit={3} className="justify-end">
                  {task.taskAssignees.map((assignee) => (
                    <Avatar key={assignee.userId} className="h-6 w-6 border-card ring-1 ring-background/50">
                      <AvatarImage src={assignee.profilePicture} alt={`${assignee.firstName} ${assignee.lastName}`} />
                      <AvatarFallback className="text-[10px] bg-muted">
                        {assignee.firstName[0]}
                        {assignee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
