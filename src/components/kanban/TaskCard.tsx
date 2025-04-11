import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarClock, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/hooks/projects/kanban/kanbanInterfaces';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accent } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  accent?: Accent;
}

export const TaskCard = ({ task, accent = Accent.Violet }: TaskCardProps) => {
  // Set up drag and drop functionality
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.taskId,
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'border shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing',
        isDragging ? 'shadow-md ring-2 ring-primary/20 z-10' : 'hover:shadow-md hover:-translate-y-[2px]',
        isPastDeadline ? 'bg-destructive/5 hover:bg-destructive/10' : 'bg-card'
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 space-y-2">
        {/* Task title */}
        <h3 className="font-heading text-sm font-medium leading-tight">{task.taskName}</h3>

        {/* Task metadata */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Created at */}
          <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
            <Clock className="h-3 w-3" />
            <span>Created {format(formattedCreationDate, 'MMM d')}</span>
          </div>

          {/* Deadline */}
          <Badge
            variant={isPastDeadline ? 'destructive' : 'outline'}
            className={cn(
              'py-0 h-5 text-[10px] font-normal',
              !isPastDeadline && `border-${accent}-500/30 text-${accent}-600 dark:text-${accent}-400`
            )}
          >
            <CalendarClock className="h-3 w-3 mr-1" />
            Due {format(formattedDeadline, 'MMM d')}
          </Badge>
        </div>

        {/* Assignees */}
        {task.taskAssignees && task.taskAssignees.length > 0 && (
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-muted-foreground">
              {task.taskAssignees.length === 1 ? 'Assignee' : 'Assignees'}:
            </span>

            <AvatarGroup limit={3}>
              {task.taskAssignees.map((assignee) => (
                <Avatar key={assignee.userId} className="h-6 w-6">
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
      </CardContent>
    </Card>
  );
};
