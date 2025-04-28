import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { TaskBaseResponse } from '@/hooks/dashboard/taskInterface';

interface TaskCardProps {
  task: TaskBaseResponse;
  isOverdue: (task: TaskBaseResponse) => boolean;
  isDueToday: (task: TaskBaseResponse) => boolean;
  onClick?: (taskId: string) => void;
}

export function TaskCard({ task, onClick, isOverdue, isDueToday }: TaskCardProps) {
  // Format date to display
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  // Get task card styling based on status
  const getTaskCardStyle = () => {
    if (task.status === 'Done') {
      return 'border-green-800/40 bg-green-950/40 backdrop-blur-md';
    } else if (isOverdue(task)) {
      return 'border-destructive/50 bg-destructive/20 backdrop-blur-md';
    } else if (isDueToday(task)) {
      return 'border-amber-800/40 bg-amber-950/40 backdrop-blur-md';
    } else if (task.status === 'In Progress') {
      return 'border-blue-800/40 bg-blue-950/40 backdrop-blur-md';
    } else {
      return 'border-border/60 bg-card/40 backdrop-blur-md';
    }
  };

  // Get task status badge
  const getTaskStatusBadge = () => {
    if (task.status === 'Completed') {
      return <Badge className="bg-green-900 text-green-100 hover:bg-green-800">Completed</Badge>;
    } else if (isOverdue(task)) {
      return <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Overdue</Badge>;
    } else if (isDueToday(task)) {
      return <Badge className="bg-amber-900 text-amber-100 hover:bg-amber-800">Due Today</Badge>;
    } else if (task.status === 'In Progress') {
      return <Badge className="bg-blue-900 text-blue-100 hover:bg-blue-800">In Progress</Badge>;
    } else {
      return <Badge className="bg-secondary text-secondary-foreground">To Do</Badge>;
    }
  };
  // Get status icon
  const getStatusIcon = () => {
    if (task.status === 'Completed') {
      return <CheckCircle2 className="h-3 w-3 text-green-400" />;
    } else if (isOverdue(task)) {
      return <AlertCircle className="h-3 w-3 text-destructive" />;
    } else if (isDueToday(task)) {
      return <Clock className="h-3 w-3 text-amber-400" />;
    } else if (task.status === 'In Progress') {
      return <Timer className="h-3 w-3 text-blue-400" />;
    } else {
      return <Calendar className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border transition-colors',
        getTaskCardStyle()
      )}
      onClick={() => onClick?.(task.taskId)}
    >
      {/* Task status indicator */}
      <div className="self-end sm:self-auto">{getTaskStatusBadge()}</div>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'font-medium mb-1 truncate',
            task.status === 'Completed' ? 'line-through text-green-300' : '',
            isOverdue(task) ? 'text-destructive' : '',
            isDueToday(task) ? 'text-amber-200' : ''
          )}
        >
          {task.taskName}
        </h3>

        <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground mt-1">
          <Badge variant="outline" className="bg-background/20">
            {task.projectName}
          </Badge>

          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span
              className={cn(
                isOverdue(task) ? 'text-destructive' : '',
                isDueToday(task) ? 'text-amber-300' : '',
                task.status === 'Completed' ? 'text-green-300' : ''
              )}
            >
              {formatDate(task.taskDeadline)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
