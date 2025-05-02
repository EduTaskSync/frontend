import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { Calendar, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CountdownTimer } from '../CountdownTimer';
import { TaskSummaryResponse } from '@/hooks/tasks/taskInterfaces';
import { useTasks } from '@/hooks/tasks/useTasks';
import { ButtonWithTooltip } from '../ButtonWithToolTip';
import { TaskData } from './KanbanBoard';

// Shape of the task object sent to the TaskCard component
interface TaskCardProps {
  task: TaskData;  //TaskSummaryResponse;
  groupId: string;
  projectId: string;
}

export const TaskCard = ({ task, groupId, projectId }: TaskCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteTaskResponse } = useTasks(task.taskName);
  
  // Use useRef to track the timeout for deletion
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format the due date to display
  const formattedDueDate = task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'No deadline';

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project page
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    //if (!isAdmin) {
    //  toast.error('You do not have permission to delete this task');
    //  return;
    //}
    setShowDeleteDialog(false);

    // Cancel any existing timeout first
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Create a timeout that will execute the delete after the toast duration
    const timeoutId = setTimeout(() => {
      deleteTaskResponse.mutate(task.taskName);
      // Clear the reference after executing
      deleteTimeoutRef.current = null;
    }, 4000); // Match sonner's default 4 second duration

    // Store the timeout ID in the ref
    deleteTimeoutRef.current = timeoutId;

    // Show toast with undo button
    toast.warning(`Deleting ${task.taskName}`, {
      description: (
        <div>
          <p>This task will be deleted in a few seconds</p>
          <CountdownTimer duration={4000} />
        </div>
      ),
      duration: 4000,
      action: {
        label: 'Undo',
        onClick: () => {
          // Clear the timeout if user clicks undo
          if (deleteTimeoutRef.current) {
            clearTimeout(deleteTimeoutRef.current);
            deleteTimeoutRef.current = null;
            toast.info(`Deletion of ${task.taskName} canceled`);
          }
        },
      },
    });
  };

  
  return (
    <div className="w-full p-[2px] rounded-xl bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_20px_5px_rgba(56,189,248,0.25)] hover:from-blue-500 hover:via-cyan-400 hover:to-teal-500 group/wrapper">
      <Link
        to={`/app/groups/${groupId}/projects/${projectId}/get_project_tasks`}
        state={{
          taskDetails: task,
        }}
        className="w-full group/card block h-full relative"
      >
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <ButtonWithTooltip
            variant="destructive"
            size="sm"
            className="h-9 w-9 rounded-full p-0 bg-destructive shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-destructive/90 hover:scale-105 transition-transform duration-150 cursor-pointer"
            onClick={handleDeleteClick}
            //disabled={!isAdmin}
            tooltipText={'Delete task'}
          >
            <Trash2 className="h-5 w-5 text-white" />
            <span className="sr-only">Delete Task</span>
          </ButtonWithTooltip>
        </div>

        <div
          className={cn(
            'cursor-pointer overflow-hidden relative h-[calc(9rem-4px)] rounded-[calc(0.75rem-1px)] shadow-sm flex flex-col justify-between p-4 transition-all duration-300 bg-card',
            'bg-cover bg-center'
          )}
        >
          {/* Base overlay with translucent black */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-[2px] opacity-60 transition-opacity duration-300 group-hover/card:opacity-75"></div>

          {/* Status-based gradient overlay */}
          <div
            //className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient()} opacity-40 transition-opacity duration-300 group-hover/card:opacity-60`}
          ></div>

          {/* Content container */}
          <div className="flex flex-col justify-end h-full z-10">
            <div className="inline-flex flex-col px-3 py-2 bg-black/30 border border-white/10 backdrop-blur-md rounded-lg transition-all duration-300 group-hover/card:bg-black/40 w-full">
              <h2 className="font-bold text-base text-primary-foreground font-heading tracking-tight mb-0.5 truncate">
                {task.taskName}
              </h2>

              {/* Task metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 backdrop-blur-sm border-white/10 text-white text-xs truncate max-w-[120px]"
                  >
                    <Calendar className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate text-[10px]">{formattedDueDate}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-xl">
              <span className="text-emerald-300">Delete Task</span>
            </AlertDialogTitle>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent"></div>
            <AlertDialogDescription className="font-sans text-base">
              <div className="mb-3">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">"{task.taskName}"</span>?
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-md">
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-destructive mt-0.5">•</span>
                    This task and resources will be permanently removed
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-destructive mt-0.5">•</span>
                  You can undo this action for a few seconds after confirmation
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="font-heading mt-4 space-x-3">
            <AlertDialogCancel className="hover:bg-background/80 transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow transition-all duration-200 hover:shadow-md"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
