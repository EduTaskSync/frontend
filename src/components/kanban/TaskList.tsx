import { TaskCard } from './TaskCard';
import { useTasks } from '@/hooks/tasks/useTasks';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomError } from '@/utils/ErrorClasses';
import { useParams } from 'react-router';
import { TaskSummaryListResponse } from '@/hooks/tasks/taskInterfaces';
import { Spinner } from '../ui/spinner';

export const TaskList = () => {
  const { groupId, projectId, columnId } = useParams<{ groupId: string; projectId: string; columnId: string }>();

  const { fetchTasksSummaryResponse } = useTasks(columnId);
  const { data, isLoading, isError, error } = fetchTasksSummaryResponse as {
    data: TaskSummaryListResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
  };

  // Get tasks from the response or default to empty array
  const tasks = data?.tasks || [];

  if (isError) {
    return (
      <div className="w-full p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <h4 className="font-heading font-semibold text-foreground">
            {error instanceof CustomError ? error.title : 'Failed to load projects'}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-destructive/20 hover:bg-destructive/10 hover:cursor-pointer"
            onClick={() => fetchTasksSummaryResponse.refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
          <Spinner className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm">Loading tasks...</span>
        </div>
      ) : tasks.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {tasks.map((task) => (
            <div key={task.taskName} className="w-full">
              <TaskCard task={task} groupId={groupId || ''} projectId={projectId || ''}/>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
          No tasks yet. Click Add task to get started.
        </div>
      )}
    </div>
  );
};
